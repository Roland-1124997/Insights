export const useAnalytics = defineStore("useAnalytics", () => {
	const { addToast } = useToast();
	const { set } = useHistory();

	const analytics = ref<Record<string, any> | null>(null);
	const statistics = computed(() => analytics.value?.statistics || null);
	const metrics = computed(() => analytics.value?.metrics || null);
	const error = ref<ErrorResponse | null>(null);
	const loading = ref<boolean>(true);

	const shared = ref<string[]>([]);

	const uri = "/api/umami/analytics";
	const Request = useApiHandler<ApiResponse<any>>(uri);

	const setShared = async (paths: string[]) => (shared.value = paths);

	const refresh = async (params?: { filter?: string; page?: number }) => {
		loading.value = true;
		await new Promise((resolve) => setTimeout(resolve, 300));

		const { data, error: Error } = await Request.Get({
			query: { filter: params?.filter || useRoute().query.filter || "vandaag" },
		});

		if (!Error && data) {
			loading.value = false;
			analytics.value = data.data;
		} else {
			loading.value = false;
			error.value = Error;

			addToast({
				message: "Er is een fout opgetreden bij het vernieuwen van de analytics gegevens.",
				type: "error",
			});
		}
	};

	const initialPayload = async () => {
		loading.value = true;

		const route = useRoute();
		const activePage = shared.value.includes(route.path);

		const params = {
			filter: activePage ? route.query.filter || "vandaag" : "vandaag",
		} as { filter: string };

		shared.value.forEach((path) => {
			set(path, [params]);
		});

		const { data, error: Error } = await useFetch<ApiResponse<any>>(uri, {
			query: { ...params },
		});

		if (!Error.value && data.value) {
			loading.value = false;
			analytics.value = data.value.data;
		} else {
			loading.value = false;
			error.value = Error.value as unknown as ErrorResponse;
			addToast({
				message: "Er is een fout opgetreden bij het ophalen van de analytics gegevens.",
				type: "error",
			});
		}
	};

	return {
		analytics,
		loading,
		statistics,
		metrics,
		error,
		initialPayload,
		setShared,
		refresh,
	};
});
