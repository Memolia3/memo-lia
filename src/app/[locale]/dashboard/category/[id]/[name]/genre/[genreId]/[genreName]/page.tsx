import { getCategoryById, getGenreById } from "@/actions/categories";
import { getUrlsByGenreAction } from "@/actions/urls";
import { auth } from "@/auth";
import { Container } from "@/components/ui";
import { AuthGuard } from "@/components/ui/AuthGuard";
import { getTranslations } from "next-intl/server";
import { GenreDetailDesktop } from "./GenreDetailDesktop";
import { GenreDetailMobile } from "./GenreDetailMobile";

interface GenreDetailPageProps {
  params: Promise<{
    locale: string;
    id: string;
    name: string;
    genreId: string;
    genreName: string;
  }>;
}

export default async function GenreDetailPage({ params }: GenreDetailPageProps) {
  const { locale, id, genreId } = await params;
  const t = await getTranslations({ locale, namespace: "genreDetail" });

  // セッションからユーザーIDを取得
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <AuthGuard isAuthenticated={false} isLoading={false}>
        <Container maxWidth="7xl" className="h-full">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {t("authRequired.title")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{t("authRequired.description")}</p>
            </div>
          </div>
        </Container>
      </AuthGuard>
    );
  }

  // カテゴリ情報とジャンル情報を取得
  const [category, genre] = await Promise.all([
    getCategoryById(id, userId),
    getGenreById(genreId, userId),
  ]);

  if (!category) {
    return (
      <AuthGuard isAuthenticated={true} isLoading={false}>
        <Container maxWidth="7xl" className="h-full">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {t("categoryNotFound.title")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t("categoryNotFound.description")}
              </p>
            </div>
          </div>
        </Container>
      </AuthGuard>
    );
  }

  if (!genre) {
    return (
      <AuthGuard isAuthenticated={true} isLoading={false}>
        <Container maxWidth="7xl" className="h-full">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {t("notFound.title")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{t("notFound.description")}</p>
            </div>
          </div>
        </Container>
      </AuthGuard>
    );
  }

  // URL一覧を取得（エラー時はクライアントサイドで再取得させるためにundefinedとする）
  let urls;
  try {
    urls = await getUrlsByGenreAction(genreId);
  } catch {
    // エラーハンドリングはクライアントサイドに任せる
    urls = undefined;
  }

  return (
    <AuthGuard isAuthenticated={true} isLoading={false}>
      {/* PC画面 */}
      <div className="hidden lg:block h-full">
        <Container maxWidth="7xl" className="h-full">
          <GenreDetailDesktop
            category={category}
            genreId={genreId}
            initialUrls={urls}
            locale={locale}
          />
        </Container>
      </div>
      {/* スマホ画面 */}
      <div className="block lg:hidden h-full">
        <Container maxWidth="7xl" className="h-full">
          <GenreDetailMobile
            category={category}
            genreId={genreId}
            initialUrls={urls}
            locale={locale}
          />
        </Container>
      </div>
    </AuthGuard>
  );
}
