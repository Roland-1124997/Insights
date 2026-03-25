export default defineSupabaseEventHandler(async (event, { server }) => {
	const id = getRouterParams(event).id;
	if (!id) return useReturnResponse(event, badRequestError);

	const { data } = await fetchStorageFile(server, id);

	return useReturnResponse(event, {
		status: {
			code: 200,
			message: "bestand opgehaald",
			success: true,
		},
		data,
	});
});
