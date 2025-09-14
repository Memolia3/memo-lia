"use client";

import type { CategoryData } from "@/actions/categories";
import { useSession } from "@/features/auth/hooks";
import { useNotificationHelpers } from "@/hooks/useNotificationHelpers";
import { toUrlSafe } from "@/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCategories } from "./useCategories";

/**
 * ダッシュボード用のフック
 */
export const useDashboard = () => {
  const { session, isAuthenticated, isLoading } = useSession();
  const router = useRouter();
  const { showError } = useNotificationHelpers();
  const t = useTranslations("dashboard");

  const userId = session?.user?.id;
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories(userId || "");

  const [localCategories, setLocalCategories] = useState<CategoryData[]>(categories);

  // ローカルカテゴリを初期化
  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const handleCategoryDelete = useCallback((categoryId: string) => {
    setLocalCategories(prev => prev.filter(category => category.id !== categoryId));
  }, []);

  const handleCategoryClick = useCallback(
    (category: CategoryData) => {
      try {
        // カテゴリ名をURLセーフな形式に変換
        const urlSafeName = toUrlSafe(category.name);

        // カテゴリクリック時の処理（ジャンル表示画面への遷移）
        router.push(`/dashboard/category/${category.id}/${urlSafeName}`);
      } catch (error) {
        // ナビゲーションエラーの通知
        showError({
          type: "error",
          message: t("navigationFailed"),
          description: t("retryLater"),
          error: error instanceof Error ? error : new Error(t("navigationError")),
          category: "client",
          showStackTrace: false,
        });
      }
    },
    [router, showError, t]
  );

  return {
    user: session?.user,
    isAuthenticated,
    isLoading: isLoading || categoriesLoading,
    categories: localCategories,
    error: categoriesError,
    handleCategoryClick,
    handleCategoryDelete,
  };
};
