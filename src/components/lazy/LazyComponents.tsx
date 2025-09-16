"use client";

import dynamic from "next/dynamic";

// 重いコンポーネントを動的インポートで分割
export const LazyUrlForm = dynamic(() => import("@/features/urls/components/UrlForm/UrlForm"), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-64" />,
  ssr: false,
});

export const LazyUrlPreview = dynamic(() => import("@/components/url/UrlPreview/UrlPreview"), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32" />,
  ssr: false,
});

export const LazyGenreDetail = dynamic(
  () => import("@/features/genreDetail/components/GenreDetail/GenreDetail"),
  {
    loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-96" />,
    ssr: false,
  }
);

export const LazyCategoryDetail = dynamic(
  () => import("@/features/categoryDetail/components/CategoryDetail/CategoryDetail"),
  {
    loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-96" />,
    ssr: false,
  }
);
