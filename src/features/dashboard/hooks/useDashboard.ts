"use client";

import type { CategoryData } from "@/actions/categories";
import { useSession } from "@/features/auth/hooks";
import { useNotificationHelpers } from "@/hooks/useNotificationHelpers";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useCategories } from "./useCategories";

/**
 * ダッシュボード用のフック
 */
export const useDashboard = () => {
  const { session, isAuthenticated, isLoading } = useSession();
  const router = useRouter();
  const { showError } = useNotificationHelpers();

  const userId = session?.user?.id;
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories(userId || "");

  const handleCategoryClick = useCallback(
    (category: CategoryData) => {
      try {
        // カテゴリクリック時の処理（ジャンル表示画面への遷移）
        router.push(`/dashboard/category/${category.id}`);
      } catch (error) {
        // ナビゲーションエラーの通知
        showError({
          type: "error",
          message: "ページの遷移に失敗しました",
          description: "しばらく時間をおいてから再度お試しください",
          error: error instanceof Error ? error : new Error("ナビゲーションエラー"),
          category: "client",
          showStackTrace: false,
        });
      }
    },
    [router, showError]
  );

  return {
    user: session?.user,
    isAuthenticated,
    isLoading: isLoading || categoriesLoading,
    categories,
    error: categoriesError,
    handleCategoryClick,
  };
};
