import { ImapFlow } from "imapflow";

export const IMAP_CACHE_NAME = "imap-messages";
export const IMAP_CACHE_KEY = "inbox";
export const IMAP_CACHE_MAX_AGE = 60 * 60 * 24 * 365;
export const IMAP_CACHE_STORAGE_KEY = `/cache:nitro/functions:${IMAP_CACHE_NAME}:${IMAP_CACHE_KEY}.json`;

const IMAP_FULL_FETCH_CONFIG = {
	uid: true,
	envelope: true,
	internalDate: true,
	flags: true,
	source: true,
} as const;

const readImapCacheEntry = async () => {
	const storage = useStorage();
	const entry = await storage.getItem<Record<string, any>>(IMAP_CACHE_STORAGE_KEY);

	if (entry && typeof entry === "object" && Array.isArray(entry.value)) {
		return { entry };
	}
	return null;
};

const writeImapCacheEntry = async (entry: Record<string, any>, messages: any[]) => {
	const storage = useStorage();
	const now = Date.now();

	await storage.setItem(IMAP_CACHE_STORAGE_KEY, {
		...entry,
		value: [...messages].sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()),
		mtime: now,
		expires: now + IMAP_CACHE_MAX_AGE * 1000,
	});
};

const updateCachedImapMessages = async (updater: (messages: any[]) => any[]) => {
	const cached = await readImapCacheEntry();
	if (!cached) return false;

	await writeImapCacheEntry(cached.entry, updater(cached.entry.value));
	return true;
};

const filterCachedMessages = (messages: any[], filter: string, search: string) => {
	const seenFilter = filter === "gelezen";
	const unseenFilter = filter === "ongelezen";
	const query = search.trim().toLowerCase();

	return messages.filter((message) => {
		const isSeen = (message.flags ?? []).includes("\\Seen");
		const matchesFilter = seenFilter ? isSeen : unseenFilter ? !isSeen : true;

		if (!matchesFilter) return false;
		if (!query) return true;

		const hay = [message.subject, message.preview, message.from?.name, message.from?.address].filter(Boolean).map((v: any) => String(v).toLowerCase());

		return hay.some((v) => v.includes(query));
	});
};

export const buildImapMessagesResponse = (allMessages: any[], options: ImapMessagesOptions) => {
	const filter = String(options.filter ?? "");
	const search = String(options.search ?? "");

	const messages = filterCachedMessages(allMessages, filter, search);
	const unseen = allMessages.filter((m: any) => !(m.flags ?? []).includes("\\Seen")).length;
	const totalMessages = messages.length;

	const { page, total } = makeImapPagination(totalMessages, options.page, options.limit);

	const pagination = {
		current_page: page,
		total_Pages: total,
	};

	if (totalMessages === 0) return { data: null, unseen, pagination: null, error: true as const };
	if (page > total || page < 1) return { data: null, unseen, pagination, error: true as const };

	const startIndex = (page - 1) * options.limit;
	const paginatedMessages = messages.slice(startIndex, startIndex + options.limit);

	return {
		data: { messages: paginatedMessages },
		unseen,
		pagination,
		error: false as const,
	};
};

const _fetchAllImapMessages = async (_key: string, client: ImapFlow, _revalidate = false) => {
	return await useFetchImapMessages(client, "1:*", IMAP_FULL_FETCH_CONFIG);
};

export const useFetchCachedImapMessages = defineCachedFunction(_fetchAllImapMessages, {
	maxAge: IMAP_CACHE_MAX_AGE,
	name: IMAP_CACHE_NAME,
	getKey: (key: string) => key,
	shouldInvalidateCache: (_key: string, _client: ImapFlow, revalidate = false) => revalidate,
});

export const refreshImapMessagesCache = async (client: ImapFlow, revalidate = true) => {
	return await useFetchCachedImapMessages(IMAP_CACHE_KEY, client, revalidate);
};

export const updateFlagsImapMessageCache = async (message: any) => {
	return await updateCachedImapMessages((messages) => {
		const nextFlags: string[] = message.flags || [];

		return messages.map((item: any) => {
			if (item?.uid !== Number(message?.uid)) return item;
			return { ...item, flags: nextFlags };
		});
	});
};

export const upsertImapMessageCache = async (message: any) => {
	return await updateCachedImapMessages((messages) => {
		const next = messages.filter((m: any) => m.uid !== message.uid && m.id !== message.id);
		next.unshift(message);
		return next;
	});
};

export const removeImapMessageFromCache = async (uid: string | number) => {
	return await updateCachedImapMessages((messages) => {
		return messages.filter((m: any) => String(m.uid) !== String(uid));
	});
};

export const clearImapMessagesCache = async () => {
	await useStorage().removeItem(IMAP_CACHE_STORAGE_KEY);
};

export const fetchImapMessagesFromStorageCache = async (options: ImapMessagesOptions) => {
	const cached = await readImapCacheEntry();
	if (!cached) return null;

	return buildImapMessagesResponse(cached.entry.value, options);
};
