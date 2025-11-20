import { AppFooter } from "@/components/layout";
import { Container, Loading } from "@/components/ui";
import { AuthRedirectHandler } from "@/features/auth";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// デバイス別コンポーネントを動的インポート（コード分割）
const TopDesktop = dynamic(
  () => import("@/app/[locale]/TopDesktop").then(mod => ({ default: mod.TopDesktop })),
  {
    ssr: true,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center">
        <Loading size="lg" variant="spinner" />
      </div>
    ),
  }
);

const TopMobile = dynamic(
  () => import("@/app/[locale]/TopMobile").then(mod => ({ default: mod.TopMobile })),
  {
    ssr: true,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center">
        <Loading size="lg" variant="spinner" />
      </div>
    ),
  }
);

/**
 * TOPページ
 */
export default function Top() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://memo-lia.memolia8.com";

  return (
    <div className="flex flex-col h-full">
      {/* WebSite Schema */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "MemoLia",
            url: baseUrl,
            description: "お気に入りのURLを整理して保管するアプリ",
            inLanguage: ["ja", "en"],
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${baseUrl}/search?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "MemoLia",
            url: baseUrl,
            logo: `${baseUrl}/assets/images/memo-lia-icon.png`,
            description: "URL保管・整理アプリケーション",
            sameAs: [],
          }),
        }}
      />
      <Suspense fallback={null}>
        <AuthRedirectHandler />
      </Suspense>
      {/* PC画面 */}
      <div className="hidden lg:block flex-1">
        <Container padding="md" maxWidth="7xl" className="h-full overflow-hidden">
          <TopDesktop />
        </Container>
      </div>
      {/* スマホ画面 */}
      <div className="block lg:hidden flex-1">
        <Container maxWidth="7xl" className="h-full">
          <TopMobile />
        </Container>
      </div>
      {/* フッター */}
      <AppFooter />
    </div>
  );
}
