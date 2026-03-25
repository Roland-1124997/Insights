export default defineAuthEventHandler(async (event, { user, server }) => {
	if (!user) return useReturnResponse(event, unauthorizedError);

	const { error } = await useDeleteSession(server, user);

	if (error) return useReturnResponse(event, internalServerError);

	await useDeleteCookies(event);
	return useReturnResponse(event, {
		status: {
			success: true,
			message: "je bent uitgelogd",
			redirect: "/auth/login",
			code: 200,
		},
	});
});
