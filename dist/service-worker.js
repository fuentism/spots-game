const cacheName = 'spots-game-cache';
const filesToCache = [
  '/offline.html',
];

self.addEventListener('install', function(ev) {
  self.skipWaiting();
  ev.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(filesToCache);
    })
  )
});

self.addEventListener('activate', function(ev) {
  ev.waitUntil(
    caches.keys().then((keyList) => {
      keyList.map((key) => {
        if(key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache: ', key);
          return caches.delete(key);
        }
      });
    })
  )
});

self.addEventListener('fetch', function(ev) {
  if (ev.request.mode !== 'navigate') {
    // Not a page navigation.
    return;
  }
  ev.respondWith(
    fetch(ev.request)
      .catch(() => {
        return caches.open(cacheName)
          .then((cache) => {
            return cache.match('offline.html');
          });
      })
  )
});
