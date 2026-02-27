import { consola } from "consola";
import { EventEmitter } from 'events';
import { setTimeout as wait } from 'timers/promises';

import type { ImapFlow } from 'imapflow';

let started = false;
let stopped = false;
let currentClient: ImapFlow | null = null;

let events = [
    'flags', 'exists', 'expunge'
]

const imapEmitter = new EventEmitter();
const IDLE_TIMEOUT = 25 * 60 * 1000; // 25 minutes (IMAP spec is 29 min, we reconnect earlier)
const MAX_RETRY_DELAY = 30_000;

export const startImapWatcher = async () => {
    if (started) {
        consola.info('[IMAP Watcher] Already started, skipping...');
        return;
    }

    started = true;
    stopped = false;

    const eventHandlers = new Map<string, (...args: any[]) => void>();

    const cleanupClient = async (client: ImapFlow | null) => {
        if (!client) return;

        try {

            events.forEach((event) => {
                const handler = eventHandlers.get(event);
                if (handler) {
                    client.off(event, handler);
                }
            });
            eventHandlers.clear();

            if (client.authenticated) {
                await client.logout();
            }
        } catch (error) {
            consola.error('[IMAP Watcher] Cleanup error:', error);
        }
    };

    const connectAndWatch = async () => {
        let client: ImapFlow | null = null;
        let idleTimer: NodeJS.Timeout | null = null;

        try {

            client = await useConnectClient();
            currentClient = client;

            await useGetImapMailbox(client, 'INBOX');

            // Setup event listeners
            events.forEach((event: string) => {

                const handler = async (mail: any) => {

                    const unseen = await unseenMessagesCount(client!)

                    const data = await useFetchImapSingleMessage(client!, mail.seq || mail.count, {
                        uid: true,
                        envelope: true,
                        internalDate: true,
                        flags: true,
                        source: true
                    })

                    const mailobject = {
                        data: data,
                        events: {
                            incoming: event === 'exists',
                            deleted: event === 'expunge',
                        },
                        unseen
                    }

                    imapEmitter.emit('new', mailobject);

                };
                eventHandlers.set(event, handler);
                client!.on(event as any, handler);
            })

            // Handle connection errors
            client.on('error', (err: Error) => {
                consola.error('[IMAP Watcher] Client error:', err);
                stopped = true; // Trigger reconnect
            });

            client.on('close', () => {
                consola.warn('[IMAP Watcher] Connection closed');
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
                    consola.error('[IMAP Watcher] IDLE error:', error);
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
                    consola.info('[IMAP Watcher] Stopped, not reconnecting');
                    break;
                }

                // Calculate exponential backoff delay
                attempt++;
                const delay = Math.min(MAX_RETRY_DELAY, 1000 * Math.pow(2, Math.min(6, attempt)));
                consola.info(`[IMAP Watcher] Reconnecting in ${delay / 1000} seconds...`);
                await wait(delay);

            } catch (error) {
                consola.error('[IMAP Watcher] Connection error:', error);
                await wait(5000); // Wait before retry
            }
        }

        started = false;
        consola.info('[IMAP Watcher] Exited reconnection loop');
    })();
};

export const stopImapWatcher = async () => {
    consola.info('[IMAP Watcher] Stopping watcher...');
    stopped = true;

    // Force close current client if exists
    if (currentClient) {
        try {
            await currentClient.logout();
        } catch (error) {
            consola.error('[IMAP Watcher] Error during logout:', error);
        }
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
