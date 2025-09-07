import { getCategoryById } from "@/actions/categories";
import { auth } from "@/auth";
import { Container } from "@/components/ui";
import { AuthGuard } from "@/components/ui/AuthGuard";
import { CategoryDetailDesktop, CategoryDetailMobile } from "@/features/categoryDetail";
import { getTranslations } from "next-intl/server";

interface CategoryDetailPageProps {
  params: Promise<{
    locale: string;
    id: string;
    name: string;
  }>;
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
        <Container padding="md" maxWidth="7xl" className="h-full">
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

  // カテゴリ情報を取得
  const category = await getCategoryById(id, userId);

  if (!category) {
    return (
      <AuthGuard isAuthenticated={true} isLoading={false}>
        <Container padding="md" maxWidth="7xl" className="h-full">
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

  return (
    <AuthGuard isAuthenticated={true} isLoading={false}>
      <Container padding="md" maxWidth="7xl" className="h-full">
        {/* PC画面 */}
        <div className="hidden lg:block h-full">
          <CategoryDetailDesktop category={category} locale={locale} />
        </div>
        {/* スマホ画面 */}
        <div className="block lg:hidden h-full">
          <CategoryDetailMobile category={category} locale={locale} />
        </div>
      </Container>
    </AuthGuard>
  );
}
