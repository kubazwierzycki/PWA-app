import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Cache images with CacheFirst strategy
registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    })
);

// Use NetworkFirst for API calls
registerRoute(
    ({ url }) => url.pathname.startsWith('/api'),
    new NetworkFirst({
        cacheName: 'api-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 1 Day
            }),
        ],
    })
);

// StaleWhileRevalidate for CSS and JS assets
registerRoute(
    ({ request }) =>
        request.destination === 'style' || request.destination === 'script',
    new StaleWhileRevalidate({
        cacheName: 'assets-cache',
    })
);
