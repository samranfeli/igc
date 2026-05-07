const CACHE_STATIC = "igc-static-v5";
const CACHE_DYNAMIC = "igc-dynamic-v5";
const OFFLINE_URL = "/offline.html";

// ================= INSTALL =================
self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => {
      return cache.addAll([
        "/",
        OFFLINE_URL,
      ]);
    })
  );
});

// ================= ACTIVATE =================
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_STATIC && key !== CACHE_DYNAMIC) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});
