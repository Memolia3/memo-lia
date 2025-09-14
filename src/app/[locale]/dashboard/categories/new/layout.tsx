import { PageMetaOptions } from "@/types";
import { generateMetadata as generateMeta, isLocaleEnglish } from "@/utils/meta";
import { Metadata } from "next";

/**
 * 動的メタデータ生成関数
 * @param params - パラメータ
 * @returns メタデータ
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const metaOptions: PageMetaOptions = {
    title: isLocaleEnglish(locale) ? "Add Category" : "カテゴリ追加",
    description: isLocaleEnglish(locale) ? "Add Category" : "カテゴリ追加",
    keywords: isLocaleEnglish(locale) ? ["add category"] : ["カテゴリ追加"],
    type: "website",
    url: "/dashboard/categories/new",
  };

  return generateMeta(locale, metaOptions);
}

/**
 * カテゴリ追加レイアウト
 * @param children - 子要素
 * @returns カテゴリ追加レイアウト
 */
export default function CategoryFormLayout({ children }: { children: React.ReactNode }) {
  return children;
}
