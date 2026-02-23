import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, NetworkFirst } from "workbox-strategies";

self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();




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


