import { PageMetaOptions } from "@/types";
import { generateMetadata as generateMeta, generateViewport, isLocaleEnglish } from "@/utils/meta";
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
    title: isLocaleEnglish(locale) ? "Category Detail" : "カテゴリ詳細",
    description: isLocaleEnglish(locale) ? "Category Detail" : "カテゴリ詳細",
    keywords: isLocaleEnglish(locale) ? ["category detail"] : ["カテゴリ詳細"],
    type: "website",
    url: "/dashboard/category/[id]/[name]",
  };

  return generateMeta(locale, metaOptions);
}

/**
 * Viewport設定を生成
 */
export const viewport = generateViewport();

/**
 * カテゴリ詳細レイアウト
 * @param children - 子要素
 * @returns カテゴリ詳細レイアウト
 */
export default function CategoryDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
