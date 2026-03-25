export default defineSupabaseEventHandler(async (event, { user, server }) => {
	const { data, error } = await server.from("subscriptions").select("*").eq("user_id", user.id);

	if (error) return useReturnResponse(event, internalServerError);

	return useReturnResponse(event, {
		status: {
			success: true,
			code: 200,
			message: "OK",
		},
		data: {
			active: data.length > 0,
			subscriptions: data.map((sub) => ({
				id: sub.id,
				url_provider: sub.url_provider,
			})),
		},
	});
});
