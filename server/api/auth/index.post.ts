export default defineAuthEventHandler(async (event, { client }) => {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	const request = await readBody(event);
	const { error: zodError } = await schema.login.backend.safeParseAsync(request);

	if (zodError)
		return useReturnResponse(event, {
			...badRequestError,
			error: {
				type: "fields",
				details: zodError.issues,
			},
		});

	const { data, error } = await client.auth.signInWithPassword({
		email: request.email,
		password: request.password,
	});

	if (error)
		return useReturnResponse(event, {
			...unauthorizedError,
			error: {
				type: "fields",
				details: {
					email: ["Onbekende combinatie"],
					password: ["Onbekende combinatie"],
				},
			},
		});

	useSetCookies(event, data.session);

	if (data.user.factors && data.user.factors[0] && data.user.factors[0].status === "verified") {
		return useReturnResponse(event, {
			status: {
				success: true,
				redirect: "/auth/verify",
				message: "Ok",
				code: 200,
			},
		});
	}

	return useReturnResponse(event, {
		status: {
			success: true,
			redirect: "/",
			message: "Ok",
			code: 200,
		},
	});
});
