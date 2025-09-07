"use client";

import { useCallback, useEffect, useState } from "react";
import { GenreData } from "../types";

export const useGenres = (categoryId: string, userId: string) => {
  const [genres, setGenres] = useState<GenreData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGenres = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: 実際のAPI呼び出しに置き換え
      // const genresData = await getGenresByCategory(categoryId, userId);

      // モックデータ
      const mockGenres: GenreData[] = [];
      setGenres(mockGenres);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("ジャンルの取得に失敗しました"));
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, userId]);

  const handleGenreDelete = useCallback((genreId: string) => {
    setGenres(prev => prev.filter(genre => genre.id !== genreId));
  }, []);

  useEffect(() => {
    if (categoryId && userId) {
      fetchGenres();
    }
  }, [fetchGenres, categoryId, userId]);

  return {
    genres,
    isLoading,
    error,
    handleGenreDelete,
    refetch: fetchGenres,
  };
};
