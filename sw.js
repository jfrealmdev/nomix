const CACHE_NAME = 'nomix-v7';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/tokens.css',
  './css/base.css',
  './css/components.css',
  './css/layout.css',
  './css/animations.css',
  './js/app.js',
  './js/router.js',
  './js/store.js',
  './js/i18n.js',
  './js/mock-data.js',
  './js/utils.js',
  './js/pwa.js',
  './js/views/dashboard.js',
  './js/views/transactions.js',
  './js/views/scan.js',
  './js/views/analytics.js',
  './js/views/settings.js',
  './components/nav.js',
  './components/card.js',
  './components/modal.js',
  './components/toast.js',
  './components/chart-widget.js',
  './components/currency-toggle.js',
  './js/exchange-rate.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Network-first for same-origin requests (ensures fresh content)
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline: fall back to cache
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            // Offline fallback for navigation
            if (request.destination === 'document') {
              return caches.match('./index.html');
            }
          });
        })
    );
    return;
  }

  // Cache-first for external resources (CDN libs, fonts)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
