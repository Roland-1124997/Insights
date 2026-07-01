export const useProfile = defineStore("useProfile", () => {
	const uri: FetchUrl = "/api/profile";
	const request = useApiHandler<ApiResponse<any>>(uri);

	const profile = ref<any>(null);
	const error = ref<ErrorResponse | null>(null);
	const loading = ref<boolean>(true);

	const { addToast } = useToast();

	const refresh = async () => {
		loading.value = true;

		const { data, error: Error } = await request.Get();

		if (!Error && data?.data) {
			loading.value = false;
			profile.value = data.data;
		} else {
			loading.value = false;
			error.value = Error;

			addToast({
				message: "Er is een fout opgetreden bij het vernieuwen van de account sessies.",
				type: "error",
			});
		}
	};

	const initialPayload = async () => {
		loading.value = true;

		const { data, error: Error } = await useFetch<ApiResponse<UserSession[]>>(uri);

		if (!Error.value && data.value?.data) {
			loading.value = false;
			profile.value = data.value.data;
		} else {
			loading.value = false;
			error.value = Error.value as unknown as ErrorResponse;

			addToast({
				message: "Er is een fout opgetreden bij het laden van de account sessies.",
				type: "error",
			});
		}
	};

	return {
		error,
		loading,
		profile,
		refresh,
		initialPayload,
	};
});
