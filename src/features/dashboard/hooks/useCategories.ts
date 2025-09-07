"use client";

import type { CategoryData } from "@/actions/categories";
import { getCategories } from "@/actions/categories";
import { useNotificationHelpers } from "@/hooks/useNotificationHelpers";
import { useEffect, useState } from "react";

/**
 * カテゴリ一覧を取得するフック
 */
export const useCategories = (userId: string) => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showError } = useNotificationHelpers();

  useEffect(() => {
    if (!userId) return;

    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCategories(userId);
        setCategories(data);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error("カテゴリの取得に失敗しました");
        setError(errorObj);

        // エラー通知を表示
        showError({
          type: "error",
          message: "カテゴリの読み込みに失敗しました",
          description: "しばらく時間をおいてから再度お試しください",
          error: errorObj,
          category: "network",
          showStackTrace: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [userId, showError]);

  return {
    data: categories,
    isLoading,
    error,
  };
};
