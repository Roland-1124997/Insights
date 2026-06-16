export default defineBaseEventHandler(async (event, { server, user }) => {
	const search = String((getQuery(event).search as string) ?? "").toLowerCase();
	let query;

	if (!user) query = server.from("artikelen").select("*").eq("published", true).order("updated_at", { ascending: false });

	if (search) query = server.rpc("search_artikelen", { search: search }).order("updated_at", { ascending: false });
	else query = server.from("artikelen").select("*").order("updated_at", { ascending: false });

	const { data: articles, error } = await query;

	if (error) return useReturnResponse(event, internalServerError);

	articles?.forEach((article: (typeof articles)[0] & { thumbnail_url?: string; content: any }) => {
		const content = article.content.content;
		const { filtered } = useFilterParagraphs(content, "image");
		article.thumbnail_url = filtered.value[0]?.attrs?.src || null;
	});

	return useReturnResponse(event, {
		status: {
			code: 200,
			success: true,
			message: "Artikelen succesvol opgehaald",
		},
		data: articles,
	});
});
