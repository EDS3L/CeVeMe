const CACHE_NAME = 'gf-cache-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  const isGoogleFonts =
    (url.hostname === 'fonts.googleapis.com' &&
      url.pathname.startsWith('/css2')) ||
    (url.hostname === 'fonts.gstatic.com' &&
      url.pathname.match(/\.(woff2|woff)$/));

  if (!isGoogleFonts) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      const fetchPromise = fetch(request)
        .then((res) => {
          try {
            cache.put(request, res.clone());
          } catch {}
          return res;
        })
        .catch(() => cached || Promise.reject());

      // SWR: jeśli jest cache – zwróć od razu; w tle dociągnij nowe
      return cached || fetchPromise;
    })
  );
});
