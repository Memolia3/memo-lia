import { Background } from "@/components/ui";
import { generateViewport } from "@/utils/meta";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("metadata");

  return {
    title: t("genreAdd.title"),
    description: t("genreAdd.description"),
  };
}

/**
 * Viewport設定を生成
 */
export const viewport = generateViewport();

export default function GenreAddLayout({ children }: { children: React.ReactNode }) {
  return <Background>{children}</Background>;
}
