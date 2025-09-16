"use client";

import type { CategoryData } from "@/actions/categories";
import { useSession } from "@/features/auth/hooks";
import { useNotificationHelpers } from "@/hooks/useNotificationHelpers";
import { toUrlSafe } from "@/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * ダッシュボード用のフック
 * 認証状態とナビゲーション機能のみを提供
 */
export const useDashboard = () => {
  const { session, isAuthenticated, isLoading } = useSession();
  const router = useRouter();
  const { showError } = useNotificationHelpers();
  const t = useTranslations("dashboard");

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
    isLoading,
    handleCategoryClick,
  };
};
