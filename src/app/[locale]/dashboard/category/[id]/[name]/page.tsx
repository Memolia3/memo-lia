import { getCategoryById } from "@/actions/categories";
import { auth } from "@/auth";
import { Container } from "@/components/ui";
import { AuthGuard } from "@/components/ui/AuthGuard";
import { getTranslations } from "next-intl/server";
import { CategoryDetailDesktop } from "./CategoryDetailDesktop";
import { CategoryDetailMobile } from "./CategoryDetailMobile";

import { Metadata } from "next";

interface CategoryDetailPageProps {
  params: Promise<{
    locale: string;
    id: string;
    name: string;
  }>;
}

export async function generateMetadata({ params }: CategoryDetailPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "categoryDetail" });
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      title: `${t("authRequired.title")} | MemoLia`,
    };
  }

  const category = await getCategoryById(id, userId);

  if (!category) {
    return {
      title: `${t("notFound.title")} | MemoLia`,
    };
  }

  return {
    title: `${category.name} | MemoLia`,
    description: `${category.name}のカテゴリに含まれるジャンルとURLを管理・整理できます。`,
    openGraph: {
      title: `${category.name} | MemoLia`,
      description: `${category.name}のカテゴリに含まれるジャンルとURLを管理・整理できます。`,
    },
  };
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "categoryDetail" });

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

  // 最適化: 単一クエリ + キャッシュでカテゴリとジャンルを取得
  let categoryDetailData;
  try {
    const { getCachedCategoryDetail } = await import("@/lib/db/category-detail-cached");
    categoryDetailData = await getCachedCategoryDetail(id, userId);
  } catch {
    categoryDetailData = null;
  }

  if (!categoryDetailData) {
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

  const { category, genres: initialGenres } = categoryDetailData;

  return (
    <AuthGuard isAuthenticated={true} isLoading={false}>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: category.name,
            description: `${category.name}のカテゴリ詳細ページです。`,
            url:
              `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/dashboard/category/` +
              `${category.id}/${category.name}`,
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
              ],
            },
          }),
        }}
      />
      <Container padding="md" maxWidth="7xl" className="h-full">
        {/* PC画面 */}
        <div className="hidden lg:block h-full">
          <CategoryDetailDesktop
            category={category}
            initialGenres={initialGenres}
            locale={locale}
          />
        </div>
        {/* スマホ画面 */}
        <div className="block lg:hidden h-full">
          <CategoryDetailMobile category={category} initialGenres={initialGenres} locale={locale} />
        </div>
      </Container>
    </AuthGuard>
  );
}
