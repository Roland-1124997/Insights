import type { LocationQueryValue } from "vue-router";

const search = ref<string | null>(null);
const { clear, get, LastEntry, set } = useHistory();

export const useSearch = (options?: { localSearch?: Ref<string | null>; callback?: (params: { filter: string; search: string; page: number }) => Promise<void> }) => {
	const router = useRouter();
	const route = useRoute();

	search.value = (route.query.search as string) || null;
	if (options?.localSearch) options.localSearch.value = search.value;

	const execute = async (value: string) => {
		if (options?.callback) {
			await new Promise((resolve) => setTimeout(resolve, 300));

			await options.callback({
				filter: (route.query.filter as string) || "alles",
				search: value,
				page: route.query.page ? parseInt(route.query.page as string) : 1,
			});
		}
	};

	const setSearch = async (value: string | LocationQueryValue[] | null) => {
		
		const query = { ...route.query } as { [key: string]: string | number | undefined };
		const lastEntry = LastEntry(route.path);
		delete query.page;

		set(route.path, [
			{
				search: (route.query.serch as string) || (value as string) || "",
				filter: (route.query.filter as string) || "",
				page: route.query.page ? parseInt(route.query.page as string) : 1,
			},
		]);

		const last = lastEntry?.search || null;
		const current = value || null;

		if (current === last) return;

		search.value = value as string;
		query.search = search.value;

		if(!current) delete query.search;

		await execute(value as string);

		router.replace({ query }).catch(() => {});
	};

	return {
		search,
		history: {
			LastEntry: (path: string) => LastEntry(path),
			clear: (path: string) => clear(path),
			get: (path: string) => get(path),
			set: (path: string, entries: any[]) => set(path, entries),
		},
		setSearch,
	};
};
