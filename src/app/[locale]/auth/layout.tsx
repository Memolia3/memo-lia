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
    title: isLocaleEnglish(locale) ? "Auth" : "認証",
    description: isLocaleEnglish(locale) ? "Authentication" : "認証",
    keywords: isLocaleEnglish(locale) ? ["authentication"] : ["認証"],
    type: "website",
    url: "/auth",
  };

  return generateMeta(locale, metaOptions);
}

/**
 * Viewport設定を生成
 */
export const viewport = generateViewport();

/**
 * 認証レイアウト
 * @param children - 子要素
 * @returns 認証レイアウト
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
