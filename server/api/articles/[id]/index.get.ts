export default defineSupabaseFileHandler(async (event, { server }) => {
	const id = getRouterParam(event, "id");
	if (!id) return useReturnResponse(event, badRequestError);

	const { data: article, error } = await server.from("artikelen").select("*").eq("id", id).order("created_at", { ascending: false }).single();

	if (error) return useReturnResponse(event, internalServerError);

	return useReturnResponse(event, {
		status: {
			code: 200,
			success: true,
			message: "Artikel succesvol opgehaald",
		},
		data: article,
	});
});
