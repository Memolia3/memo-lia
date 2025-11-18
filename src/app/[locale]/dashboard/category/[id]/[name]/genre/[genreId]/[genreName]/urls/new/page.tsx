import { getCategoryById, getGenreById } from "@/actions/categories";
import { auth } from "@/auth";
import { Container } from "@/components/ui";
import { getCurrentPageInfo } from "@/utils";
import { generateMetadata as generateMeta, generateViewport, isLocaleEnglish } from "@/utils/meta";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound, redirect } from "next/navigation";

const UrlAddDesktop = dynamic(() => import("./UrlAddDesktop"));
const UrlAddMobile = dynamic(() => import("./UrlAddMobile"));

interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
    name: string;
    genreId: string;
    genreName: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const pageInfo = getCurrentPageInfo(
    "/dashboard/category/[id]/[name]/genre/[genreId]/[genreName]/urls/new"
  );

  const metaOptions = {
    title:
      pageInfo?.title?.[locale as "ja" | "en"] ||
      (isLocaleEnglish(locale) ? "Save URL" : "URL保存"),
    description: isLocaleEnglish(locale) ? "Save URL" : "URL保存",
    keywords: isLocaleEnglish(locale) ? ["save url"] : ["URL保存"],
    type: "website" as const,
    url: "/dashboard/category/[id]/[name]/genre/[genreId]/[genreName]/urls/new",
  };

  return generateMeta(locale, metaOptions);
}

/**
 * Viewport設定を生成
 */
export const viewport = generateViewport();

export default async function UrlAddPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const { locale, id, genreId } = await params;
  const userId = session.user.id;

  try {
    const [category, genre] = await Promise.all([
      getCategoryById(id, userId),
      getGenreById(genreId, userId),
    ]);

    if (!category) {
      notFound();
    }

    if (!genre) {
      notFound();
    }

    return (
      <>
        {/* デスクトップ版 */}
        <Container className="hidden lg:flex" padding="md">
          <UrlAddDesktop category={category} genre={genre} locale={locale} className="w-full" />
        </Container>

        {/* モバイル版 */}
        <Container className="flex lg:hidden">
          <UrlAddMobile category={category} genre={genre} locale={locale} className="w-full" />
        </Container>
      </>
    );
  } catch {
    notFound();
  }
}
