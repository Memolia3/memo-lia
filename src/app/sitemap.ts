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
      entries.push({
        url: `${baseUrl}/${locale}${path === "/" ? "" : path}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: path === "/" ? 1 : 0.7,
      });
    }
  }

  return entries;
}
