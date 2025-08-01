self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("todo-cache").then(cache => {
      return cache.addAll([
        "/",
        "./index.html",
        "./css/styles.css",
        "./js/script.js",
        "./manifest.json",
        "./images/background.jpg",
        "./images/icone1.png",
        "./images/icone2.png"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});