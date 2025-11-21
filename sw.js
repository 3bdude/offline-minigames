const CACHE_NAME = 'touch-minigames-v1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './main.js',
    './manifest.json',
    './games/pong.js',
    './games/tap-race.js',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request).then((resp) => {
                // Optionally cache new GET requests
                if (request.method === 'GET' && resp.status === 200 && resp.type === 'basic') {
                    const respClone = resp.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, respClone));
                }
                return resp;
            }).catch(() => {
                // Fallback: serve index for navigation requests
                if (request.mode === 'navigate') return caches.match('./index.html');
            });
        })
    );
});
