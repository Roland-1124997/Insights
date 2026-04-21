export default defineEventHandler(async (event) => {
	const client = await serverSupabaseClient(event);
	const currentSession = await useGetCookies(event);

	const { data, error: sessionError } = await useGetSession(event, client, currentSession);

	if (sessionError) {
		const canRefresh = Boolean(currentSession?.refresh_token) && [401, 403].includes(Number(sessionError.status));

		if (!canRefresh) return useReturnResponse(event, unauthorizedError);

		const { data: refreshedData, error: refreshError } = await useRefreshSession(client, currentSession);
		if (!refreshedData.session || refreshError) return useReturnResponse(event, unauthorizedError);

		useSetCookies(event, refreshedData.session);

		return useReturnResponse(event, {
			status: {
				success: true,
				message: "Ok",
				code: 200,
			},
			data: await useSetSessionData(event, refreshedData.user as SupaBaseUser),
		});
	}

	return useReturnResponse(event, {
		status: {
			success: true,
			message: "gebruiker gevonden",
			code: 200,
		},
		data: await useSetSessionData(event, data.user as SupaBaseUser),
	});
});
