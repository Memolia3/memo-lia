/**
 * ページ固有のメタデータ設定
 */
export interface PageMetaOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  other?: Record<string, string>;
}
