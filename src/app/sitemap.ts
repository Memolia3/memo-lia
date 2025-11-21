import { MetadataRoute } from "next";

// 主要ルートのサイトマップを生成（ロケール対応）
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://memo-lia.memolia8.com";
  const locales = ["ja", "en"]; // 必要に応じて追加

  const staticPaths = [
    "/", // TOP
    "/auth",
    "/dashboard",
    "/share",
    "/bookmarklet",
    "/privacy",
    "/terms",
  ];

  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      // defaultLocale (en) の場合はプレフィックスなし、それ以外はプレフィックスあり
      const localePath = locale === "en" ? "" : `/${locale}`;
      const urlPath = path === "/" ? "" : path;

      // 優先度の設定
      let priority = 0.7;
      if (path === "/") {
        priority = 1.0;
      } else if (path === "/bookmarklet") {
        priority = 0.5;
      }

      entries.push({
        url: `${baseUrl}${localePath}${urlPath}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority,
      });
    }
  }

  return entries;
}
