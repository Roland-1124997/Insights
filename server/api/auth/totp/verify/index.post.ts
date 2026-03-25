export default defineAuthEventHandler(async (event, { user, client }) => {
	if (!user) return useReturnResponse(event, unauthorizedError);

	await new Promise((resolve) => setTimeout(resolve, 1000));

	const currentSession = await useGetCookies(event);
	const { error: userError } = await useGetSession(event, client, currentSession);

	if (userError) return useReturnResponse(event, unauthorizedError);

	const request = await readBody(event);
	const { error: zodError } = await schema.totp.backend.safeParseAsync(request);

	if (zodError)
		return useReturnResponse(event, {
			...badRequestError,
			error: {
				type: "fields",
				details: zodError.issues,
			},
		});

	const { data: factors, error: factorError } = await client.auth.mfa.listFactors();
	if (factorError || !factors.all || !factors.all[0]) return useReturnResponse(event, internalServerError);

	const { error } = await client.auth.mfa.challengeAndVerify({
		factorId: factors.all[0].id,
		code: request.code,
	});

	if (error)
		return useReturnResponse(event, {
			...unauthorizedError,
			error: {
				type: "fields",
				details: {
					code: "De opgegeven code is ongeldig.",
				},
			},
		});

	await useDeleteCachedUser(user.current_session_id);
	const isSetup = getQuery(event).context === "setup";

	return useReturnResponse(event, {
		status: {
			success: true,
			redirect: isSetup ? "/account" : "/",
			message: "Ok",
			code: 200,
		},
	});
});
