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
    title: isLocaleEnglish(locale) ? "Create Category" : "カテゴリ作成",
    description: isLocaleEnglish(locale) ? "Create Category" : "カテゴリ作成",
    keywords: isLocaleEnglish(locale) ? ["create category"] : ["カテゴリ作成"],
    type: "website",
    url: "/dashboard/categories/new",
  };

  return generateMeta(locale, metaOptions);
}

/**
 * Viewport設定を生成
 */
export const viewport = generateViewport();

/**
 * カテゴリ追加レイアウト
 * @param children - 子要素
 * @returns カテゴリ追加レイアウト
 */
export default function CategoryFormLayout({ children }: { children: React.ReactNode }) {
  return children;
}
