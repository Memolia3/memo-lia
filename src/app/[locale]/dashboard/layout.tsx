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
    title: isLocaleEnglish(locale) ? "Dashboard" : "ダッシュボード",
    description: isLocaleEnglish(locale) ? "Dashboard" : "ダッシュボード",
    keywords: isLocaleEnglish(locale) ? ["dashboard"] : ["ダッシュボード"],
    type: "website",
    url: "/dashboard",
  };

  return generateMeta(locale, metaOptions);
}

/**
 * Viewport設定を生成
 */
export const viewport = generateViewport();

/**
 * ダッシュボードレイアウト
 * @param children - 子要素
 * @returns ダッシュボードレイアウト
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
