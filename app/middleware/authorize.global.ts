export default defineNuxtRouteMiddleware(async (to, from) => {
	const store = useSessions();
	const identity = Math.random().toString(36).substring(2) + Date.now().toString(36);

	const { data, error } = await useFetch<ApiResponse<UserDisplay>>("/api/user", {
		key: `user-session-${identity}`,
	});

	store.setSession(data.value, error.value);
	const group = to.meta.groups;

	const isDashboard = group && group.includes("dashboard");
	const isAuth = group && group.includes("auth");
	const isVerify = isAuth && group.includes("verify");

	if (isDashboard) {
		if (!data.value) return navigateTo("/auth/login");
		if (data.value?.data?.mfa_needs_to_verified) return navigateTo("/auth/verify");
	}

	if (isAuth && !isVerify && !error.value) {
		if (to.path == from.path) return navigateTo("/");
		return navigateTo(from.path || "/");
	}

	if (isVerify && !data.value?.data?.mfa_needs_to_verified) return navigateTo("/");
});
