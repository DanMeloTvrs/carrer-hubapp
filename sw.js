// Career Hub — service worker: internet primeiro, cópia guardada se estiver offline.
// Quando sai versão nova, atualiza e recarrega a página sozinho.
const CACHE = "career-hub-v3";
const ARQUIVOS = [
  "./", "index.html", "style.css", "script.js", "clubes.js", "selecoes.js",
  "firebase-config.js", "nuvem.js", "logo.png", "icon-192.png", "icon-512.png", "manifest.webmanifest"
];

self.addEventListener("install", function (evento) {
  evento.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return Promise.all(ARQUIVOS.map(function (a) {
        return cache.add(new Request(a, { cache: "reload" })).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (evento) {
  evento.waitUntil(
    caches.keys().then(function (nomes) {
      const antigos = nomes.filter(function (n) { return n !== CACHE; });
      return Promise.all(antigos.map(function (n) { return caches.delete(n); }))
        .then(function () { return self.clients.claim(); })
        .then(function () {
          // Só recarrega se existia versão antiga (não na primeira instalação)
          if (!antigos.length) return;
          return self.clients.matchAll({ type: "window" }).then(function (janelas) {
            janelas.forEach(function (j) { j.navigate(j.url); });
          });
        });
    })
  );
});

self.addEventListener("fetch", function (evento) {
  const req = evento.request;
  const url = new URL(req.url);

  if (req.method !== "GET" || url.origin !== self.location.origin ||
      url.pathname.startsWith("/__/") || url.pathname.startsWith("/downloads/")) return;

  evento.respondWith(
    fetch(req, { cache: "no-cache" }).then(function (resposta) {
      if (resposta && resposta.ok) {
        const copia = resposta.clone();
        caches.open(CACHE).then(function (cache) { cache.put(req, copia); });
      }
      return resposta;
    }).catch(function () {
      return caches.match(req).then(function (guardado) {
        return guardado || caches.match("index.html");
      });
    })
  );
});