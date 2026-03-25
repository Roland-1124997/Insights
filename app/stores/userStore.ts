let closeSession: Function | null = null;

export const useSessions = defineStore("useSessions", () => {
	const request = useApiHandler<ApiResponse<null>>("/api/auth/logout");
	const requestSession = useApiHandler<ApiResponse<UserDisplay>>("/api/user");

	const { addToast } = useToast();

	const session: any = ref({
		data: null,
		error: true,
	});

	const user = computed<UserDisplay>(() => session.value.data?.data || null);

	const setCloseFunction = (callback: Function) => {
		closeSession = callback;
	};

	const refreshSession = async () => {
		const { data, error } = await requestSession.Get();
		session.value = { data, error };
	};

	const setSession = (data: any, error: any) => (session.value = { data, error });
	const clearSession = () => (session.value = { data: null, error: null });
	const getSession = async () => session.value;

	const logout = async () => {
		const { data, error } = await request.Post();

		if (error || !data)
			return addToast({
				message: "Er is een fout opgetreden bij het uitloggen",
				type: "error",
			});

		const redirect = data.status.redirect;

		if (closeSession) closeSession();
		clearSession();

		addToast({
			message: "Je bent succesvol uitgelogd",
			type: "success",
		});

		return navigateTo(redirect);
	};

	const isCurrentSession = (sessionId: string) => sessionId === user.value.session;

	return {
		user,
		setCloseFunction,
		setSession,
		getSession,
		clearSession,
		logout,
		refreshSession,
		isCurrentSession,
	};
});
