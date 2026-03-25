export const useArticles = defineStore("useArticles", () => {
	const { addToast } = useToast();
	const { create, close } = useModal();
	const { set } = useHistory();

	const storage = useStorage();

	const uri = "/api/articles";
	const Request = useApiHandler<ApiResponse<Article[] | Article>>(uri);

	const articles = ref<Article[] | Article | null>(null);
	const error = ref<ErrorResponse | null>(null);
	const loading = ref<boolean>(true);

	const storedPayload = useLocalStorage<string | null>("articles:payload", null);
	const savePayload = async (payload: any) => (storedPayload.value = JSON.stringify(payload));
	const clearSavedPayload = () => (storedPayload.value = null);

	const getSavedPayload = () => {
		if (storedPayload.value) return JSON.parse(storedPayload.value);
		return null;
	};

	const refresh = async (params?: { filter?: string; page?: number; search?: string }) => {
		loading.value = true;
		await new Promise((resolve) => setTimeout(resolve, 300));

		const { data, error: Error } = await Request.Get({
			query: {
				page: params?.page || useRoute().query.page || 1,
				filter: params?.filter || useRoute().query.filter || "all",
				search: params?.search !== undefined ? params.search : useRoute().query.search || "",
			},
		});

		if (!Error && data) {
			loading.value = false;
			articles.value = data.data as Article[] | Article;
		} else {
			loading.value = false;
			error.value = Error;
			addToast({
				message: "Er is een fout opgetreden bij het vernieuwen van de artikelen.",
				type: "error",
			});
		}
	};

	const initialPayload = async () => {
		loading.value = true;
		const route = useRoute();
		const activePage = route.path === "/artikelen";

		const params = {
			page: activePage ? route.query.page || 1 : 1,
			filter: activePage ? route.query.filter || "" : "",
			search: activePage ? route.query.search || "" : "",
		} as { filter: string; page: number; search: string };

		set("/artikelen", [params]);

		const { data, error: Error } = await useFetch<ApiResponse<any>>(uri, {
			query: { ...params },
		});

		if (!Error.value && data.value) {
			loading.value = false;
			articles.value = data.value.data;
		} else {
			loading.value = false;
			error.value = Error.value as unknown as ErrorResponse;
			addToast({
				message: "Er is een fout opgetreden bij het ophalen van artikelen.",
				type: "error",
			});
		}
	};

	const remove = (id: number) => {
		// @ts-ignore it is guaranteed that articles.value is an array when this function is called, because the delete button is only rendered when articles.value is an array and contains the article
		const content = articles.value.find((art: any) => art.id === id);

		const onComplete = async () => {
			close();
			await refresh();
			await storage.refresh();
		};

		const onCancel = () => close();

		create({
			name: `Verwijder artikel ${content.title}`,
			description: "Weet je zeker dat je dit artikel wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.",
			component: "Confirm",
			props: {
				onCancel,
				onComplete,
				request: {
					url: `/api/articles/${id}`,
					method: "DELETE",
					secure: false,
				},
				message: {
					success: `Artikel ${content.title} succesvol verwijderd.`,
					confirm: "Ja, verwijder het artikel",
					cancel: "Nee, behoud het artikel",
				},
			},
		});
	};

	const togglePublish = async (article: any) => {
		const id = article.id;
		const title = article.title;
		const publish = !article.published;

		const { data, error: Error } = await Request.Patch({
			extends: `/${id}`,
			query: { publish: publish },
		});

		if (!Error && data) {
			addToast({
				message: `Artikel ${title} succesvol ${publish ? "gepubliceerd" : "gedepubliceerd"}.`,
				type: "success",
			});
			await refresh();
			await storage.refresh();
		} else {
			addToast({
				message: `Er is een fout opgetreden bij het ${publish ? "publiceren" : "depubliceren"} van het artikel ${title}.`,
				type: "error",
			});
		}
	};

	return {
		articles,
		error,
		loading,
		initialPayload,
		remove,
		refresh,
		savePayload,
		getSavedPayload,
		clearSavedPayload,
		togglePublish,
	};
});
