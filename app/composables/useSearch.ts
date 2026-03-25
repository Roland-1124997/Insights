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

	watch(
		() => route.path,
		async () => {
			const lastEntry = LastEntry(route.path);
			search.value = lastEntry?.search || null;
			if (options?.localSearch) options.localSearch.value = search.value;

			router
				.push({
					query: {
						...route.query,
						search: search.value || undefined,
					},
				})
				.catch(() => {});
		},
	);

	const setSearch = async (value: string | LocationQueryValue[] | null) => {
		const query = { ...route.query };
		const lastEntry = LastEntry(route.path);

		const last = lastEntry?.search || null;
		if (value === last) return;

		set(route.path, [
			{
				search: (route.query.serch as string) || (value as string) || "",
				filter: (route.query.filter as string) || "",
				page: route.query.page ? parseInt(route.query.page as string) : 1,
			},
		]);

		if (!value) {
			if (value === lastEntry?.search) return;
			await execute("");

			search.value = "";
			delete query.search;

			router.replace({ query }).catch(() => {});
		} else {
			if (value === lastEntry?.search) return;
			await execute(value as string);

			search.value = value as string;
			query.search = search.value;
			delete query.page;

			router.replace({ query }).catch(() => {});
		}
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
