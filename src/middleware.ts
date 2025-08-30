import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

// next-intlのミドルウェア
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 静的ファイルやAPIルートはスキップ
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // 最後にi18nミドルウェアを実行 - 言語に合わせてパスを返す
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // ミドルウェアを適用するパス
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
