export default defineSupabaseEventHandler(async (event, { user, client }) => {
	const { data: factors, error } = await client.auth.mfa.enroll({
		factorType: "totp",
		friendlyName: "one_time_code",
	});

	if (error) return useReturnResponse(event, internalServerError);
	await useDeleteCachedUser(user.current_session_id);

	return {
		status: {
			success: true,
			message: "TOTP factor enrollment initiated",
			code: 200,
		},
		data: factors,
	};
});
