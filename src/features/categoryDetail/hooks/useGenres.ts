"use client";

import { getGenresByCategory } from "@/actions/categories";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GenreData } from "../types";

export const useGenres = (
  categoryId: string,
  userId: string,
  options: { initialData?: GenreData[] } = {}
) => {
  const t = useTranslations("categoryDetail");
  const { initialData } = options;
  const [genres, setGenres] = useState<GenreData[]>(initialData || []);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);

  // 翻訳メッセージをuseMemoで安定化
  const errorMessage = useMemo(() => t("genres.fetchError"), [t]);

  const fetchGenres = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 実際のAPI呼び出し
      const genresData = await getGenresByCategory(categoryId, userId);
      setGenres(genresData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(errorMessage));
      setGenres([]); // エラー時は空配列
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, userId, errorMessage]);

  const handleGenreDelete = useCallback((genreId: string) => {
    setGenres(prev => prev.filter(genre => genre.id !== genreId));
  }, []);

  useEffect(() => {
    if (categoryId && userId && !initialData) {
      fetchGenres();
    }
  }, [fetchGenres, categoryId, userId, initialData]);

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
