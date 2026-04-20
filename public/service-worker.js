const CACHE_STATIC = "igc-static-v4";
const CACHE_DYNAMIC = "igc-dynamic-v4";
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

// ================= FETCH =================
self.addEventListener("fetch", event => {
  const { request } = event;

  if (request.method !== "GET") return;

  //const url = new URL(request.url);

  // ---------------- HTML → Network First ----------------
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_DYNAMIC).then(cache => {
            cache.put(request, clone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then(res => res || caches.match(OFFLINE_URL));
        })
    );
    return;
  }

  // ---------------- Static Files → Cache First ----------------
  // if (
  //   url.origin === location.origin &&
  //   (
  //     request.destination === "image" ||
  //     request.destination === "font"
  //   )
  // ) {
  //   event.respondWith(
  //     caches.match(request).then(cached => {
  //       if (cached) return cached;

  //       return fetch(request).then(response => {
  //         const clone = response.clone();
  //         caches.open(CACHE_STATIC).then(cache => {
  //           cache.put(request, clone);
  //         });
  //         return response;
  //       });
  //     })
  //   );
  //   return;
  // }

  // ---------------- Other Requests → Network First ----------------
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});