import { TopDesktop } from "@/app/[locale]/TopDesktop";
import { TopMobile } from "@/app/[locale]/TopMobile";
import { AppFooter } from "@/components/layout";
import { Container } from "@/components/ui";
import { AuthRedirectHandler } from "@/features/auth";

/**
 * TOPページ
 */
export default function Top() {
  return (
    <div className="flex flex-col h-full">
      <AuthRedirectHandler />
      {/* PC画面 */}
      <div className="hidden lg:block flex-1">
        <Container padding="md" maxWidth="7xl" className="h-full overflow-hidden">
          <TopDesktop />
        </Container>
      </div>
      {/* スマホ画面 */}
      <div className="block lg:hidden flex-1">
        <Container maxWidth="7xl" className="h-full overflow-hidden">
          <TopMobile />
        </Container>
      </div>
      {/* フッター */}
      <AppFooter />
    </div>
  );
}
