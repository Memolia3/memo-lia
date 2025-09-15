"use client";

import { getGenresByCategory } from "@/actions/categories";
import { useNotificationHelpers } from "@/hooks/useNotificationHelpers";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

export interface GenreData {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export const useGenres = () => {
  const [genres, setGenres] = useState<GenreData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showError } = useNotificationHelpers();
  const t = useTranslations("share");

  const fetchGenres = useCallback(
    async (categoryId: string, userId: string) => {
      if (!categoryId || !userId) {
        setGenres([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await getGenresByCategory(categoryId, userId);
        setGenres(data);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(t("genreFetchFailed"));
        setError(errorObj);
        showError({
          type: "error",
          message: t("genreLoadFailed"),
          description: t("retryLater"),
          error: errorObj,
          category: "network",
          showStackTrace: false,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [showError, t]
  );

  return {
    genres,
    isLoading,
    error,
    fetchGenres,
  };
};
