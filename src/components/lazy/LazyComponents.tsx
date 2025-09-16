"use client";

import dynamic from "next/dynamic";

// 重いコンポーネントを動的インポートで分割
export const LazyUrlForm = dynamic(
  () =>
    import("@/features/urls/components/UrlForm/UrlForm").then(mod => ({ default: mod.UrlForm })),
  {
    loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-64" />,
    ssr: false,
  }
);

export const LazyUrlPreview = dynamic(
  () => import("@/components/url/UrlPreview/UrlPreview").then(mod => ({ default: mod.UrlPreview })),
  {
    loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32" />,
    ssr: false,
  }
);

export const LazyCategoryGrid = dynamic(
  () =>
    import("@/features/dashboard/components/CategoryGrid/CategoryGrid").then(mod => ({
      default: mod.CategoryGrid,
    })),
  {
    loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32" />,
    ssr: false,
  }
);

export const LazyUrlGrid = dynamic(
  () =>
    import("@/features/genreDetail/components/UrlGrid/UrlGrid").then(mod => ({
      default: mod.UrlGrid,
    })),
  {
    loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32" />,
    ssr: false,
  }
);
