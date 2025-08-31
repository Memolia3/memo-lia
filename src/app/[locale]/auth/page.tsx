import { Container } from "@/components/ui";
import { AuthDesktop } from "./AuthDesktop";
import { AuthMobile } from "./AuthMobile";

/**
 * 認証ページ
 */
export default function AuthPage() {
  return (
    <Container
      padding="md"
      maxWidth="7xl"
      className="h-full w-full overflow-hidden lg:overflow-hidden"
    >
      {/* PC画面 */}
      <AuthDesktop />
      {/* スマホ画面 */}
      <AuthMobile />
    </Container>
  );
}
