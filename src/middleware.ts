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

/**
 * Accept-Languageヘッダーからロケールを検出
 */
function detectLocale(request: NextRequest): "ja" | "en" {
  const acceptLanguage = request.headers.get("accept-language") || "";
  // 日本語が優先されている場合は"ja"を返す
  if (acceptLanguage.toLowerCase().includes("ja")) {
    return "ja";
  }
  return "en";
}

/**
 * キャッシュ無効化ヘッダーを追加
 */
function addNoCacheHeaders(response: NextResponse): void {
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("Surrogate-Control", "no-store");
  response.headers.set("Vary", "Accept-Language");
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 静的ファイルやAPIルートはスキップ
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // ルートパスの場合は言語検出してリダイレクト（next-intlより先に処理）
  if (pathname === "/") {
    const locale = detectLocale(request);
    // 絶対URLでリダイレクト（Vercelエッジ環境で確実に動作するため）
    const redirectUrl = new URL(`/${locale}`, request.url);
    const redirectResponse = NextResponse.redirect(redirectUrl, { status: 307 });
    // キャッシュを完全に無効化（Vercelエッジキャッシュも含む）
    addNoCacheHeaders(redirectResponse);
    // Locationヘッダーを明示的に絶対URLで設定（念のため）
    redirectResponse.headers.set("Location", redirectUrl.toString());
    return redirectResponse;
  }

  // ロケールプレフィックスがあるパス（/en, /ja）はnext-intlに委譲
  // ロケールプレフィックスがないパスもnext-intlが処理する
  const intlResponse = await intlMiddleware(request);

  // レスポンスがない場合はnext()を返す（通常は発生しない）
  if (!intlResponse) {
    return NextResponse.next();
  }

  const response = intlResponse;

  // レスポンスにヘッダーを追加
  if (response.headers) {
    // リダイレクトレスポンスの場合はキャッシュを無効化
    if (response.status >= 300 && response.status < 400) {
      addNoCacheHeaders(response as NextResponse);
      // リダイレクトループを防ぐ：Locationヘッダーが`/`を指している場合は修正
      const location = response.headers.get("location");
      if (location && (location === "/" || location.endsWith("/"))) {
        // `/`へのリダイレクトを防ぐため、デフォルトロケールにリダイレクト
        const locale = detectLocale(request);
        const redirectUrl = new URL(`/${locale}`, request.url);
        response.headers.set("Location", redirectUrl.toString());
      }
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
