import { AppFooter } from "@/components/layout";
import { Container } from "@/components/ui";
import { AuthRedirectHandler } from "@/features/auth/components/AuthRedirectHandler";
import { AuthDesktop } from "./AuthDesktop";
import { AuthMobile } from "./AuthMobile";

/**
 * 認証ページ
 */
export default function AuthPage() {
  return (
    <div className="flex flex-col h-full">
      <AuthRedirectHandler />
      {/* PC画面 */}
      <div className="hidden lg:block flex-1">
        <Container padding="md" maxWidth="7xl" className="h-full w-full overflow-hidden">
          <AuthDesktop />
        </Container>
      </div>
      {/* スマホ画面 */}
      <div className="block lg:hidden flex-1">
        <Container maxWidth="7xl" className="h-full w-full">
          <AuthMobile />
        </Container>
      </div>
      {/* フッター */}
      <AppFooter />
    </div>
  );
}
