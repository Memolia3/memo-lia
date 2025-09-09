import { Container } from "@/components/ui";
import { AuthGuard } from "@/features/auth";
import { DashboardDesktop } from "./DashboardDesktop";
import { DashboardMobile } from "./DashboardMobile";

/**
 * ダッシュボードページ
 */
export default function Dashboard() {
  return (
    <AuthGuard>
      {/* PC画面 */}
      <div className="hidden lg:block h-full">
        <Container padding="md" maxWidth="7xl" className="h-full overflow-hidden">
          <DashboardDesktop />
        </Container>
      </div>
      {/* スマホ画面 */}
      <div className="block lg:hidden h-full">
        <Container maxWidth="7xl" className="h-full overflow-hidden">
          <DashboardMobile />
        </Container>
      </div>
    </AuthGuard>
  );
}
