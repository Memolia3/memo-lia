"use client";

import { getGenreById } from "@/actions/categories";
import { deleteUrlAction, getUrlsByGenreAction } from "@/actions/urls";
import { UrlData } from "@/features/genreDetail";
import { useNotificationHelpers } from "@/hooks/useNotificationHelpers";
import { Genre } from "@/types/database";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UseGenreDetailReturn {
  genre: Genre | null;
  urls: UrlData[];
  isLoading: boolean;
  error: Error | null;
  handleBackToCategory: () => void;
  handleUrlClick: (url: UrlData) => void;
  handleUrlDelete: (urlId: string) => Promise<void>;
  handleCreateUrl: () => void;
}

export const useGenreDetail = (
  categoryId: string,
  genreId: string,
  userId: string
): UseGenreDetailReturn => {
  const router = useRouter();
  const { showSuccess, showError } = useNotificationHelpers();
  const t = useTranslations("genreDetail.urls");
  const [genre, setGenre] = useState<Genre | null>(null);
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const genreData = await getGenreById(genreId, userId);

        if (!genreData) {
          setError(new Error("Genre not found"));
          return;
        }

        setGenre(genreData);

        // URL一覧の取得
        const urlData = await getUrlsByGenreAction(genreId);
        setUrls(urlData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch genre"));
      } finally {
        setIsLoading(false);
      }
    };

    if (genreId && userId) {
      fetchGenre();
    }
  }, [genreId, userId]);

  const handleBackToCategory = () => {
    // カテゴリ詳細ページに戻る
    const currentLocale =
      typeof window !== "undefined"
        ? window.location.pathname.match(/^\/([a-z]{2})\//)?.[1] || "ja"
        : "ja";

    // URLからカテゴリ名を取得
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
    const categoryMatch = currentPath.match(/\/dashboard\/category\/[^\/]+\/([^\/]+)/);
    const currentCategoryName = categoryMatch ? categoryMatch[1] : "";

    if (currentCategoryName) {
      router.push(`/${currentLocale}/dashboard/category/${categoryId}/${currentCategoryName}`);
    }
  };

  const handleUrlClick = (url: UrlData) => {
    // URLを新しいタブで開く
    window.open(url.url, "_blank", "noopener,noreferrer");
  };

  const handleUrlDelete = async (urlId: string) => {
    try {
      // Server ActionでURLを削除
      await deleteUrlAction(urlId);

      // ローカル状態からも削除
      setUrls(prevUrls => prevUrls.filter(url => url.id !== urlId));

      // 成功通知
      showSuccess({
        type: "success",
        category: "delete",
        title: t("notifications.deleteSuccess"),
        message: t("notifications.deleteSuccessMessage"),
      });
    } catch (error) {
      // エラー通知
      showError({
        type: "error",
        category: "server",
        title: t("notifications.deleteError"),
        message: error instanceof Error ? error.message : t("notifications.deleteErrorMessage"),
      });
    }
  };

  const handleCreateUrl = () => {
    // URL作成ページに遷移
    const currentPath = window.location.pathname;
    const localeMatch = currentPath.match(/^\/([^\/]+)/);
    const currentLocale = localeMatch ? localeMatch[1] : "ja";

    // URLパスからカテゴリ名とジャンル名を取得
    const categoryMatch = currentPath.match(/\/dashboard\/category\/[^\/]+\/([^\/]+)/);
    const genreMatch = currentPath.match(/\/genre\/[^\/]+\/([^\/]+)$/);
    const currentCategoryName = categoryMatch ? decodeURIComponent(categoryMatch[1]) : "";
    const currentGenreName = genreMatch ? decodeURIComponent(genreMatch[1]) : "";

    if (currentCategoryName && currentGenreName) {
      const encodedCategoryName = encodeURIComponent(currentCategoryName);
      const encodedGenreName = encodeURIComponent(currentGenreName);
      const basePath = `/${currentLocale}/dashboard/category/${categoryId}/${encodedCategoryName}`;
      const urlPath = `${basePath}/genre/${genreId}/${encodedGenreName}/urls/new`;
      router.push(urlPath);
    }
  };

  return {
    genre,
    urls,
    isLoading,
    error,
    handleBackToCategory,
    handleUrlClick,
    handleUrlDelete,
    handleCreateUrl,
  };
};
