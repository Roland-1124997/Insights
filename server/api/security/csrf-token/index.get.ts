export default defineSecurityEventHandler(async (event) => {
	const { production } = useRuntimeConfig();

	const token = (crypto?.randomUUID?.() || `${Date.now().toString(36)}.${Math.random().toString(36).slice(2)}.${Math.random().toString(36).slice(2)}`).replace(/\./g, "-");

	await useStorage(`csrf-tokens`).setItem(token, true, { ttl: 60 });

	setCookie(event, "csrf-token", token, {
		path: "/",
		sameSite: "strict",
		secure: production,
		httpOnly: true,
		maxAge: 30,
	});
});
