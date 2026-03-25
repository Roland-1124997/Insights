import * as csrf from "uncsrf";

export default defineNitroPlugin(async (nitroApp) => {
	const config = useRuntimeConfig();
	const security = config.security as ModuleOptions;
	const secretKeyPromise = await useSecretKey(security);

	nitroApp.hooks.hook("render:html", async (html, { event }) => {
		let secret = getCookie(event, security.key);

		if (!secret) {
			secret = csrf.randomSecret();
			setCookie(event, security.key, secret, {
				httpOnly: true,
				secure: config.production ? true : false,
				sameSite: "strict",
			});
		}

		const token = await csrf.create(secret, secretKeyPromise, security.encryptAlgorithm);
		html.head.push(`<meta name="${security.key}" content="${token}">`);
	});
});
