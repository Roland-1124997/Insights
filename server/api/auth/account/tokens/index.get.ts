export default defineSupabaseEventHandler(async (event, { server, user }) => {
	const { data, error } = await server.from("access-tokens").select("*").eq("user_id", user.id).order("created_at", { ascending: false });

	if (error) return useReturnResponse(event, internalServerError);

	return useReturnResponse(event, {
		status: {
			code: 200,
			message: "Tokens retrieved successfully",
			success: true,
		},
		data: {
			categories: [
				{
					label: "naam",
					value: "naam",
				},
				{
					label: "sleutel",
					value: "sleutel",
				},
				{
					label: "vervaldatum",
					value: "vervaldatum",
				},
				{
					label: "acties",
					value: "acties",
				},
			],
			values:
				data?.map((token) => ({
					id: token.id,
					label: token.name ? token.name.charAt(0).toUpperCase() + token.name.slice(1) : "",
					sleutel: "************",
					vervaldatum: token.expires_at,
				})) || [],
		},
	});
});
