
import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, NetworkFirst, CacheFirst } from "workbox-strategies";

self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

let vapidKey
let headers
const url = "/api/integrations/subscription"
const channel = new BroadcastChannel('sw-messages');

const getSubscriptionStatus = async () => {

    await fetch("/api/user")

    return fetch(url)
        .then((res) => res.json())
        .then((json) => ({ data: json, error: null }))
        .catch((error) => ({ data: null, error }))
}

const subscribe = async () => {

    const { data } = await getSubscriptionStatus();
    if (!data.data.active) return

    self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: vapidKey }).then(async (subscription) => {

        const found = data.data.subscriptions.find((sub) => subscription.endpoint.startsWith(sub.url_provider)) || null

        await fetch("/api/security/csrf-token", {
            headers: headers
        })

        if (found) return await fetch(`${url}/${found.id}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subscription)
        })

        return await fetch(url, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subscription),
        }).then(() => postToClient("SUBSCRIPTION_UPDATED", { active: true }))
    })

}

const checkSubscription = async (reSubscribe) => {
    const registration = await self.registration;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) return await subscribe();
    else if (reSubscribe) subscription.unsubscribe().then(async () => await subscribe());
};

const postToClient = (type, payload) => channel.postMessage({ type, payload });

registerRoute(
    ({ url }) => url.pathname === "/ping.txt",
    new CacheFirst({
        cacheName: 'ping-cache',
        plugins: [
            {
                cacheableResponse: {
                    statuses: [200],
                }
            }
        ]
    })
)

registerRoute(
    ({ url }) => url.pathname.includes('/icons/'),
    new StaleWhileRevalidate({
        cacheName: 'image-cache',
        plugins: [
            {
                cacheableResponse: {
                    statuses: [200],
                }
            }
        ]
    })
);

registerRoute(
    ({ url }) => {
        const pathSegments = url.pathname.split('/');
        return pathSegments.length >= 3 && pathSegments[1] === 'api' && pathSegments[2] !== 'user';
    },
    new NetworkFirst({
        cacheName: 'api-cache',
        plugins: [
            {
                cacheableResponse: {
                    statuses: [200],
                }
            }
        ]
    })
);

registerRoute(
    ({ url }) => {
        const pathSegments = url.pathname.split('/');
        return pathSegments.length >= 3 && pathSegments[1] === 'api' && pathSegments[2] == 'user';
    },
    new NetworkFirst({
        cacheName: 'user-api-cache',
        plugins: [
            {
                cacheableResponse: {
                    statuses: [0, 200, 401, 403],
                }
            }
        ]
    })
);


self.addEventListener("message", async (event) => {
    const { type, payload } = event.data
    if (type == "SET_VAPID_KEY") vapidKey = payload.vapidKey
    if (type == "SET_TOKEN_HEADER") headers = payload.headers
    if (type == "CHECK_SUBSCRIPTION") await checkSubscription(false)

});

self.addEventListener("push", async (event) => {

    event.waitUntil((async () => {

        const { data, events } = await event.data.json()

        if (events.update || data.badgeCount) navigator.setAppBadge(data.badgeCount);
        if (events.incoming) await self.registration.showNotification(data.title, {
            body: data.message,
            icon: "/icons/icon_512.png",
            badge: "/icons/icon_512.png",
            data: { url: data.url },
            tag: data.id,
        });

    })());

});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    event.waitUntil(clients.matchAll({ type: "window" }).then(() => {
        return clients.openWindow(event.notification.data.url);
    }));
});

self.addEventListener("activate", (event) => {

    setInterval(async () => {
        await checkSubscription()
    }, 300000);

});

setInterval(function () {
    fetch('/ping.txt')
}, 20000)

