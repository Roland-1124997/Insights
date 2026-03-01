
import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, NetworkFirst } from "workbox-strategies";

self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

let vapidKey
const url = "/api/integrations/subscription"

const getSubscriptionStatus = async () => {

    return fetch(url)
        .then((res) => res.json())
        .then((json) => ({ data: json, error: null }))
        .catch((error) => ({ data: null, error }))
}

const subscribe = async (subscription) => {

    await fetch("/api/security/csrf-token")

    return await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscription: subscription }),
    })

}

const getProviderName = (subscription) => {

    if (!subscription) return null

    const endpoint = subscription.endpoint

    if (endpoint.includes("google")) return "google"
    if (endpoint.includes("apple")) return "apple"
    if (endpoint.includes("mozilla")) return "mozilla"

    return "unknown"
}

const checkSubscription = async () => {
    const registration = await self.registration;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
        const { data } = await getSubscriptionStatus();
        const active = data.data.subscription;
        const provider = data.data.provider;

        if (active) {
            const newSubscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidKey
            });

            if (provider == getProviderName(newSubscription)) await subscribe(newSubscription);
        }
    }
};

const scheduleNextCheck = () => {
    const now = new Date();
    const nextRun = new Date(now);
    nextRun.setMinutes(Math.ceil(now.getMinutes() / 2) * 2, 0, 0);

    const delay = nextRun.getTime() - now.getTime();
    setTimeout(() => {
        checkSubscription();
        setInterval(checkSubscription, 2 * 60 * 1000);
    }, delay);
};


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

self.addEventListener("message", (event) => {
    const { type, payload } = event.data
    if (type == "SET_VAPID_KEY") vapidKey = payload.vapidKey
});

scheduleNextCheck();

self.addEventListener("push", async (event) => {

    const { data, events } = await event.data.json()

    if (events.update || data.badgeCount) navigator.setAppBadge(data.badgeCount);

    if (events.incoming) await self.registration.showNotification(data.title, {
        body: data.message,
        icon: "/icons/icon_512.png",
        badge: "/icons/icon_512.png",
        data: { url: data.url },
        lang: "nl",
        tag: data.id,
        renotify: true,
    });

});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    event.waitUntil(clients.matchAll({ type: "window" }).then(() => {
        return clients.openWindow(event.notification.data.url);
    }));
});

