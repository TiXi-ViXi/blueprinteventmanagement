/* ==========================================================================
   SERVICE WORKER // THE BLUEPRINT EVENT MANAGEMENT WEB APP (PWA)
   Khulna, Bangladesh
   ========================================================================== */

const CACHE_NAME = 'blueprint-pwa-v2.3.7';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './login.html',
  './admin.html',
  './bsaaevent.html',
  './display.html',
  './gift.html',
  './lottery.html',
  './js/bsaa-photos.js?v=4',
  './js/zxing.min.js',
  './css/blueprint.css',
  './js/00-registry.js',
  './js/01-hud-shell.js',
  './js/02-visual-fx.js',
  './js/03-roster-portfolio.js',
  './js/04-services-venues.js',
  './js/05-blueprint-lab.js',
  './js/06-cad-studio.js',
  './js/07-show-tools.js',
  './js/08-comms-concierge.js',
  './js/09-admin-portal.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon.svg',
  './IMG_1632.JPG.jpeg',
  './IMG_4350.JPG.jpeg',
  './WhatsApp Image 2026-11-11 at 1.19.01 AM.jpeg',
  './WhatsApp Image 2026-11-11 at 1.20.03 AM.jpeg',
  './WhatsApp Image 2026-11-11 at 2.51.32 AM.jpeg',
  './WhatsApp Image 2026-11-12 at 2.01.42 AM.jpeg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[PWA SW] Precache partial error (non-fatal):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never cache /api/ requests — let them hit network or fail cleanly for offline fallback
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // HTML navigation: Network first, cache fallback
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return networkRes;
      }).catch(() => {
        return caches.match(req).then((cached) => {
          if (cached) return cached;
          return caches.match('./index.html');
        });
      })
    );
    return;
  }

  // Code Assets (JS & CSS): Network first, EXCEPT heavy versioned bundles (bsaa-photos.js / zxing.min.js) which use Cache-First
  const isHeavyStaticBundle = url.pathname.endsWith('bsaa-photos.js') || url.pathname.endsWith('zxing.min.js');
  if (!isHeavyStaticBundle && (url.pathname.endsWith('.js') || url.pathname.endsWith('.css'))) {
    event.respondWith(
      fetch(req).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return networkRes;
      }).catch(() => {
        return caches.match(req);
      })
    );
    return;
  }

  // Static Assets (Images, Icons, Fonts, Heavy Bundles): Pure Cache-First with network fallback
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return networkRes;
      }).catch(() => {});
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
