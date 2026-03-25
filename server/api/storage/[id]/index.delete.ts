export default defineSupabaseEventHandler(async (event, { server }) => {
	const id = getRouterParams(event).id;
	if (!id) return useReturnResponse(event, badRequestError);

	const { data, error } = await server.from("attachments").select("*").eq("id", id).single();
	if (error || !data) return useReturnResponse(event, internalServerError);

	const { error: storageError } = await server.storage.from("stores").remove([data.name]);
	if (storageError) return useReturnResponse(event, internalServerError);

	await invalidateStorageFilesCache();

	return useReturnResponse(event, {
		status: {
			code: 200,
			message: "Bestand succesvol verwijderd",
			success: true,
		},
	});
});
