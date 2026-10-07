// Career Hub — service worker simples: tenta a internet primeiro e usa a cópia guardada se estiver offline.
// Só mexe nos arquivos do próprio app; Firebase, login e fontes passam direto.
const CACHE = "career-hub-v2";
const ARQUIVOS = [
  "./", "index.html", "style.css", "script.js", "clubes.js", "selecoes.js",
  "firebase-config.js", "nuvem.js", "logo.png", "icon-192.png", "icon-512.png", "manifest.webmanifest"
];

self.addEventListener("install", function (evento) {
  evento.waitUntil(
    caches.open(CACHE).then(function (cache) {
      // Um por um, pra um arquivo faltando não derrubar o resto
      return Promise.all(ARQUIVOS.map(function (a) { return cache.add(a).catch(function () {}); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (evento) {
  evento.waitUntil(
    caches.keys().then(function (nomes) {
      return Promise.all(nomes.filter(function (n) { return n !== CACHE; }).map(function (n) { return caches.delete(n); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (evento) {
  const req = evento.request;
  const url = new URL(req.url);

  if (req.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/__/") || url.pathname.startsWith("/downloads/")) return;

  evento.respondWith(
    fetch(req).then(function (resposta) {
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