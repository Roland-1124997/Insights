const catcher = async <T>(promise: Promise<T>) => {
	try {
		const data = await promise;
		return { data, error: null };
	} catch (error: any) {
		return {
			data: null,
			error: (error.data.error || error.data || error) as ErrorResponse,
		};
	}
};

export const useCsrfToken = async () => {
	const fetch = $fetch("/api/security/csrf-token", {
		headers: useControlToken(),
	});

	await catcher(fetch);
};

export const useApiHandler = <G>(url: FetchUrl) => {
	const Send = async <T = G>(options?: SendOptions): Promise<{ data: T | null; error: ErrorResponse | null }> => {
		if (options?.method != "GET") await useCsrfToken();

		const extendedUrl = options?.extends ? `${url as string}${options.extends as string}` : url;

		const fetch = $fetch(extendedUrl, {
			...options,
		}) as Promise<T>;

		return catcher<T>(fetch);
	};

	const Get = <T = G>(options?: MethodOptions) =>
		Send<T>({
			...options,
			method: "GET",
		});

	const Post = async <T = G>(options?: MethodOptions) =>
		Send<T>({
			...options,
			method: "POST",
		});

	const Delete = async <T = G>(options?: MethodOptions) =>
		Send<T>({
			...options,
			method: "DELETE",
		});

	const Patch = async <T = G>(options?: MethodOptions) =>
		Send<T>({
			...options,
			method: "PATCH",
		});

	return {
		Send,
		Get,
		Post,
		Delete,
		Patch,
	};
};
