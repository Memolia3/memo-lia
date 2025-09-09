import { Container } from "@/components/ui";
import { AuthGuard } from "@/features/auth";
import { CategoryAddDesktop } from "./CategoryAddDesktop";
import { CategoryAddMobile } from "./CategoryAddMobile";

/**
 * カテゴリ追加ページ
 * デスクトップ・モバイル版をレスポンシブで表示
 */
export default function NewCategoryPage() {
  return (
    <AuthGuard>
      {/* PC画面 */}
      <div className="hidden lg:block h-full">
        <Container padding="md" maxWidth="7xl" className="h-full overflow-hidden">
          <CategoryAddDesktop />
        </Container>
      </div>
      {/* スマホ画面 */}
      <div className="block lg:hidden h-full">
        <Container maxWidth="7xl" className="h-full overflow-hidden">
          <CategoryAddMobile />
        </Container>
      </div>
    </AuthGuard>
  );
}
