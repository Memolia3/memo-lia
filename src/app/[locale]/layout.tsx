import { GlobalErrorBoundary } from "@/components/error";
import { ZoomDetector } from "@/components/layout";
import { NotificationProvider } from "@/components/notification";
import { PWARegister } from "@/components/PWA/PWARegister";
import { Background } from "@/components/ui";
import { AuthProvider } from "@/features/auth";
import type { PageMetaOptions } from "@/types";
import { generateMetadata as generateMeta, isLocaleEnglish } from "@/utils/meta";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { headers } from "next/headers";
import Script from "next/script";
import "../globals.css";

/**
 * 動的メタデータ生成関数
 * @param params - パラメータ
 * @returns メタデータ
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // TOPページ用のメタデータ設定
  const metaOptions: PageMetaOptions = {
    title: isLocaleEnglish(locale) ? "TOP" : "トップ",
    description: isLocaleEnglish(locale)
      ? "Organize and store your favorite URLs"
      : "お気に入りのURLを整理して保管するアプリ",
    keywords: isLocaleEnglish(locale)
      ? ["bookmarks", "URL management", "favorites", "organize"]
      : ["ブックマーク", "URL管理", "お気に入り", "整理"],
    type: "website",
    url: "/",
    other: {
      "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION || "",
    },
  };

  return generateMeta(locale, metaOptions);
}

/**
 * ロケールレイアウト
 * @param children - 子要素
 * @param params - パラメータ
 * @returns ロケールレイアウト
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const headersList = await headers();
  const { locale } = await params;
  const messages = await getMessages();
  const nonce = headersList.get("x-content-security-policy-nonce");

  return (
    <html lang={locale} className="dark:bg-gray-900 h-full">
      <body
        className="antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 h-full"
        suppressHydrationWarning={true}
      >
        <PWARegister />
        <ZoomDetector />
        <GlobalErrorBoundary>
          <NotificationProvider>
            <Background className="h-full">
              <AuthProvider>
                <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
              </AuthProvider>
            </Background>
          </NotificationProvider>
        </GlobalErrorBoundary>
        {nonce && <Script nonce={nonce} />}
        <SpeedInsights />
      </body>
    </html>
  );
}
