export default defineMultiFactorVerificationEventHandler(async (event, { server, user }) => {
	const { id } = getRouterParams(event);
	if (!id) return useReturnResponse(event, badRequestError);

	const { error } = await server.from("access-tokens").delete().eq("id", id).eq("user_id", user.id);

	if (error) return useReturnResponse(event, internalServerError);

	return useReturnResponse(event, {
		status: {
			code: 200,
			message: "Tokens deleted successfully",
			success: true,
		},
	});
});
