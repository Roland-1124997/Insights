export default defineMultiFactorVerificationEventHandler(async (event, { server, user }) => {
	const { id } = getRouterParams(event);
	if (!id) return useReturnResponse(event, badRequestError);

	const { data, error } = await server.from("access-tokens").select("*").eq("user_id", user.id).eq("id", id).single();

	if (error) return useReturnResponse(event, internalServerError);

	return useReturnResponse(event, {
		status: {
			code: 200,
			message: "Tokens retrieved successfully",
			success: true,
		},
		data: {
			id: data.id,
			label: data.name ? data.name.charAt(0).toUpperCase() + data.name.slice(1) : "",
			sleutel: data.token,
			vervaldatum: data.expires_at,
		},
	});
});
