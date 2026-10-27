/* WaKit service worker — installable app shell + offline fallback.
 *
 * Strategy
 *  - App shell (HTML, manifest, icons): precached on install, refreshed on every
 *    successful navigation.
 *  - Same-origin static assets (hashed JS/CSS, images): stale-while-revalidate,
 *    so repeat visits are instant and offline still works.
 *  - Cross-origin requests (Google Fonts, FFmpeg core CDN) are never intercepted.
 *  - Range requests (video/audio scrubbing) are passed straight through.
 */

const VERSION = 'wakit-v1';
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;
const OFFLINE_URL = '/offline.html';

const SHELL_ASSETS = [
  '/',
  '/index.html',
  OFFLINE_URL,
  '/site.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png',
  '/apple-touch-icon.png',
  '/favicon.svg',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await Promise.all(
        SHELL_ASSETS.map(async (url) => {
          try {
            const response = await fetch(new Request(url, { cache: 'reload' }));
            if (response.ok) await cache.put(url, response);
          } catch {
            /* A single missing asset must not block installation. */
          }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => !key.startsWith(VERSION))
          .map((key) => caches.delete(key)),
      );
      if (self.registration.navigationPreload) {
        try {
          await self.registration.navigationPreload.disable();
        } catch {
          /* Not supported everywhere. */
        }
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === '/sw.js') return;
  if (request.headers.has('range')) return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  const cacheable =
    Boolean(request.destination) ||
    /\.(?:js|mjs|css|woff2?|ttf|png|jpe?g|svg|webp|avif|ico|json|webmanifest|txt|xml)$/i.test(
      url.pathname,
    );

  if (cacheable) {
    event.respondWith(staleWhileRevalidate(event));
  }
});

async function handleNavigation(request) {
  const cache = await caches.open(SHELL_CACHE);

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      // Every SPA route is served the same index.html shell.
      cache.put('/index.html', response.clone()).catch(() => {});
    }
    return response;
  } catch {
    const cached =
      (await cache.match(request, { ignoreSearch: true })) ||
      (await cache.match('/index.html')) ||
      (await cache.match('/')) ||
      (await caches.match(OFFLINE_URL));

    return cached || Response.error();
  }
}

async function staleWhileRevalidate(event) {
  const { request } = event;
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then((response) => {
      if (response && response.ok && response.type === 'basic') {
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    event.waitUntil(network.then(() => undefined).catch(() => {}));
    return cached;
  }

  const response = await network;
  return response || Response.error();
}
