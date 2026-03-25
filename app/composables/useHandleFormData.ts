const { addToast } = useToast();

export const useHandleFormData = (successMessage: string, failureMessage: string) => {
	let formData: FormData | undefined = undefined;
	const Request = useApiHandler<ApiResponse<FileData>>("/api/storage");

	const setFormData = (data: FormData | undefined = undefined) => (formData = data);

	const upload = async (articleId: number | undefined) => {
		if (formData && articleId) {
			const { error: storageError } = await Request.Post({
				body: formData,
				query: { published: false, articleId: articleId },
			});

			if (storageError)
				return addToast({
					message: failureMessage,
					type: "error",
				});
		}

		addToast({
			message: successMessage,
			type: "success",
		});
	};

	return { upload, setFormData };
};
