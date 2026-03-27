// @ts-ignore - incorrect typescript(TS2595) error for consola in this context
import { consola } from "consola";
import { EventEmitter } from "events";
import { setTimeout as wait } from "timers/promises";

import type { ImapFlow } from "imapflow";

let started = false;
let stopped = false;
let currentClient: ImapFlow | null = null;
const sentNotificationIds = new Map<string, number>(); // ID -> timestamp
const NOTIFICATION_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

const IMAP_EVENTS = ["flags", "exists", "expunge"] as const;
const FETCH_CONFIG = {
	uid: true,
	envelope: true,
	internalDate: true,
	flags: true,
	source: true,
} as const;

const mapEventFlags = (eventType: string) => ({
	incoming: eventType === "exists",
	update: eventType === "flags",
	deleted: eventType === "expunge",
});

const cleanupExpiredNotifications = () => {
	const now = Date.now();
	for (const [id, timestamp] of sentNotificationIds.entries()) {
		if (now - timestamp > NOTIFICATION_EXPIRY_MS) {
			sentNotificationIds.delete(id);
		}
	}
};

const sendPushNotifications = async (data: any, eventFlags: any, unseen: number) => {
	if (!data) return;

	if (eventFlags.update)
		await useSendServiceWorkerPushEvent({
			data: { badgeCount: unseen },
			events: eventFlags,
		});

	if (eventFlags.incoming) {
		const notificationId = data.id;

		cleanupExpiredNotifications();

		if (sentNotificationIds.has(notificationId)) return;
		sentNotificationIds.set(notificationId, Date.now());

		await useSendServiceWorkerPushEvent({
			data: {
				id: notificationId,
				title: "Nieuw bericht binnengekomen",
				message: data.subject,
				url: `/berichten?id=${data.id}`,
				badgeCount: unseen,
			},
			events: eventFlags,
		});
	}
};

const imapEmitter = new EventEmitter();
const IDLE_TIMEOUT = 25 * 60 * 1000; // 25 minutes (IMAP spec is 29 min, we reconnect earlier)
const MAX_RETRY_DELAY = 30_000;

export const startImapWatcher = async () => {
	if (started) return;

	started = true;
	stopped = false;

	const eventHandlers = new Map<string, (...args: any[]) => void>();

	const cleanupClient = async (client: ImapFlow | null) => {
		if (!client) return;

		try {
			IMAP_EVENTS.forEach((event) => {
				const handler = eventHandlers.get(event);
				if (handler) {
					client.off(event, handler);
				}
			});
			eventHandlers.clear();

			if (client.authenticated) {
				await client.logout();
			}
		} catch {}
	};

	const connectAndWatch = async () => {
		let client: ImapFlow | null = null;
		let idleTimer: NodeJS.Timeout | null = null;

		try {
			const { imap_client, imap_error } = await useConnectClient();

			if (imap_error || !imap_client) {
				throw new Error("Failed to connect to IMAP server");
			}

			client = imap_client;
			currentClient = client;

			await useGetImapMailbox(client, "INBOX");

			// Setup event listeners
			IMAP_EVENTS.forEach((event: string) => {
				const handler = async (mail: any) => {
					const eventFlags = mapEventFlags(event);
					const unseen = await unseenMessagesCount(client!);

					let data = null;

					if (eventFlags.deleted) await removeImapMessageFromCache(mail?.uid);
					if (!eventFlags.deleted) {
						const search = mail?.uid ?? mail?.seq ?? mail?.count;
						const fetchOpts = mail?.uid ? { uid: true } : undefined;

						data = await useFetchImapSingleMessage(client!, search, FETCH_CONFIG, fetchOpts as any);

						if (eventFlags.incoming) await upsertImapMessageCache(data);
						else if (eventFlags.update) await updateFlagsImapMessageCache(data);
					}

					const payload = { data, events: eventFlags, unseen };
					imapEmitter.emit("new", payload);

					await sendPushNotifications(data, eventFlags, unseen);
				};
				eventHandlers.set(event, handler);
				client!.on(event as any, handler);
			});

			// Handle connection errors
			client.on("error", () => {
				stopped = true; // Trigger reconnect
			});

			client.on("close", () => {
				consola.info("[IMAP Watcher] Connection closed");
			});

			// IDLE loop with timeout protection
			while (!stopped && client.authenticated) {
				try {
					// Set timeout to force reconnect before IMAP timeout
					const idlePromise = (client as any).idle?.();
					const timeoutPromise = wait(IDLE_TIMEOUT).then(() => {
						return "timeout";
					});

					const result = await Promise.race([idlePromise, timeoutPromise]);

					if (result === "timeout") {
						break; // Break to reconnect
					}
				} catch {
					break; // Break to reconnect
				}
			}
		} catch {
		} finally {
			if (idleTimer) {
				clearTimeout(idleTimer);
			}
			await cleanupClient(client);
			currentClient = null;
		}
	};

	// Main reconnection loop
	await (async () => {
		let attempt = 0;
		while (!stopped) {
			try {
				await connectAndWatch();

				if (stopped) {
					break;
				}

				// Calculate exponential backoff delay
				attempt++;
				const delay = Math.min(MAX_RETRY_DELAY, 1000 * Math.pow(2, Math.min(6, attempt)));
				consola.info(`[IMAP Watcher] Reconnecting in ${delay / 1000} seconds...`);
				await wait(delay);
			} catch {
				await wait(5000); // Wait before retry
			}
		}

		started = false;
	})();
};

export const stopImapWatcher = async () => {
	stopped = true;

	// Force close current client if exists
	if (currentClient) {
		try {
			await currentClient.logout();
		} catch {}
		currentClient = null;
	}

	started = false;
};

export const getImapEmitter = () => imapEmitter;

export const warmupImapCache = async () => {
	const { imap_client, imap_error } = await useConnectClient();
	if (imap_error || !imap_client) return;

	try {
		await useGetImapMailbox(imap_client, "INBOX");
		await refreshImapMessagesCache(imap_client, true);
	} catch {
		/* warmup is best-effort */
	} finally {
		try {
			await imap_client.logout();
		} catch {}
	}
};
