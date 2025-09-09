/**
 * ページタイトル取得ユーティリティ
 */

interface PageInfo {
  title: {
    ja: string;
    en: string;
  };
  route: string;
}

/**
 * パス別のページ情報マップ
 */
const PAGE_INFO_MAP: Record<string, PageInfo> = {
  "/": {
    title: { ja: "MemoLia", en: "MemoLia" },
    route: "/",
  },
  "/auth": {
    title: { ja: "認証", en: "Authentication" },
    route: "/auth",
  },
  "/dashboard": {
    title: { ja: "ダッシュボード", en: "Dashboard" },
    route: "/dashboard",
  },
  "/dashboard/categories/new": {
    title: { ja: "カテゴリ作成", en: "Create Category" },
    route: "/dashboard/categories/new",
  },
  // 動的ルート用の正規表現パターン
  "category-detail": {
    title: { ja: "カテゴリ詳細", en: "Category Detail" },
    route: "/dashboard/category/[id]/[name]",
  },
  "genre-create": {
    title: { ja: "ジャンル作成", en: "Create Genre" },
    route: "/dashboard/category/[id]/[name]/genres/new",
  },
  "url-create": {
    title: { ja: "URL作成", en: "Create URL" },
    route: "/dashboard/category/[id]/[name]/genre/[genreId]/[genreName]/urls/new",
  },
};

/**
 * 現在のパスからページ情報を取得
 */
export const getCurrentPageInfo = (pathname: string): PageInfo | null => {
  // 完全一致でチェック
  if (PAGE_INFO_MAP[pathname]) {
    return PAGE_INFO_MAP[pathname];
  }

  // 動的ルートのパターンマッチング
  if (pathname.includes("/dashboard/category/") && pathname.includes("/urls/new")) {
    return PAGE_INFO_MAP["url-create"];
  }

  if (pathname.includes("/dashboard/category/") && pathname.includes("/genres/new")) {
    return PAGE_INFO_MAP["genre-create"];
  }

  if (pathname.includes("/dashboard/category/") && !pathname.includes("/genres/")) {
    return PAGE_INFO_MAP["category-detail"];
  }

  if (pathname.includes("/dashboard/categories/new")) {
    return PAGE_INFO_MAP["/dashboard/categories/new"];
  }

  if (pathname.includes("/dashboard")) {
    return PAGE_INFO_MAP["/dashboard"];
  }

  if (pathname.includes("/auth")) {
    return PAGE_INFO_MAP["/auth"];
  }

  // デフォルトはトップページ
  return PAGE_INFO_MAP["/"];
};

/**
 * 現在のページタイトルを取得
 */
export const getCurrentPageTitle = (locale: string = "ja"): string => {
  if (typeof window === "undefined") {
    return locale === "en" ? "Dashboard" : "ダッシュボード";
  }

  const pathname = window.location.pathname;
  // ロケール部分を除去（例: /ja/dashboard -> /dashboard）
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");

  const pageInfo = getCurrentPageInfo(pathWithoutLocale);
  return pageInfo
    ? pageInfo.title[locale as "ja" | "en"]
    : locale === "en"
      ? "Dashboard"
      : "ダッシュボード";
};

/**
 * 認証完了メッセージを動的に生成
 */
export const getDynamicAuthMessage = (locale: string = "ja"): { ja: string; en: string } => {
  const pageTitle = getCurrentPageTitle(locale);

  return {
    ja: `認証が完了して${pageTitle}に移動しました`,
    en: `Authentication completed and moved to ${getCurrentPageTitle("en")}`,
  };
};
