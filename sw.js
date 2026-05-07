const CACHE_NAME = 'music-player-v19-icon-help';
const APP_SHELL = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json',
    './icon.svg',
    './icons/icon-180.png',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './vendor/jsmediatags.min.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

self.addEventListener('fetch', (event) => {
    const request = event.request;

    if (request.method !== 'GET') return;

    const requestUrl = new URL(request.url);
    const sameOrigin = requestUrl.origin === self.location.origin;

    if (request.mode === 'navigate') {
        event.respondWith(networkFirstNavigation(request));
        return;
    }

    if (!sameOrigin) {
        event.respondWith(fetch(request));
        return;
    }

    event.respondWith(cacheFirstAsset(request));
});

async function networkFirstNavigation(request) {
    const cache = await caches.open(CACHE_NAME);

    try {
        const response = await fetch(request);
        if (response && response.ok) {
            cache.put('./index.html', response.clone());
        }
        return response;
    } catch (error) {
        return caches.match(request) ||
            caches.match('./index.html') ||
            caches.match('./');
    }
}

async function cacheFirstAsset(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (!response || !response.ok) return response;

    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
}
