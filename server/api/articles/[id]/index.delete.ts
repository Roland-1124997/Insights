import { invalidateStorageFilesCache } from "../../../utils/storage/functions";

export default defineSupabaseEventHandler(async (event, { server }) => {
	const id = getRouterParam(event, "id");
	if (!id) return useReturnResponse(event, badRequestError);

	const { data: attachments, error: fetchError } = await server.from("attachments").select("name").eq("article_id", id);
	const { error } = await server.from("artikelen").delete().eq("id", id);

	if (error || fetchError) return useReturnResponse(event, internalServerError);

	if (attachments.length > 0) {
		const paths = attachments?.map((item) => `/${item.name}`);
		await server.storage.from("stores").remove(paths);

		const { error } = await server.from("attachments").delete().eq("article_id", id);
		if (!error) await invalidateStorageFilesCache();
	}

	await invalidateStorageFilesCache();

	return useReturnResponse(event, {
		status: {
			code: 200,
			message: "Artikel succesvol verwijderd.",
			success: true,
		},
	});
});
