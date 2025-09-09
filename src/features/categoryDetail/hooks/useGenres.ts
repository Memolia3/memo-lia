"use client";

import { getGenresByCategory } from "@/actions/categories";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { GenreData } from "../types";

export const useGenres = (categoryId: string, userId: string) => {
  const t = useTranslations("categoryDetail");
  const [genres, setGenres] = useState<GenreData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGenres = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 実際のAPI呼び出し
      const genresData = await getGenresByCategory(categoryId, userId);
      setGenres(genresData);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error fetching genres:", err);
      setError(err instanceof Error ? err : new Error(t("genres.fetchError")));
      setGenres([]); // エラー時は空配列
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, userId, t]);

  const handleGenreDelete = useCallback((genreId: string) => {
    setGenres(prev => prev.filter(genre => genre.id !== genreId));
  }, []);

  useEffect(() => {
    if (categoryId && userId) {
      fetchGenres();
    }
  }, [fetchGenres, categoryId, userId]);

  // ジャンル追加後のリフレッシュ用
  const addGenre = useCallback((newGenre: GenreData) => {
    setGenres(prev => [...prev, newGenre]);
  }, []);

  return {
    genres,
    isLoading,
    error,
    handleGenreDelete,
    addGenre,
    refetch: fetchGenres,
  };
};
