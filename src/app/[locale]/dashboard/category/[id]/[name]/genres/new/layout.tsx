import { Background } from "@/components/ui";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("metadata");

  return {
    title: t("genreAdd.title"),
    description: t("genreAdd.description"),
  };
}

export default function GenreAddLayout({ children }: { children: React.ReactNode }) {
  return <Background>{children}</Background>;
}
