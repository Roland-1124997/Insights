type Monitor = {
	monitors: Record<string, unknown>[];
	count: number;
};

export const useMonitor = defineStore("useMonitor", () => {
	const { addToast } = useToast();
	const { set } = useHistory();

	const uri: FetchUrl = "/api/integrations/betterstack";
	const Request = useApiHandler<ApiResponse<Monitor>>(uri);

	const count = ref(0);
	const monitors: any = ref([]);
	const error = ref<ErrorResponse | null>(null);
	const loading = ref<boolean>(true);

	const refresh = async (params?: { filter?: string; page?: number; search?: string }) => {
		const route = useRoute();
		loading.value = true;

		await new Promise((resolve) => setTimeout(resolve, 300));

		const qeury = {
			page: params?.page || route.query.page || 1,
			filter: params?.filter || route.query.filter || "",
			search: params?.search !== undefined ? params.search : route.query.search || "",
		} as { filter: string; page: number; search: string };

		const { data, error: Error } = await Request.Get({
			query: { ...qeury },
		});

		if (!Error && data?.data) {
			loading.value = false;
			monitors.value = data.data.monitors || [];
			count.value = data.data.count || 0;
		} else {
			loading.value = false;
			error.value = Error;
			addToast({
				message: "Er is een fout opgetreden bij het verversen van de monitoren.",
				type: "error",
			});
		}
	};

	const initialPayload = async () => {
		loading.value = true;

		const route = useRoute();
		const activePage = route.path === "/monitors";

		const params = {
			page: activePage ? route.query.page || 1 : 1,
			filter: activePage ? route.query.filter || "" : "",
			search: activePage ? route.query.search || "" : "",
		} as { filter: string; page: number; search: string };

		set("/monitors", [params]);

		const { data, error: Error } = await useFetch<ApiResponse<Monitor>>(uri, {
			query: { ...params },
		});

		if (!Error.value && data.value) {
			loading.value = false;
			monitors.value = data.value?.data?.monitors || [];
			count.value = data.value?.data?.count || 0;
		} else {
			loading.value = false;
			error.value = Error.value as unknown as ErrorResponse;
			addToast({
				message: "Er is een fout opgetreden bij het ophalen van monitoren.",
				type: "error",
			});
		}
	};

	return {
		count,
		monitors,
		error,
		loading,
		initialPayload,
		refresh,
	};
});
