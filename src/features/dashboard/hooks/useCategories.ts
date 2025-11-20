"use client";

import type { CategoryData } from "@/actions/categories";
import { getCategories } from "@/actions/categories";
import { useNotificationHelpers } from "@/hooks/useNotificationHelpers";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

/**
 * カテゴリ一覧を取得するフック
 */
export const useCategories = (userId: string, options: { enabled?: boolean } = {}) => {
  const { enabled = true } = options;
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const { showError } = useNotificationHelpers();
  const t = useTranslations("dashboard");

  // 翻訳メッセージをuseMemoで安定化
  const errorMessages = useMemo(
    () => ({
      fetchFailed: t("categoryFetchFailed"),
      loadFailed: t("categoryLoadFailed"),
      retryLater: t("retryLater"),
    }),
    [t]
  );

  useEffect(() => {
    if (!userId || !enabled) {
      setIsLoading(false);
      return;
    }

    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCategories(userId);
        setCategories(data);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(errorMessages.fetchFailed);
        setError(errorObj);

        // エラー通知を表示
        showError({
          type: "error",
          message: errorMessages.loadFailed,
          description: errorMessages.retryLater,
          error: errorObj,
          category: "network",
          showStackTrace: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [userId, showError, errorMessages, enabled]);

  return {
    data: categories,
    isLoading,
    error,
  };
};
