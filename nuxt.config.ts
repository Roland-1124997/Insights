// https://nuxt.com/docs/api/configuration/nuxt-config

import { loopThroughChunks } from "./server/utils/chunks/functions";
import { headConfiguration } from "./server/utils/head/functions";

export default defineNuxtConfig({
	compatibilityDate: "2026-03-31",
	devtools: {
		enabled: true,

		timeline: {
			enabled: true,
		},
	},
	modules: ["@nuxt/icon", "@nuxtjs/tailwindcss", "@vueuse/nuxt", "@nuxt/image", "@nuxtjs/supabase", "@pinia/nuxt", "@vite-pwa/nuxt", "nuxt-charts", "@vee-validate/nuxt", "@nuxt/a11y", "@nuxt/fonts"],
	nitro: {
		scheduledTasks: {
			"*/10 * * * *": ["analytics", "endpoints"],
			"0 1 1 */1 *": ["revalidate-imap-cache"],
			"0 12 */5 * *": ["supabase"],
			"0 3 * * 1": ["notifications"],
		},
		experimental: {
			tasks: true,
		},
	},

	vite: {
		build: {
			// Verhoog de waarschuwing limiet voor chunk grootte, aangezien sommige libraries (zoals elk.js, vue.pdf) een grote footprint hebben
			chunkSizeWarningLimit: 3000,
			rollupOptions: {
				output: {
					manualChunks(id) {
						return loopThroughChunks(id);
					},
				},
			},
		},
	},

	a11y: {
		enabled: false, //disable for mobile testing
		defaultHighlight: false,
		logIssues: true,
	},

	veeValidate: {
		autoImports: true,
	},

	supabase: {
		redirect: false,
		cookiePrefix: "access-token",
		cookieOptions: {
			maxAge: 60 * 60 * 8,
			sameSite: process.env.NODE_ENV === "development" ? "strict" : "lax",
			domain: process.env.NODE_ENV === "development" ? undefined : ".roland-meijer.nl",
			httpOnly: true,
			secure: process.env.NODE_ENV === "development" ? false : true,
			path: "/",
		},
		types: "~~/server/utils/supabase/types/database.types.ts",
	},

	runtimeConfig: {
		security: {
			key: process.env.SECURITY_KEY,
			header: process.env.SECURITY_HEADER,
			encryptSecret: process.env.SECURITY_ENCRYPT_SECRET,
			encryptAlgorithm: process.env.SECURITY_ENCRYPT_ALGORITHM,
		},

		SaltToken: process.env.SaltToken,
		appId: process.env.GitAppId,
		privateKey: process.env.GitPrivateKey,
		clientId: process.env.GitClientID,
		clientSecret: process.env.GitClientSecret,

		heartbeats: {
			analytics: process.env.BETTERSTACK_HEARTBEAT_ID_ANALYTICS,
			endpoints: process.env.BETTERSTACK_HEARTBEAT_ID_ENDPOINTS,
			imapCache: process.env.BETTERSTACK_HEARTBEAT_ID_IMAP_CACHE,
			notifications: process.env.BETTERSTACK_HEARTBEAT_ID_NOTIFICATIONS,
		},

		email: {
			key: process.env.RESEND_API_KEY,
			sender: process.env.EMAIL_FROM_ADDRESS,
		},

		UMAMI_API_KEY: process.env.UMAMI_API_KEY,
		UMAMI_HOST: process.env.UMAMI_HOST,
		UMAMI_ID: process.env.UMAMI_ID,

		IMAP_HOST: process.env.IMAP_HOST,
		IMAP_PORT: process.env.IMAP_PORT,
		IMAP_SECURE: process.env.IMAP_SECURE,
		IMAP_USER: process.env.IMAP_USER,
		IMAP_PASS: process.env.IMAP_PASS,

		supabaseUrl: process.env.SUPABASE_URL,
		supabaseKey: process.env.SUPABASE_KEY,
		supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,

		whitelistedDomains: process.env.WHITELISTED_DOMAINS,
		production: process.env.NODE_ENV === "development" ? false : true,

		betterstackSourceToken: process.env.BETTERSTACK_SOURCE_TOKEN,

		vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
		vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
		public: {
			vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
			securityKey: process.env.SECURITY_KEY,
		},
	},

	routeRules: {
		"/statistieken/": { redirect: "/" },
		"/auth/": { redirect: "/auth/login" },
		"/auth/**": { appLayout: "auth" },
	},

	app: {
		pageTransition: { name: "page", mode: "out-in" },
		...headConfiguration,
	},

	icon: {
		clientBundle: {
			scan: true,
		},
	},

	pwa: {
		strategies: "injectManifest",
		registerType: "autoUpdate",
		manifest: {
			name: "Insights",
			short_name: "Insights",
			description: "Personal dashboard application",
			orientation: "portrait",
			background_color: "#FFFFFF",
			start_url: "/",
			scope: "/",
			lang: "nl-NL",
			theme_color: "#FFFFFF",
			display: "standalone",
			display_override: ["window-controls-overlay", "standalone", "minimal-ui", "fullscreen", "browser"],
			screenshots: [
				{
					src: "screenshots/desktop.png",
					sizes: "2557x1414",
					type: "image/png",
					form_factor: "wide",
					label: "Desktop screen showing main dashboard with various widgets and charts",
				},
				{
					src: "screenshots/mobile.png",
					sizes: "708x1439",
					type: "image/png",
					platform: "ios",
					label: "Mobile screen showing main navigation and featured content",
				},
			],
			icons: [
				{
					src: "icons/icon_120-blue.png",
					sizes: "120x120",
					type: "image/png",
				},
				{
					src: "icons/icon_144-blue.png",
					sizes: "144x144",
					type: "image/png",
				},
				{
					src: "icons/icon_152-blue.png",
					sizes: "152x152",
					type: "image/png",
				},
				{
					src: "icons/icon_192-blue.png",
					sizes: "192x192",
					type: "image/svg",
				},
				{
					src: "icons/icon_512-blue.png",
					sizes: "512x512",
					type: "image/png",
				},
			],
			launch_handler: {
				client_mode: ["navigate-existing", "auto"],
			},
		},
		injectManifest: {
			globPatterns: ["**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}"],
			globIgnores: ["icons/**", "screenshots/**", "splash_screens/**", "apple-touch-icon*"],
			maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
		},
		devOptions: {
			enabled: true,
			type: "module",
			suppressWarnings: true,
		},
		client: {
			installPrompt: true,
			periodicSyncForUpdates: 60 * 60, // check for updates every hour
		},
	},
});
