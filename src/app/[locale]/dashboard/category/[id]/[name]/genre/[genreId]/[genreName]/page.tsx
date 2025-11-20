import { getCategoryById, getGenreById } from "@/actions/categories";
import { getUrlsByGenreAction } from "@/actions/urls";
import { auth } from "@/auth";
import { Container } from "@/components/ui";
import { AuthGuard } from "@/components/ui/AuthGuard";
import { getTranslations } from "next-intl/server";
import { GenreDetailDesktop } from "./GenreDetailDesktop";
import { GenreDetailMobile } from "./GenreDetailMobile";
import { GenreDetailProvider } from "./GenreDetailProvider";

import { Metadata } from "next";

interface GenreDetailPageProps {
  params: Promise<{
    locale: string;
    id: string;
    name: string;
    genreId: string;
    genreName: string;
  }>;
}

export async function generateMetadata({ params }: GenreDetailPageProps): Promise<Metadata> {
  const { locale, id, genreId } = await params;
  const t = await getTranslations({ locale, namespace: "genreDetail" });
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      title: {
        default: t("authRequired.title"),
        template: "%s | MemoLia",
      },
    };
  }

  const [category, genre] = await Promise.all([
    getCategoryById(id, userId),
    getGenreById(genreId, userId),
  ]);

  if (!category || !genre) {
    return {
      title: {
        default: t("notFound.title"),
        template: "%s | MemoLia",
      },
    };
  }

  return {
    title: {
      default: `${genre.name} | ${category.name}`,
      template: "%s | MemoLia",
    },
    description:
      `${category.name}カテゴリの${genre.name}ジャンルに保存されたURLを管理できます。`,
    openGraph: {
      title: `${genre.name} | ${category.name} | MemoLia`,
      description:
        `${category.name}カテゴリの${genre.name}ジャンルに保存されたURLを管理できます。`,
    },
  };
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
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: genre.name,
            description: `${category.name} > ${genre.name}のジャンル詳細ページです。`,
            url:
              `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/dashboard/category/` +
              `${category.id}/${category.name}/genre/${genre.id}/${genre.name}`,
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Dashboard",
                  item: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/dashboard`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: category.name,
                  item:
                    `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/dashboard/category/` +
                    `${category.id}/${category.name}`,
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: genre.name,
                  item:
                    `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/dashboard/category/` +
                    `${category.id}/${category.name}/genre/${genre.id}/${genre.name}`,
                },
              ],
            },
          }),
        }}
      />
      <GenreDetailProvider>
        <Container padding="md" maxWidth="7xl" className="h-full">
          {/* PC画面 */}
          <div className="hidden lg:block h-full">
            <GenreDetailDesktop
              category={category}
              genreId={genreId}
              initialUrls={urls}
              locale={locale}
            />
          </div>
          {/* スマホ画面 */}
          <div className="block lg:hidden h-full">
            <GenreDetailMobile
              category={category}
              genreId={genreId}
              initialUrls={urls}
              locale={locale}
            />
          </div>
        </Container>
      </GenreDetailProvider>
    </AuthGuard>
  );
}
