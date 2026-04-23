import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, NetworkFirst, CacheFirst } from "workbox-strategies";

self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

let vapidKey;
let headers;
const url = "/api/integrations/subscription";
const channel = new BroadcastChannel("sw-messages");

const PAGE_CACHE_NAME = "workbox-page-cache";
const API_CACHE_NAME = "workbox-api-cache";
const IMAGE_CACHE_NAME = "workbox-image-cache";
const PING_CACHE_NAME = "workbox-ping-cache";
const USER_CACHE_NAME = "workbox-user-cache";

const pages = [
	"/",
	"/monitors",
	"/berichten",
	"/artikelen",
	"/artikelen/opstellen",
	"/mediabank",
	"/account",
	"/portfolio",
	"/statistieken/pagina's",
	"/statistieken/landen",
	"/statistieken/apparaten",
	"/auth/login",
	"/auth/verify",
];

const routes = ["/api/umami/analytics", "/api/auth/account/sessions", "/api/articles", "/api/integrations/monitors/resources", "/api/notifications", "/api/storage"];

const images = ["/github.jpg"];

const isExactPageRoute = (pathname) => pages.some((page) => page === pathname);

const getSubscriptionStatus = async () => {
	await fetch("/api/user");

	return fetch(url)
		.then((res) => res.json())
		.then((json) => ({ data: json, error: null }))
		.catch((error) => ({ data: null, error }));
};

const subscribe = async () => {
	const { data } = await getSubscriptionStatus();
	if (!data.data.active) return;

	self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: vapidKey }).then(async (subscription) => {
		const found = data.data.subscriptions.find((sub) => subscription.endpoint.startsWith(sub.url_provider)) || null;

		await fetch("/api/security/csrf-token", {
			headers: headers,
		});

		if (found)
			return await fetch(`${url}/${found.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(subscription),
			});

		return await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(subscription),
		}).then(() => postToClient("SUBSCRIPTION_UPDATED", { active: true }));
	});
};

const checkSubscription = async (reSubscribe) => {
	const registration = await self.registration;
	const subscription = await registration.pushManager.getSubscription();

	if (!subscription) return await subscribe();
	else if (reSubscribe) subscription.unsubscribe().then(async () => await subscribe());
};

const postToClient = (type, payload) => channel.postMessage({ type, payload });

registerRoute(
	({ request, url }) => request.method === "GET" && isExactPageRoute(url.pathname),
	new NetworkFirst({
		cacheName: PAGE_CACHE_NAME,
		plugins: [
			{
				cacheableResponse: {
					statuses: [200],
				},
			},
		],
	}),
);

registerRoute(
	({ url }) => url.pathname === "/ping.txt",
	new CacheFirst({
		cacheName: PING_CACHE_NAME,
		plugins: [
			{
				cacheableResponse: {
					statuses: [200],
				},
			},
		],
	}),
);

registerRoute(
	({ url }) => url.pathname.includes(images),
	new StaleWhileRevalidate({
		cacheName: IMAGE_CACHE_NAME,
		plugins: [
			{
				cacheableResponse: {
					statuses: [200],
				},
			},
		],
	}),
);

registerRoute(
	({ url }) => {
		const pathSegments = url.pathname.split("/");
		return pathSegments.length >= 3 && pathSegments[1] === "api" && pathSegments[2] !== "user";
	},
	new NetworkFirst({
		cacheName: API_CACHE_NAME,
		plugins: [
			{
				cacheableResponse: {
					statuses: [200],
				},
			},
		],
	}),
);

registerRoute(
	({ url }) => {
		const pathSegments = url.pathname.split("/");
		return pathSegments.length >= 3 && pathSegments[1] === "api" && pathSegments[2] == "user";
	},
	new NetworkFirst({
		cacheName: USER_CACHE_NAME,
		plugins: [
			{
				cacheableResponse: {
					statuses: [0, 200, 401, 403],
				},
			},
		],
	}),
);

self.addEventListener("install", async () => {
	const cache = await caches.open(PAGE_CACHE_NAME);
	const apiCache = await caches.open(API_CACHE_NAME);
	const imageCache = await caches.open(IMAGE_CACHE_NAME);

	for (const image of images) {
		fetch(image, { credentials: "same-origin" })
			.then(async (response) => {
				if (response.ok) await imageCache.put(image, response.clone());
			})
			.catch(() => {});
	}

	for (const page of pages) {
		fetch(page, { credentials: "same-origin" })
			.then(async (response) => {
				if (response.ok) await cache.put(page, response.clone());
			})
			.catch(() => {});
	}

	for (const route of routes) {
		fetch(route, { credentials: "same-origin" })
			.then(async (response) => {
				if (response.ok) await apiCache.put(route, response.clone());
			})
			.catch(() => {});
	}
});

self.addEventListener("activate", async () => {
	setInterval(async () => {
		await checkSubscription();
	}, 300000);
});

self.addEventListener("message", async (event) => {
	const { type, payload } = event.data;
	if (type == "SET_VAPID_KEY") vapidKey = payload.vapidKey;
	if (type == "SET_TOKEN_HEADER") headers = payload.headers;
	if (type == "CHECK_SUBSCRIPTION") await checkSubscription(true);
});

self.addEventListener("push", async (event) => {
	event.waitUntil(
		(async () => {
			const { data, events } = await event.data.json();

			if (events.update || data.badgeCount) navigator.setAppBadge(data.badgeCount).catch(() => {});
			if (events.incoming)
				await self.registration.showNotification(data.title, {
					body: data.message,
					icon: "/icons/icon_512-blue.png",
					badge: "/icons/icon_512-blue.png",
					data: { url: data.url },
					tag: data.id,
				});
		})(),
	);
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	event.waitUntil(
		clients.matchAll({ type: "window" }).then(() => {
			return clients.openWindow(event.notification.data.url);
		}),
	);
});

setInterval(function () {
	fetch("/ping.txt").catch(() => {});
}, 20000);
