import { Container } from "@/components/ui";
import { AuthDesktop } from "./AuthDesktop";
import { AuthMobile } from "./AuthMobile";

/**
 * 認証ページ
 */
export default function AuthPage() {
  return (
    <>
      {/* PC画面 */}
      <div className="hidden lg:block h-full">
        <Container padding="md" maxWidth="7xl" className="h-full w-full overflow-hidden">
          <AuthDesktop />
        </Container>
      </div>
      {/* スマホ画面 */}
      <div className="block lg:hidden h-full">
        <Container maxWidth="7xl" className="h-full w-full overflow-hidden">
          <AuthMobile />
        </Container>
      </div>
    </>
  );
}
