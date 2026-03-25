export default defineSupabaseEventHandler(async (event, { server }) => {
	const id = getRouterParam(event, "id");
	if (!id) return useReturnResponse(event, badRequestError);

	const { publish } = getQuery(event);

	if (publish != undefined) {
		const { error } = await server
			.from("artikelen")
			.update({
				published: publish === "true",
			})
			.eq("id", id);

		if (error) return useReturnResponse(event, internalServerError);

		const { error: Error } = await server
			.from("attachments")
			.update({
				published: publish === "true",
			})
			.eq("article_id", id);

		if (!Error) await invalidateStorageFilesCache();

		return useReturnResponse(event, {
			status: {
				code: 200,
				message: `Artikel succesvol ${publish === "true" ? "gepubliceerd" : "gedepubliceerd"}.`,
				success: true,
			},
		});
	}

	const request = await readBody(event);
	const { error: zodError } = await schema.article.backend.safeParseAsync(request);

	if (zodError)
		return useReturnResponse(event, {
			...badRequestError,
			error: {
				type: "fields",
				details: zodError.issues,
			},
		});

	const { error } = await server
		.from("artikelen")
		.update({
			title: request.title,
			content: request.content,
			description: request.description,
			anchors: request.anchors,
			words: request.words,
			topics: request.topics,
			read_time: `${Math.ceil(request.words / 200)}`,
			updated_at: new Date().toISOString(),
		})
		.eq("id", id);

	if (error) return useReturnResponse(event, internalServerError);

	return useReturnResponse(event, {
		status: {
			code: 200,
			message: "Artikel succesvol bijgewerkt.",
			success: true,
		},
		data: {
			id: id,
		},
	});
});
