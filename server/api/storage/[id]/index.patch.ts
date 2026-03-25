export default defineSupabaseEventHandler(async (event, { server }) => {
	const id = getRouterParams(event).id;
	if (!id) return useReturnResponse(event, badRequestError);

	const { data, error } = await server.from("attachments").select("*").eq("id", id).single();
	if (error || !data) return useReturnResponse(event, internalServerError);

	const { error: insertError } = await server
		.from("attachments")
		.update({
			published: !data.published,
		})
		.eq("name", data.name);

	if (insertError) return useReturnResponse(event, internalServerError);

	await invalidateStorageFilesCache();

	return useReturnResponse(event, {
		status: {
			code: 200,
			message: !data.published ? "Bestand succesvol zichtbaar gemaakt." : "Bestand succesvol verborgen.",
			success: true,
		},
	});
});
