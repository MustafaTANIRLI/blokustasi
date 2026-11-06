// Blok Ustası 4.0.0 çevrimdışı önbelleği. Sayfalar önce ağdan istenir (yeni sürüm hemen gelsin), ağ yoksa
// önbellekten açılır; yazı tipleri ve simgeler önce önbellekten. APK ve sürüm bilgisi önbelleğe girmez. Sürüm değişince eski önbellek silinir.
const CACHE = 'blokustasi-4.0.0';
const CORE = ["./","./oyna/","./manifest.webmanifest","./icon.png","./icon-192.png","./apple-touch-icon.png","./oyna/fonts/fonts.css","./oyna/fonts/LilitaOne-Regular.ttf","./oyna/fonts/Nunito-800-latin-ext.woff2","./oyna/fonts/Nunito-800-latin.woff2","./oyna/fonts/Nunito-900-latin-ext.woff2","./oyna/fonts/Nunito-900-latin.woff2"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('blokustasi-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.endsWith('.apk') || url.pathname.endsWith('version.json')) return;
  const save = (res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; };
  if (req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html')) {
    e.respondWith(fetch(req).then(save).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('./oyna/'))));
  } else {
    e.respondWith(caches.match(req).then((r) => r || fetch(req).then(save)));
  }
});
