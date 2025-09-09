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
      {/* PC画面 */}
      <div className="hidden lg:block h-full">
        <Container padding="md" maxWidth="7xl" className="h-full overflow-hidden">
          <TopDesktop />
        </Container>
      </div>
      {/* スマホ画面 */}
      <div className="block lg:hidden h-full">
        <Container maxWidth="7xl" className="h-full overflow-hidden">
          <TopMobile />
        </Container>
      </div>
    </>
  );
}
