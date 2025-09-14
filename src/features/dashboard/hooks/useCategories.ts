"use client";

import type { CategoryData } from "@/actions/categories";
import { getCategories } from "@/actions/categories";
import { useNotificationHelpers } from "@/hooks/useNotificationHelpers";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/**
 * カテゴリ一覧を取得するフック
 */
export const useCategories = (userId: string) => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showError } = useNotificationHelpers();
  const t = useTranslations("dashboard");

  useEffect(() => {
    if (!userId) return;

    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCategories(userId);
        setCategories(data);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(t("categoryFetchFailed"));
        setError(errorObj);

        // エラー通知を表示
        showError({
          type: "error",
          message: t("categoryLoadFailed"),
          description: t("retryLater"),
          error: errorObj,
          category: "network",
          showStackTrace: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [userId, showError, t]);

  return {
    data: categories,
    isLoading,
    error,
  };
};
