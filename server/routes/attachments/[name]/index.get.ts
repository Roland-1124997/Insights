export default defineSupabaseFileHandler(async (event, { user, server }) => {
	const { name } = getRouterParams(event);
	if (!name) return useReturnResponse(event, badRequestError);

	const { data: attachment, error: attachmentError } = await server.from("attachments").select("*").eq("name", name).single();
	if (attachmentError || !attachment) return useReturnResponse(event, notFoundError);

	if (!attachment.published && !user) return useReturnResponse(event, forbiddenError);

	const { data, error } = await server.storage.from("stores").download(name);
	if (error || !data) return useReturnResponse(event, internalServerError);

	setHeaders(event, {
		"Content-Disposition": `inline; filename="${name}"`,
		"Content-Type": data.type || "application/octet-stream",
		"Cache-Control": "public, max-age=14400",
	});

	return data;
});
