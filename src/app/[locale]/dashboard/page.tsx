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
      <Container padding="md" maxWidth="7xl" className="h-full overflow-hidden lg:overflow-hidden">
        {/* PC画面 */}
        <div className="hidden lg:block h-full">
          <DashboardDesktop />
        </div>
        {/* スマホ画面 */}
        <div className="block lg:hidden h-full">
          <DashboardMobile />
        </div>
      </Container>
    </AuthGuard>
  );
}
