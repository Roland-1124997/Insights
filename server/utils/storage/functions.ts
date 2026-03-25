const STORAGE_CACHE_NAME = "storage-files";
const STORAGE_CACHE_KEY = "all";
const STORAGE_CACHE_MAX_AGE = 60 * 60 * 24 * 365;
const STORAGE_CACHE_STORAGE_KEYS = [`/cache:nitro/functions:${STORAGE_CACHE_NAME}:${STORAGE_CACHE_KEY}.json`, `nitro:functions:${STORAGE_CACHE_NAME}:${STORAGE_CACHE_KEY}.json`];

const fetchAllStorageFiles = async (_key: string, server: SupabaseClient, _revalidate = false) => {
	const { data: attachments, error } = await server.from("attachments").select("id, name, published, label, article_id, updated_at").order("updated_at", { ascending: false });

	if (error || !attachments) return [];

	const { data: meta, error: metaError } = await server.storage.from("stores").list();
	if (metaError || !meta) return [];

	const articleIds = Array.from(new Set(attachments.map((item: any) => item.article_id).filter(Boolean)));

	let articleMap = new Map<string, string>();
	if (articleIds.length > 0) {
		const { data: articles } = await server
			.from("artikelen")
			.select("id, title")
			.in("id", articleIds as string[]);

		articleMap = new Map((articles || []).map((article: any) => [String(article.id), article.title]));
	}

	const metaMap = new Map((meta || []).map((item: any) => [item.name, item]));

	return attachments.reduce((result: any[], file: any) => {
		const fileMeta = metaMap.get(file.name);
		if (!fileMeta) return result;

		const extension = file.name.split(".").pop() || "";

		result.push({
			id: file.id,
			article_name: file.article_id ? articleMap.get(String(file.article_id)) || null : null,
			name: file.name,
			published: file.published,
			media: `/attachments/${file.name}`,
			metadata: {
				size: formatSize(fileMeta?.metadata?.size || 0),
				label: file.label,
				mimetype: fileMeta?.metadata?.mimetype,
				created_at: fileMeta.created_at,
				updated_at: fileMeta.updated_at,
				icon: {
					color: getIconColor(types, extension),
					background: getIconBackground(types, extension),
				},
			},
		});

		return result;
	}, []);
};

export const useFetchCachedStorageFiles = defineCachedFunction(fetchAllStorageFiles, {
	maxAge: STORAGE_CACHE_MAX_AGE,
	name: STORAGE_CACHE_NAME,
	getKey: (key: string) => key,
	shouldInvalidateCache: (_key: string, _server: SupabaseClient, revalidate = false) => revalidate,
});

const filterStorageFiles = (files: any[], search: string, filter: string) => {
	const query = search.trim().toLowerCase();

	return files.filter((file: any) => {
		const labelMatch =
			!filter || filter === "alles"
				? true
				: String(file.metadata?.label || "")
						.toLowerCase()
						.includes(filter.toLowerCase());

		if (!labelMatch) return false;
		if (!query) return true;

		const articleName = String(file.article_name || "").toLowerCase();
		const fileName = String(file.name || "").toLowerCase();

		return articleName.includes(query) || fileName.includes(query);
	});
};

export const fetchStorageFile = async (server: SupabaseClient, id: string) => {
	const files = await useFetchCachedStorageFiles(STORAGE_CACHE_KEY, server);
	return { data: files.find((file) => file.id === id) };
};

export const fetchStorageFiles = async (
	server: SupabaseClient,
	options: {
		limit: number;
		page: number;
		search?: string;
		filter?: string;
	},
) => {
	const search = String(options.search || "");
	const filter = String(options.filter || "");

	const allFiles = await useFetchCachedStorageFiles(STORAGE_CACHE_KEY, server);
	const filtered = filterStorageFiles(allFiles, search, filter);

	const page = options.page || 1;
	const limit = options.limit || 1;

	const { items, start, end } = useMakePagination(limit, page);

	const total = Math.max(Math.ceil(filtered.length / items), 1);
	const files = filtered.slice(start, end);

	return { files, total, page };
};

export const invalidateStorageFilesCache = async () => {
	const storage = useStorage();
	await Promise.all(STORAGE_CACHE_STORAGE_KEYS.map((cacheKey) => storage.removeItem(cacheKey)));
};
