const STATIC_CACHE_NAME = "memolia-static-v5";
const DYNAMIC_CACHE_NAME = "memolia-dynamic-v5";

const urlsToCache = [
  // ルートパス"/"はリダイレクトされるためキャッシュしない
  "/manifest.json",
  "/assets/images/memo-lia-pwa-icon.png",
  "/assets/images/memo-lia-icon.png",
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

  // chrome-extensionやその他の非HTTPスキームのリクエストは処理しない
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return;
  }

  // ルートパス"/"はリダイレクトされるため、Service Workerを完全にバイパスする
  // event.respondWithを呼ばないことで、リクエストを通常のネットワークリクエストとして処理
  if (url.pathname === "/" && event.request.method === "GET") {
    return; // Service Workerを通さずに、通常のネットワークリクエストとして処理
  }

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

  // 静的アセットのキャッシュ戦略（Cache First）
  if (
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/assets") ||
    url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|ico|css|js|woff|woff2|ttf|eot)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(fetchResponse => {
          // 正常なレスポンスのみキャッシュ（200ステータスで、リクエストがHTTP/HTTPSの場合）
          if (
            fetchResponse.status === 200 &&
            (url.protocol === "http:" || url.protocol === "https:")
          ) {
            try {
              const cacheCopy = fetchResponse.clone();
              caches.open(STATIC_CACHE_NAME).then(cache => {
                cache.put(event.request, cacheCopy).catch(() => {
                  // キャッシュエラーは無視（chrome-extensionなどで発生する可能性がある）
                });
              });
            } catch {
              // キャッシュエラーは無視
            }
          }
          return fetchResponse;
        });
      })
    );
    return;
  }

  // POSTリクエストやその他の非GETリクエストはキャッシュしない
  if (event.request.method !== "GET") {
    event.respondWith(fetch(event.request));
    return;
  }

  // 通常のキャッシュ処理 - Network First戦略（Stale-While-Revalidate）
  event.respondWith(
    caches.open(DYNAMIC_CACHE_NAME).then(cache => {
      return caches.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request, {
          redirect: "follow", // リダイレクトを自動的に追従
        }).then(fetchResponse => {
          // リダイレクトレスポンスはキャッシュしない
          if (
            fetchResponse.type === "opaqueredirect" ||
            (fetchResponse.status >= 300 && fetchResponse.status < 400)
          ) {
            return fetchResponse;
          }

          // 正常なレスポンスのみキャッシュ（GETリクエストのみ、HTTP/HTTPSの場合）
          if (
            fetchResponse.status === 200 &&
            event.request.method === "GET" &&
            (url.protocol === "http:" || url.protocol === "https:")
          ) {
            try {
              cache.put(event.request, fetchResponse.clone()).catch(() => {
                // キャッシュエラーは無視（chrome-extensionなどで発生する可能性がある）
              });
            } catch {
              // キャッシュエラーは無視
            }
          }

          return fetchResponse;
        });

        // キャッシュがあれば即座に返し、バックグラウンドで更新
        return cachedResponse || fetchPromise;
      });
    })
  );
});
