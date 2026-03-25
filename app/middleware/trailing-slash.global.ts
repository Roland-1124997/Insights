export default defineNuxtRouteMiddleware((to) => {
	if (to.path !== "/" && to.path.endsWith("/"))
		return navigateTo(
			{
				path: to.path.slice(0, -1),
				query: to.query,
				hash: to.hash,
			},
			{ replace: true },
		);
});
