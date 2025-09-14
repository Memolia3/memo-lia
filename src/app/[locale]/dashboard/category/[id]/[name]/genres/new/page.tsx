import { Container } from "@/components/ui";
import { AuthGuard } from "@/features/auth";
import GenreAddDesktop from "./GenreAddDesktop";
import GenreAddMobile from "./GenreAddMobile";

interface NewGenrePageProps {
  params: Promise<{
    id: string;
    name: string;
    locale: string;
  }>;
}

/**
 * ジャンル追加ページ
 * デスクトップ・モバイル版をレスポンシブで表示
 */
export default async function NewGenrePage({ params }: NewGenrePageProps) {
  const { id, name } = await params;
  return (
    <AuthGuard>
      {/* PC画面 */}
      <div className="hidden lg:block h-full">
        <Container padding="md" maxWidth="7xl" className="h-full overflow-hidden">
          <GenreAddDesktop categoryId={id} categoryName={decodeURIComponent(name)} />
        </Container>
      </div>
      {/* スマホ画面 */}
      <div className="block lg:hidden h-full">
        <Container maxWidth="7xl" className="h-full overflow-hidden">
          <GenreAddMobile categoryId={id} categoryName={decodeURIComponent(name)} />
        </Container>
      </div>
    </AuthGuard>
  );
}
