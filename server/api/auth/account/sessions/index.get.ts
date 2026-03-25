export default defineSupabaseEventHandler(async (event, { user, server }) => {
	const { data, error } = await server.rpc("get_sessions_by_user", {
		p_user_uuid: user?.id,
	});
	if (error) return useReturnResponse(event, internalServerError);

	const currentSessionId = user?.current_session_id;

	const sortedData = data.sort((a: any, b: any) => {
		if (a.id === currentSessionId) return -1;
		if (b.id === currentSessionId) return 1;
		return 0;
	});

	return useReturnResponse(event, {
		status: {
			code: 200,
			message: "Sessions retrieved successfully",
			success: true,
		},
		data: sortedData.map((session: any) => ({
			id: session.id,
			created_at: session.created_at,
			updated_at: session.updated_at,
			ip_address: session.navigator_ip,
			continent_code: session.continent_code,
			timezone: session.timezone,
			country_code: session.country_code,
			region_code: session.region_code,
			city: session.city,
			screen: session.screen,
		})),
	});
});
