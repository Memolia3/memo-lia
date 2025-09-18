const CACHE_NAME = "memolia-v1";
const urlsToCache = ["/", "/manifest.json", "/assets/images/memo-lia-pwa-icon.png"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // 共有ターゲットの処理 - リダイレクトレスポンスをキャッシュしない
  if (url.pathname === "/share" && event.request.method === "GET") {
    // リダイレクトレスポンスをキャッシュしないよう、直接fetchする
    event.respondWith(
      fetch(event.request, {
        redirect: "manual", // リダイレクトを手動で処理
      })
        .then(response => {
          // リダイレクトレスポンスの場合は、新しいリダイレクトレスポンスを作成
          if (
            response.type === "opaqueredirect" ||
            (response.status >= 300 && response.status < 400)
          ) {
            return Response.redirect("/share?" + url.searchParams.toString());
          }
          return response;
        })
        .catch(() => {
          // fetchに失敗した場合は、リダイレクトレスポンスを作成
          return Response.redirect("/share?" + url.searchParams.toString());
        })
    );
    return;
  }

  // 通常のキャッシュ処理
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }

      return fetch(event.request).then(fetchResponse => {
        // リダイレクトレスポンスはキャッシュしない
        if (
          fetchResponse.type === "opaqueredirect" ||
          (fetchResponse.status >= 300 && fetchResponse.status < 400)
        ) {
          return fetchResponse;
        }

        // 正常なレスポンスのみキャッシュ
        const responseClone = fetchResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });

        return fetchResponse;
      });
    })
  );
});
