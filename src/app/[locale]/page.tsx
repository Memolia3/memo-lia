import { TopDesktop } from "@/app/[locale]/TopDesktop";
import { TopMobile } from "@/app/[locale]/TopMobile";
import { Container } from "@/components/ui";
import { AuthRedirectHandler } from "@/features/auth";

/**
 * TOPページ
 */
export default function Top() {
  return (
    <>
      <AuthRedirectHandler />
      <Container padding="md" maxWidth="7xl" className="h-full overflow-hidden lg:overflow-hidden">
        {/* PC画面 */}
        <TopDesktop />
        {/* スマホ画面 */}
        <TopMobile />
      </Container>
    </>
  );
}
