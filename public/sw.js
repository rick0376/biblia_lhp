self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// fetch handler (pass-through)
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
