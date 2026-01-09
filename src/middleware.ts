import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

// next-intlのミドルウェア
const intlMiddleware = createMiddleware(routing);

// Web Crypto APIを使用してnonceを生成
function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, Array.from(array)));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 静的ファイルやAPIルートはスキップ
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // next-intlのミドルウェアに処理を委譲
  // localePrefix: "always"の設定により、すべてのロケールでURLにプレフィックスが付く
  const intlResponse = await intlMiddleware(request);

  // レスポンスがない場合はデフォルトロケールにリダイレクト
  if (!intlResponse) {
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.redirect(url);
  }

  const response = intlResponse;

  // レスポンスにヘッダーを追加
  if (response.headers) {
    // リダイレクトレスポンスの場合はキャッシュを無効化
    // これによりVercelエッジキャッシュの問題を防ぐ
    if (response.status >= 300 && response.status < 400) {
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
    }

    // HSTSヘッダー（本番環境のみ）
    if (process.env.NODE_ENV === "production") {
      response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

      // リクエストごとに nonce を生成
      const nonce = generateNonce();

      // CSP ヘッダーに nonce を埋め込む
      // AdSense用に'unsafe-inline'を追加（AdSenseは動的にインラインスクリプトを生成するため）
      response.headers.set(
        "Content-Security-Policy",
        [
          "default-src 'self'",
          `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagservices.com https://www.google-analytics.com`,
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https: https://pagead2.googlesyndication.com https://www.google-analytics.com",
          "font-src 'self' data:",
          "connect-src 'self' https://www.google-analytics.com https://pagead2.googlesyndication.com",
          "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join("; ")
      );

      response.headers.set("X-Content-Security-Policy-Nonce", nonce);
    }
  }

  return response;
}

export const config = {
  matcher: [
    // ルートパスを明示的に含める（next-intlがデフォルトロケールにリダイレクトするため必要）
    "/",
    // ミドルウェアを適用するパス（API、静的ファイルを除く）
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
