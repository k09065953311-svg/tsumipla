// オフラインでも画面が開けるように、アプリ本体だけをキャッシュする（商品検索や箱絵は常にネットから）
const CACHE = 'tsumipla-v3';
const FILES = ['./', './index.html', './manual.html', './worker/yahoo-proxy.js', './lib/zxing.min.js', './manifest.webmanifest', './icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin || e.request.method !== 'GET') return;
  // 新しい版を優先し、圏外のときだけキャッシュを使う
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
