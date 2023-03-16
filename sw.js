const CACHE_NAME = `pwa-template-v2`;

const contentToCache = [
    "/",
    "js/app.js",
    "icons/icon-512.png",
    "icons/maskable-icon-512.png",
    "index.html",
    "style.css",
    "https://type.fit/api/quotes",
  ];

//caching files upon install for offline use
self.addEventListener("install", (event) => {
  console.log("[Service Worker] installed");
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(contentToCache);
    })()
  );
});

// see if resources are cached before making network request
self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      } else {
        try {
          // if the resource was not  in the cache, try the network
          const fetchResponse = await fetch(event.request);

          // Save the resource in the cache and return it
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        } catch (e) {
          console.error("the network failed:", e);
          throw new Error("error", e);
        }
      }
    })()
  );
});

// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

self.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  showInstallPromotion();
  // Optionally, send analytics event that PWA install promo was shown.
  console.log(`'beforeinstallprompt' event was fired.`);
});

