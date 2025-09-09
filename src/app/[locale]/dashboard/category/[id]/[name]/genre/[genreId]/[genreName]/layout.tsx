import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface GenreDetailLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
    genreName: string;
  }>;
}

export async function generateMetadata({ params }: GenreDetailLayoutProps): Promise<Metadata> {
  const { locale, genreName } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const decodedGenreName = decodeURIComponent(genreName);

  return {
    title: `${decodedGenreName} - ${t("genreDetail.title")}`,
    description: t("genreDetail.description", { genreName: decodedGenreName }),
  };
}

export default function GenreDetailLayout({ children }: GenreDetailLayoutProps) {
  return <>{children}</>;
}
