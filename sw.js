const CACHE_NAME = 'metodo-gh-v130';
const ASSETS = [
  './',
  './index.html',
  './editor-data.js',
  './manifest.json',
  './gh-logo.png',
  './icon-192.png',
  './icon-512.png',
  './icon-192-maskable.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // URLs do Google Sheets / docs / Apps Script: SEMPRE network direto (sem cache)
  // Se falhar, propaga erro pro app — melhor que servir resposta cacheada/parcial
  // que estava bugando o reload do PWA standalone no iOS (DIETA sumindo).
  if (e.request.url.includes('docs.google.com') || e.request.url.includes('script.google.com') || e.request.url.includes('googleapis.com')) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }));
    return;
  }
  // index.html / navegação: network-first com fallback pro cache (offline)
  if (e.request.url.includes('index.html') || e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  // Cache-first pros assets estáticos
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

// ── Web Push: lembrete de água (e outros futuros pushes do servidor) ──
self.addEventListener('push', event => {
  let data = { title: '💧 Hora da água!', body: 'Já tomou água? Marca +1 copo no app.', tag: 'water-reminder', url: './' };
  try {
    if (event.data) {
      const parsed = event.data.json();
      data = Object.assign(data, parsed);
    }
  } catch (_) {}
  const options = {
    body: data.body,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: data.tag,
    renotify: true,
    requireInteraction: false,
    data: { url: data.url || './' }
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
