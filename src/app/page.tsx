import { routing } from "@/i18n/routing";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

/**
 * ルートページ
 * ルートURL（/）にアクセスした際に、適切なロケールにリダイレクト
 */
export default async function RootPage() {
  // Accept-Languageヘッダーからロケールを検出
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";
  const locale = acceptLanguage.startsWith("ja") ? "ja" : routing.defaultLocale;

  // localePrefix: "as-needed"の設定により、デフォルトロケール（en）の場合は
  // URLにプレフィックスを付けずに処理される
  // しかし、Next.jsのApp Routerの構造上、/[locale]/page.tsxにマッチさせるため、
  // デフォルトロケールでも/enにリダイレクトする
  redirect(`/${locale}`);
}

