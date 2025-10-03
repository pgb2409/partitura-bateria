self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("partitura-cache").then((cache) =>
      cache.addAll([
        "./",
        "./index.html",
        "./script.js",
        "./style.css",
        "./manifest.json",
        "https://cdn.jsdelivr.net/npm/vexflow@1.2.93/releases/vexflow-min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
      ])
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
