import { getCategories } from "@/actions/categories";
import { auth } from "@/auth";
import { Container } from "@/components/ui";
import { AuthGuard } from "@/features/auth";
import { DashboardDesktop } from "./DashboardDesktop";
import { DashboardMobile } from "./DashboardMobile";

/**
 * ダッシュボードページ
 * サーバーサイドでデータを取得してパフォーマンスを最適化
 */
export default async function Dashboard() {
  // サーバーサイドで認証を実行
  const session = await auth();

  // 認証済みの場合のみデータを取得
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  if (session?.user?.id) {
    try {
      categories = await getCategories(session.user.id);
    } catch {
      // エラー時は空配列を返す
      categories = [];
    }
  }

  return (
    <AuthGuard>
      {/* PC画面 */}
      <div className="hidden lg:block h-full">
        <Container padding="md" maxWidth="7xl" className="h-full overflow-hidden">
          <DashboardDesktop initialCategories={categories} />
        </Container>
      </div>
      {/* スマホ画面 */}
      <div className="block lg:hidden h-full">
        <Container maxWidth="7xl" className="h-full">
          <DashboardMobile initialCategories={categories} />
        </Container>
      </div>
    </AuthGuard>
  );
}
