const STATIC_CACHE_NAME = "memolia-static-v2";
const DYNAMIC_CACHE_NAME = "memolia-dynamic-v2";

const urlsToCache = [
  "/",
  "/manifest.json",
  "/assets/images/memo-lia-pwa-icon.png",
  "/assets/images/memo-lia-icon.png",
  "/favicon.ico",
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  // 新しいService Workerを即座にアクティブにする
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      // 古いキャッシュを削除
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // すべてのクライアントを制御下に置く
      self.clients.claim(),
    ])
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

  // 通常のキャッシュ処理 - Network First戦略
  event.respondWith(
    caches.open(DYNAMIC_CACHE_NAME).then(cache => {
      return fetch(event.request)
        .then(fetchResponse => {
          // リダイレクトレスポンスはキャッシュしない
          if (
            fetchResponse.type === "opaqueredirect" ||
            (fetchResponse.status >= 300 && fetchResponse.status < 400)
          ) {
            return fetchResponse;
          }

          // 正常なレスポンスのみキャッシュ
          if (fetchResponse.status === 200) {
            cache.put(event.request, fetchResponse.clone());
          }

          return fetchResponse;
        })
        .catch(() => {
          // ネットワークエラーの場合はキャッシュから返す
          return caches.match(event.request);
        });
    })
  );
});
