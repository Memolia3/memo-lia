import { routing } from "@/i18n/routing";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * ルートページ
 * ルートURL（/）にアクセスした際に、適切なロケールにリダイレクト
 */
export default async function RootPage() {
  // Accept-Languageヘッダーからロケールを検出
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";
  const locale = acceptLanguage.startsWith("ja") ? "ja" : routing.defaultLocale;

  // localePrefix: "always"の設定により、すべてのロケールでURLにプレフィックスが付く
  // ルートURL（/）は、/[locale]/page.tsxにマッチさせるため、/enまたは/jaにリダイレクトする
  redirect(`/${locale}`);
}
