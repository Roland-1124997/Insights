import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, NetworkFirst } from "workbox-strategies";

self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

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

self.addEventListener("push", async (event) => {
    const { title, message, url, unseen } = await event.data.json();

    navigator.setAppBadge(unseen);

    await self.registration.showNotification(title, {
        body: message,
        icon: "/icons/icon_512.png",
        data: { url },
    });
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    event.waitUntil(clients.matchAll({ type: "window" }).then(() => {
        return clients.openWindow(event.notification.data.url);
    }));
});
