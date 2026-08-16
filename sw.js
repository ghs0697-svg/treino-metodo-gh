const CACHE_NAME = 'metodo-gh-v362';
const ASSETS = [
  './',
  './index.html',
  './editor-data.js',
  './substitutos.js',
  './manifest.json',
  './gh-logo.png',
  './icon-192.png',
  './icon-512.png',
  './icon-192-maskable.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png',
  './assets/bg-gym.jpg',
  './assets/bg-particles.jpg',
  './assets/bg-texture.jpg',
  './assets/gh-hero.jpg'
];

self.addEventListener('install', e => {
  // cache: 'reload' fura o cache HTTP do Pages (max-age=600) — sem isso o SW novo
  // instalava carregando o index VELHO e a "atualização" vinha com shell antigo.
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' }))))
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
  // FONTES (Google Fonts): imutáveis — cache-first, senão caíam na regra 'Google = rede
  // sempre' abaixo e eram baixadas em TODA abertura, bloqueando a primeira pintura.
  if (e.request.url.includes('fonts.googleapis.com') || e.request.url.includes('fonts.gstatic.com')) {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
        if (resp && resp.ok) { const c = resp.clone(); caches.open(CACHE_NAME).then(x => x.put(e.request, c)).catch(() => {}); }
        return resp;
      }))
    );
    return;
  }
  // URLs do Google Sheets / docs / Apps Script: SEMPRE network direto (sem cache)
  // Se falhar, propaga erro pro app — melhor que servir resposta cacheada/parcial
  // que estava bugando o reload do PWA standalone no iOS (DIETA sumindo).
  if (e.request.url.includes('docs.google.com') || e.request.url.includes('script.google.com') || e.request.url.includes('googleapis.com')) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }));
    return;
  }
  // GHFlix (aba): catálogo + index mudam toda semana (curadoria/renovação).
  // network-first pra sempre vir fresco online; cache só como fallback offline.
  if (e.request.url.includes('/ghflix/')) {
    e.respondWith(
      fetch(e.request).then(resp => {
        if (resp && resp.ok && e.request.method === 'GET') {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone)).catch(() => {});
        }
        return resp;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  // index.html + editor-data.js + substitutos.js: STALE-WHILE-REVALIDATE (2026-07-29, abertura
  // instantânea). Serve o cache NA HORA (zero espera de rede pra pintar o app) e atualiza o cache
  // em background — mudança no shell/banco de exercícios aparece na PRÓXIMA abertura. O dado do
  // protocolo não passa por aqui (gviz/script.google.com = network direto, mais o cache de CSV do
  // próprio app que revalida sozinho), então protocolo novo continua aparecendo na hora.
  if (e.request.url.includes('index.html') || e.request.url.includes('editor-data.js') || e.request.url.includes('substitutos.js') || e.request.mode === 'navigate') {
    e.respondWith(
      caches.match(e.request, { ignoreSearch: true }).then(cached => {
        // no-cache: revalida com a origem (ETag) em vez de confiar no cache HTTP de
        // 10min do Pages — a atualização em background pegava shell requentado.
        const net = fetch(e.request, { cache: 'no-cache' }).then(resp => {
          if (resp && resp.ok && e.request.method === 'GET') {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone)).catch(() => {});
          }
          return resp;
        }).catch(() => null);
        // cache primeiro (instantâneo); sem cache, espera a rede; rede falhou, tenta cache de novo
        return cached || net.then(r => r || caches.match(e.request, { ignoreSearch: true }));
      })
    );
    return;
  }
  // Cache-first pros assets estáticos. ignoreSearch: o precache guarda './' e os
  // assets SEM query, mas a navegacao vem com ?sheet=...&tab=... e os scripts com ?v=N
  // — sem ignoreSearch o fallback offline dava miss e o PWA nao abria.
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request))
  );
});

// ── Aperto de mão de versão: a página pergunta qual versão este SW é. Se o shell
// rodando for mais velho que o SW ativo, a página se recarrega sozinha (auto-update). ──
self.addEventListener('message', event => {
  if (event.data === 'gh_versao' && event.ports && event.ports[0]) {
    event.ports[0].postMessage(CACHE_NAME);
  }
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
