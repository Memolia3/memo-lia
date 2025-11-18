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
  return (
    <div className="flex flex-col h-full">
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
