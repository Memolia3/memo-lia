const CACHE_NAME = "memolia-v1";
const urlsToCache = ["/", "/manifest.json", "/assets/images/memo-lia-icon.png"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // 共有ターゲットの処理
  if (url.pathname === "/share" && event.request.method === "GET") {
    event.respondWith(Response.redirect("/share?" + url.searchParams.toString()));
    return;
  }

  // 通常のキャッシュ処理
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
