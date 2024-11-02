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

// BGG API: StaleWhileRevalidate specifically for /thing and /collection endpoints
registerRoute(
    ({ url }) =>
        url.hostname.includes('bgg') && url.pathname.match(/\/(thing|collection)/),
    new StaleWhileRevalidate({
        cacheName: 'bgg-api-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 30,
                maxAgeSeconds: 24 * 60 * 60, // Cache BGG responses for 24 hours
            }),
        ],
    })
);

// Default: NetworkFirst for general API calls, including other BGG endpoints
registerRoute(
    ({ url }) =>
        url.pathname.match(/\/api/) || // General API calls
        (url.hostname.includes('boardgamegeek') && !url.pathname.match(/\/(thing|collection)/)), // All other BGG endpoints
    new NetworkFirst({
        cacheName: 'api-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // Cache general API calls for 5 minutes
            }),
        ],
    })
);


// StaleWhileRevalidate for CSS and JS assets
registerRoute(
    ({ request }) =>
        request.destination === 'style' || request.destination === 'script',
    new CacheFirst({
        cacheName: 'assets-cache',
    })
);
