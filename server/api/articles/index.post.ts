export default defineSupabaseEventHandler(async (event, { server }) => {
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

	const { data, error } = await server
		.from("artikelen")
		.insert({
			title: request.title.replaceAll(" ", "-").toLowerCase(),
			description: request.description,
			content: request.content,
			anchors: request.anchors,
			words: request.words,
			topics: request.topics,
			read_time: `${Math.ceil(request.words / 200)}`,
		})
		.select()
		.single();

	if (error) return useReturnResponse(event, internalServerError);

	return useReturnResponse(event, {
		status: {
			code: 200,
			message: "Artikel succesvol aangemaakt",
			success: true,
			redirect: `/artikelen`,
		},
		data: {
			id: data.id,
		},
	});
});
