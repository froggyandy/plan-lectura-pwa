// Service worker de la app de lectura en ruso (carpeta chtenie/).
// Para forzar que los teléfonos descarguen todo de nuevo tras un cambio, sube el número de versión.
// Comparte dominio con la app de la carpeta de arriba: cada una solo toca sus propias cachés (prefijo chtenie-).
const PREFIX = 'chtenie-';
const CACHE = PREFIX + 'v1';
const FONT_CACHE = PREFIX + 'shrifty';
const SDK_CACHE = PREFIX + 'firebase';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  const keep = [CACHE, FONT_CACHE, SDK_CACHE];
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && !keep.includes(k)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // La página: primero la red (para recibir actualizaciones), y la copia guardada si no hay conexión.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(cache => cache.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html', {cacheName: CACHE}))
    );
    return;
  }

  // Archivos propios: primero la caché.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE).then(cache => cache.match(req).then(hit => hit || fetch(req).then(res => {
        if (res.ok) cache.put(req, res.clone());
        return res;
      })))
    );
    return;
  }

  // SDK de Firebase: cada versión tiene su propia URL y nunca cambia, así que basta la copia guardada.
  // Sin esto la app no podría sincronizar después de abrirse sin conexión.
  if (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/')) {
    event.respondWith(
      caches.open(SDK_CACHE).then(cache => cache.match(req).then(hit => hit || fetch(req).then(res => {
        if (res.ok) cache.put(req, res.clone());
        return res;
      })))
    );
    return;
  }

  // Fuentes de Google: la copia guardada al instante, refrescada en segundo plano.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONT_CACHE).then(cache => cache.match(req).then(hit => {
        const net = fetch(req).then(res => {
          if (res.ok) cache.put(req, res.clone());
          return res;
        }).catch(() => hit);
        return hit || net;
      }))
    );
  }
});
