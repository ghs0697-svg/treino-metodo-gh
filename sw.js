const CACHE_NAME = 'metodo-gh-v450';
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
  // v440: um asset secundario falhando (404/rede) NAO derruba a instalacao inteira; so o shell e obrigatorio.
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => Promise.all(ASSETS.map(u =>
      c.add(new Request(u, { cache: 'reload' })).catch(err => { if (u === './' || u === './index.html') throw err; })
    )))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      // gh-videos-v1 = vídeos de execução baixados pelo ALUNO pro offline. NUNCA entra na
      // limpeza de versão: sem esta exceção, cada atualização do app apagaria os downloads.
      Promise.all(keys.filter(k => k !== CACHE_NAME && k !== 'gh-videos-v1').map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// v440 (caso Devlin, iPhone/Safari 08/09): "FetchEvent.respondWith received an error: Returned response is null".
// O Safari recusa respondWith que resolve em null/undefined; acontecia quando o cache do shell tinha sido
// esvaziado pelo iOS e a rede falhava. Regra nova: TODO caminho devolve uma Response de verdade.
function _offlineHtml_() {
  return new Response('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="6"><title>M\u00e9todo GH</title><body style="margin:0;background:#0c0c0d;color:#e7e2d8;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:24px"><div><div style="color:#c9a24b;font-weight:800;letter-spacing:.08em;font-size:14px">M\u00c9TODO GH</div><h2 style="margin:14px 0 8px;font-size:20px">Sem conex\u00e3o agora</h2><p style="color:#9a9aa0;font-size:14px;line-height:1.5;margin:0">N\u00e3o consegui abrir o app. Confere a internet: eu tento de novo sozinho em alguns segundos.</p></div></body></html>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}
function _semNull_(p, req) {
  // garante Response: cache do shell pra navegacao, senao pagina offline (navegacao) ou erro de rede (asset)
  return Promise.resolve(p).catch(() => null).then(async r => {
    if (r) return r;
    try { const c = await caches.match(req, { ignoreSearch: true }); if (c) return c; } catch (_) {}
    if (req.mode === 'navigate') {
      try { const shell = (await caches.match('./index.html')) || (await caches.match('./')); if (shell) return shell; } catch (_) {}
      return _offlineHtml_();
    }
    return Response.error();
  });
}

// v448 (pente fino 11/09/2026): medido em producao, o front door do Google as vezes entrega a chamada ao
// Apps Script SEM a query (o script cai na rota padrao e responde "sem action"). Sao ~1.000 por dia, cerca de
// uma por abertura de app: a chamada daquele momento falha (a carga anterior nao aparece, o status do plano
// nao carrega) e o aluno nunca fica sabendo por que. Como TODA chamada ao servidor passa por aqui, este e o
// ponto unico pra consertar: se a resposta vier "sem action", refaz UMA vez. So GET, nunca POST: repetir um
// POST duplicaria gravacao de carga.
async function _gasFetch(req) {
  const r = await fetch(req, { cache: 'no-store' });
  if (req.method !== 'GET') return r;
  try {
    const txt = await r.clone().text();
    if (txt && txt.indexOf('sem action') !== -1) {
      return await fetch(req.url, { cache: 'no-store', credentials: 'omit' });
    }
  } catch (_) {}
  return r;
}

self.addEventListener('fetch', e => {
  // FONTES (Google Fonts): imutáveis — cache-first, senão caíam na regra 'Google = rede
  // sempre' abaixo e eram baixadas em TODA abertura, bloqueando a primeira pintura.
  if (e.request.url.includes('fonts.googleapis.com') || e.request.url.includes('fonts.gstatic.com')) {
    e.respondWith(_semNull_(
      caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
        if (resp && resp.ok) { const c = resp.clone(); caches.open(CACHE_NAME).then(x => x.put(e.request, c)).catch(() => {}); }
        return resp;
      })), e.request
    ));
    return;
  }
  // URLs do Google Sheets / docs / Apps Script: SEMPRE network direto (sem cache)
  // Se falhar, propaga erro pro app — melhor que servir resposta cacheada/parcial
  // que estava bugando o reload do PWA standalone no iOS (DIETA sumindo).
  if (e.request.url.includes('docs.google.com') || e.request.url.includes('script.google.com') || e.request.url.includes('googleapis.com')) {
    e.respondWith(_gasFetch(e.request));
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
      }).catch(() => caches.match(e.request)).then(r => r || Response.error())
    );
    return;
  }
  // index.html + editor-data.js + substitutos.js: STALE-WHILE-REVALIDATE (2026-07-29, abertura
  // instantânea). Serve o cache NA HORA (zero espera de rede pra pintar o app) e atualiza o cache
  // em background — mudança no shell/banco de exercícios aparece na PRÓXIMA abertura. O dado do
  // protocolo não passa por aqui (gviz/script.google.com = network direto, mais o cache de CSV do
  // próprio app que revalida sozinho), então protocolo novo continua aparecendo na hora.
  if (e.request.url.includes('index.html') || e.request.url.includes('editor-data.js') || e.request.url.includes('substitutos.js') || e.request.mode === 'navigate') {
    e.respondWith(_semNull_(
      caches.match(e.request, { ignoreSearch: true }).then(cached => {
        // no-cache: revalida com a origem (ETag) em vez de confiar no cache HTTP de
        // 10min do Pages — a atualização em background pegava shell requentado.
        // v440: fetch pela URL (string), nunca pelo Request de navegacao com init (WebKit antigo lancava TypeError).
        const net = fetch(e.request.url, { cache: 'no-cache', credentials: 'same-origin' }).then(resp => {
          if (resp && resp.ok && e.request.method === 'GET') {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone)).catch(() => {});
          }
          return resp;
        }).catch(() => null);
        // cache primeiro (instantâneo); sem cache, espera a rede; rede falhou, _semNull_ cai pro shell/offline
        if (cached) { net.catch(() => {}); return cached; }
        return net;
      }), e.request
    ));
    return;
  }
  // Cache-first pros assets estáticos. ignoreSearch: o precache guarda './' e os
  // assets SEM query, mas a navegacao vem com ?sheet=...&tab=... e os scripts com ?v=N
  // — sem ignoreSearch o fallback offline dava miss e o PWA nao abria.
  e.respondWith(_semNull_(
    caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request)), e.request
  ));
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
