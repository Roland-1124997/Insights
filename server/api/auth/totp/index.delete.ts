export default defineMultiFactorVerificationEventHandler(async (event, { user, client }) => {
	const { data: factors, error: factorError } = await client.auth.mfa.listFactors();
	if (factorError || !factors.all || !factors.all[0]) return useReturnResponse(event, internalServerError);

	const { error } = await client.auth.mfa.unenroll({
		factorId: factors!.all[0]!.id,
	});

	if (error) return useReturnResponse(event, internalServerError);
	await useDeleteCachedUser(user.current_session_id);

	return useReturnResponse(event, {
		status: {
			success: true,
			message: "success",
			code: 200,
		},
	});
});
