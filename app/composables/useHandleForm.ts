import type { FormActions } from "vee-validate";

const { addToast } = useToast();

export const useHandleForm = (request: requestOptions, callback?: Function) => {
	const loading = ref(false);

	const handleSubmit = async (values: Record<string, unknown>, actions: FormActions<any>) => {
		loading.value = true;

		const { data, error } = await useApiHandler<ApiResponse<unknown>>(request.url).Send({
			method: request.method,
			body: callback ? await callback(values) : values,
		});

		await new Promise((resolve) => setTimeout(resolve, 500));
		loading.value = false;

		if (error) errorHandler(error, request, actions).catch(() => {});
		if (data) successHandler(data, request).catch(() => {});
	};

	return { loading, handleSubmit };
};

const errorHandler = async (error: ErrorResponse, request: requestOptions, actions: FormActions<any>) => {
	if (request.onfailure) request.onfailure(error, actions);
	else {
		const details = error.details as Record<string, string>;
		actions.setErrors(details);
	}

	return;
};

const successHandler = async (data: ApiResponse<unknown>, request: requestOptions) => {
	const status = data.status;
	const redirect = status.redirect;

	if (status) {
		if (request.onsuccess) await request.onsuccess(data);

		if (request.successMessage)
			addToast({
				type: "success",
				message: request.successMessage,
				duration: 5000,
			});

		if (redirect) await navigateTo(redirect);
	}
};
