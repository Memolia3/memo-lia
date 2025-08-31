import { TopDesktop } from "@/app/[locale]/TopDesktop";
import { TopMobile } from "@/app/[locale]/TopMobile";
import { Container } from "@/components/ui";

/**
 * TOPページ
 */
export default function Top() {
  return (
    <Container padding="md" maxWidth="7xl" className="h-full overflow-hidden lg:overflow-hidden">
      {/* PC画面 */}
      <TopDesktop />
      {/* スマホ画面 */}
      <TopMobile />
    </Container>
  );
}
