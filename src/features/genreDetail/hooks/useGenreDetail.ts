"use client";

import { getGenreById } from "@/actions/categories";
import { deleteUrlAction, getUrlsByGenreAction } from "@/actions/urls";
import { UrlData } from "@/features/genreDetail";
import { useNotificationHelpers } from "@/hooks/useNotificationHelpers";
import { Genre } from "@/types/database";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface UseGenreDetailReturn {
  genre: Genre | null;
  urls: UrlData[];
  isLoading: boolean;
  urlsLoading: boolean;
  error: Error | null;
  handleBackToCategory: () => void;
  handleUrlClick: (url: UrlData) => void;
  handleUrlDelete: (urlId: string) => Promise<void>;
  handleCreateUrl: () => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export const useGenreDetail = (
  categoryId: string,
  genreId: string,
  userId: string,
  options: { initialUrls?: UrlData[] } = {}
): UseGenreDetailReturn => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotificationHelpers();
  const t = useTranslations("genreDetail.urls");
  const { initialUrls } = options;

  const [genre, setGenre] = useState<Genre | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isQueryLoading,
    error: queryError,
  } = useInfiniteQuery({
    queryKey: ["urls", genreId],
    queryFn: ({ pageParam = 1 }) => getUrlsByGenreAction(genreId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length + 1 : undefined;
    },
    initialData: initialUrls
      ? {
          pages: [initialUrls],
          pageParams: [1],
        }
      : undefined,
    enabled: !!genreId,
  });

  const urls = data ? data.pages.flatMap(page => page) : [];
  const urlsLoading = isQueryLoading;

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

  const handleBackToCategory = useCallback(() => {
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
  }, [router, categoryId]);

  const handleUrlClick = useCallback((url: UrlData) => {
    // URLを新しいタブで開く
    window.open(url.url, "_blank", "noopener,noreferrer");
  }, []);

  const handleUrlDelete = async (urlId: string) => {
    try {
      // Server ActionでURLを削除
      await deleteUrlAction(urlId);

      // キャッシュを無効化して再取得（または手動でキャッシュ更新）
      // ここではシンプルにinvalidateQueriesを使用
      queryClient.invalidateQueries({ queryKey: ["urls", genreId] });

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
    urlsLoading,
    error: error || (queryError as Error),
    handleBackToCategory,
    handleUrlClick,
    handleUrlDelete,
    handleCreateUrl,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
