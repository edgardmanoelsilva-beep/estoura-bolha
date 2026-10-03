const CACHE_NAME = 'bolha-kids-v1';
const ARQUIVOS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARQUIVOS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nomes) => {
      return Promise.all(
        nomes.filter((nome) => nome !== CACHE_NAME).map((nome) => caches.delete(nome))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resposta) => {
      return resposta || fetch(event.request).then((respostaRede) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, respostaRede.clone());
          return respostaRede;
        });
      });
    }).catch(() => caches.match('./index.html'))
  );
});