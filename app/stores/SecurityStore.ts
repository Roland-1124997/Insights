export const useSecurity = defineStore("useSecurity", () => {
	const { addToast } = useToast();
	const { create, close } = useModal();

	const uri: FetchUrl = "/api/auth/account/tokens";
	const request = useApiHandler<ApiResponse<{ values: TableRowKeys[]; categories: { label: string; value: string }[] }>>(uri);

	const tokens = ref<{ values: TableRowKeys[]; categories: { label: string; value: string }[] } | null>(null);
	const error = ref<ErrorResponse | null>(null);
	const loading = ref<boolean>(true);

	const refresh = async () => {
		loading.value = true;

		const { data, error: Error } = await request.Get();

		if (!Error && data?.data) {
			loading.value = false;
			tokens.value = data.data;
		} else {
			loading.value = false;
			error.value = Error;

			addToast({
				message: "Er is een fout opgetreden bij het vernieuwen van de account sleutels.",
				type: "error",
			});
		}
	};

	const initialPayload = async () => {
		loading.value = true;

		const { data, error: Error } = await useFetch<ApiResponse<{ values: TableRowKeys[]; categories: { label: string; value: string }[] }>>(uri);

		if (!Error.value && data.value?.data) {
			loading.value = false;
			tokens.value = data.value.data;
		} else {
			loading.value = false;
			error.value = Error.value as unknown as ErrorResponse;

			addToast({
				message: "Er is een fout opgetreden bij het laden van de account sleutels.",
				type: "error",
			});
		}
	};

	const show = async (token: TableRowKeys) => {
		const onComplete = async (data: ApiResponse<TableRowKeys>) => {
			close();

			void new Promise((resolve) => setTimeout(resolve, 400)).then(() => {
				create({
					name: token.label,
					description: "Hieronder staat de toegangssleutel die je kunt gebruiken om in te loggen op je account via de API. ",
					component: "showToken",
					props: {
						content: {
							label: token.label,
							sleutel: data?.data?.sleutel,
							vervaldatum: token.vervaldatum,
						},
					},
				});
			});
		};

		const onCancel = () => close();

		create({
			name: token.label,
			description: "Weet je zeker dat je deze sleutel wilt bekijken? Hierdoor wordt de sleutel tijdelijk zichtbaar.",
			component: "Confirm",
			props: {
				onCancel,
				onComplete,
				request: {
					url: `/api/auth/account/tokens/${token.id}`,
					method: "POST",
					destructive: false,
					secure: true,
				},
				message: {
					success: "toegangssleutel opgehaald",
					confirm: "Ja, bekijk sleutel",
					cancel: "Nee, sluit venster",
				},
			},
		});
	};

	const Create = () => {
		create({
			name: "Sleutel aanmaken",
			description: "Maak een nieuwe sleutel aan voor je account. Deze sleutel kan gebruikt worden om in te loggen op je account via de API.",
			component: "CreateTokenForm",
			props: {},
		});
	};

	const Delete = async (token: TableRowKeys) => {
		const onComplete = async () => {
			close();
			await refresh();
		};

		const onCancel = () => close();

		create({
			name: token.label,
			description: "Weet je zeker dat je deze sleutel wilt verwijderen? Hierdoor wordt de sleutel onmiddellijk ongeldig.",
			component: "Confirm",
			props: {
				onCancel,
				onComplete,
				request: {
					url: `/api/auth/account/tokens/${token.id}`,
					method: "DELETE",
					secure: true,
				},
				message: {
					success: "sleutel verwijderd",
					confirm: "Ja, verwijder sleutel",
					cancel: "Nee, behoud sleutel",
				},
			},
		});
	};

	return {
		error,
		loading,
		tokens,
		initialPayload,
		Create,
		show,
		refresh,
		Delete,
	};
});
