import { consola } from "consola";
import { EventEmitter } from 'events';
import { setTimeout as wait } from 'timers/promises';

import type { ImapFlow } from 'imapflow';

let started = false;
let stopped = false;
let currentClient: ImapFlow | null = null;

const IMAP_EVENTS = ['flags', 'exists', 'expunge'] as const;
const FETCH_CONFIG = {
    uid: true,
    envelope: true,
    internalDate: true,
    flags: true,
    source: true
} as const;


const mapEventFlags = (eventType: string) => ({
    incoming: eventType === 'exists',
    update: eventType === 'flags',
    deleted: eventType === 'expunge',
});

const sendPushNotifications = async (data: any, eventFlags: any, unseen: number) => {
    if (!data) return;

    if (eventFlags.update) await useSendServiceWorkerPushEvent({
        data: { badgeCount: unseen },
        events: eventFlags
    });

    if (eventFlags.incoming) await useSendServiceWorkerPushEvent({
        data: {
            id: data.id,
            title: "Nieuw bericht binnengekomen",
            message: data.subject,
            url: `/berichten?id=${data.id}`,
            badgeCount: unseen,
        },
        events: eventFlags
    });

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
        } catch (error) { }
    };

    const connectAndWatch = async () => {
        let client: ImapFlow | null = null;
        let idleTimer: NodeJS.Timeout | null = null;

        try {

            client = await useConnectClient();
            currentClient = client;

            await useGetImapMailbox(client, 'INBOX');

            // Setup event listeners
            IMAP_EVENTS.forEach((event: string) => {
                const handler = async (mail: any) => {
                    const unseen = await unseenMessagesCount(client!);
                    const data = await useFetchImapSingleMessage(client!, mail.seq || mail.count, FETCH_CONFIG);
                    const eventFlags = mapEventFlags(event);

                    const payload = { data, events: eventFlags, unseen };
                    imapEmitter.emit('new', payload);

                    await sendPushNotifications(data, eventFlags, unseen);
                };
                eventHandlers.set(event, handler);
                client!.on(event as any, handler);
            })

            // Handle connection errors
            client.on('error', (err: Error) => {
                stopped = true; // Trigger reconnect
            });

            client.on('close', () => {
                consola.info('[IMAP Watcher] Connection closed');
            });

            // IDLE loop with timeout protection
            while (!stopped && client.authenticated) {
                try {

                    // Set timeout to force reconnect before IMAP timeout
                    const idlePromise = (client as any).idle?.();
                    const timeoutPromise = wait(IDLE_TIMEOUT).then(() => {
                        return 'timeout';
                    });

                    const result = await Promise.race([idlePromise, timeoutPromise]);

                    if (result === 'timeout') {
                        break; // Break to reconnect
                    }
                } catch (error) {
                    break; // Break to reconnect
                }
            }

        } catch (error) {
        } finally {
            if (idleTimer) {
                clearTimeout(idleTimer);
            }
            await cleanupClient(client);
            currentClient = null;
        }
    };

    // Main reconnection loop
    (async () => {
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

            } catch (error) {
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
        } catch (error) { }
        currentClient = null;
    }

    started = false;
};

export const getImapEmitter = () => imapEmitter;

const getFilteredMessageUids = async (client: ImapFlow, filter: string, search: string) => {
    const seen_filter = filter === "gelezen";
    const unseen_filter = filter === "ongelezen";
    const has_search = !!search;


    if (!has_search && !seen_filter && !unseen_filter) return [];

    const searchQuery: any = {};
    if (seen_filter || unseen_filter) searchQuery.seen = seen_filter;

    if (has_search) searchQuery.or = [
        { subject: search },
        { from: search },
        { body: search }
    ];

    const uids = await client.search(searchQuery);
    return uids === false ? [] : uids;
};

const buildFetchCriteria = (uids: number[], page: number, limit: number, start: number, end: number) => {
    if (uids.length > 0) {
        const sortedUids = [...uids].sort((a, b) => b - a);
        const pageUids = sortedUids.slice((page - 1) * limit, page * limit);

        return pageUids.join(',');
    }

    return `${start}:${end}`;
};

const fetchMessagesWithCriteria = async (client: ImapFlow, criteria: string) => {
    return await useFetchImapMessages(client, criteria, {
        uid: true,
        envelope: true,
        internalDate: true,
        flags: true,
        source: true,
    });
};

export const fetchImapMessages = async (client: ImapFlow, options: {
    limit: number,
    page: number,
    filter?: string,
    search?: string
}) => {
    const filter = options.filter as string;
    const search = options.search as string;
    const seen_filter = filter === "gelezen";
    const unseen_filter = filter === "ongelezen";
    const has_search = !!search;
    const hasFilterOrSearch = seen_filter || unseen_filter || has_search;

    const [mailbox, unseen, messageUids] = await Promise.all([
        useGetImapMailbox(client, 'INBOX'),
        unseenMessagesCount(client),
        hasFilterOrSearch ? getFilteredMessageUids(client, filter, search) : Promise.resolve([])
    ]);

    const totalMessages = hasFilterOrSearch ? messageUids.length : (mailbox.exists || 0);

    const { page, total, start, end } = makeImapPagination(
        totalMessages,
        options.page as number,
        options.limit as number
    );

    if (page > total || totalMessages === 0) return { data: null, unseen, error: true };

    const criteria = buildFetchCriteria(messageUids, page, options.limit as number, start, end);
    const messages = await fetchMessagesWithCriteria(client, criteria);

    return {
        data: {
            messages,
        },
        unseen,
        pagination: {
            current_page: page,
            total_Pages: total,
        }
    };
};
