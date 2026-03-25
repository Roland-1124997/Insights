export default defineSupabaseEventHandler(async (event, { user, server }) => {
	const request = await readBody(event);
	const { error: zodError } = await schema.subscription.backend.safeParseAsync(request);

	if (zodError)
		return useReturnResponse(event, {
			...badRequestError,
			error: {
				type: "fields",
				details: zodError.issues,
			},
		});

	const { error } = await server.from("subscriptions").insert({
		user_id: user.id,
		endpoint: useEncryptValue(request.endpoint),
		keys: useEncryptValue(request.keys, true),
		url_provider: useGetSubscriptionProviderUrl(request.endpoint),
	});

	if (error) return useReturnResponse(event, internalServerError);

	await subscriptions(server, user.id, true);

	return useReturnResponse(event, {
		status: {
			success: true,
			code: 200,
			message: "OK",
		},
	});
});
