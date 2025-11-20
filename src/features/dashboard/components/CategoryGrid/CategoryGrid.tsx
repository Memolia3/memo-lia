"use client";

import type { CategoryData } from "@/actions/categories";
import { Loading } from "@/components/ui";
import { useSession } from "@/features/auth/hooks";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useCategories } from "../../hooks/useCategories";
import { CategoryFolder } from "../CategoryFolder";
import { DashboardActions } from "../DashboardActions";
import { CategoryGridProps } from "./CategoryGrid.types";

/**
 * カテゴリグリッドコンポーネント
 * カテゴリフォルダを横並び（レスポンシブ対応）で表示
 * データ読み込みも担当
 */
export const CategoryGrid: React.FC<CategoryGridProps> = memo(
  ({
    categories: propCategories,
    onCategoryClick: propOnCategoryClick,
    onCategoryDelete: propOnCategoryDelete,
    className,
  }) => {
    const t = useTranslations("dashboard.emptyState");
    const { session } = useSession();
    const userId = session?.user?.id || "";

    // セッションIDをメモ化して不要な再レンダリングを防ぐ
    const memoizedUserId = useMemo(() => userId, [userId]);

    // カテゴリデータの読み込み
    const {
      data: fetchedCategories = [],
      isLoading: categoriesLoading,
      error: categoriesError,
    } = useCategories(memoizedUserId, {
      enabled: propCategories === undefined,
    });

    // ローカル状態管理
    const [localCategories, setLocalCategories] = useState<CategoryData[]>(propCategories || []);
    const [isInitialized, setIsInitialized] = useState(!!propCategories);

    // プロパティまたはフェッチしたデータで初期化
    useEffect(() => {
      if (propCategories !== undefined) {
        setLocalCategories(propCategories);
        setIsInitialized(true);
      } else if (fetchedCategories.length > 0 || !categoriesLoading) {
        setLocalCategories(fetchedCategories);
        setIsInitialized(true);
      }
    }, [fetchedCategories, propCategories, categoriesLoading]);

    // 表示用データは常にローカル状態を使用
    const categories = localCategories;
    const isLoading = propCategories === undefined ? categoriesLoading : false;
    const error = propCategories === undefined ? categoriesError : null;

    // カテゴリ削除ハンドラー
    const handleCategoryDelete = useCallback(
      (categoryId: string) => {
        setLocalCategories(prev => prev.filter(category => category.id !== categoryId));
        // プロパティのハンドラーも呼び出し
        propOnCategoryDelete?.(categoryId);
      },
      [propOnCategoryDelete]
    );

    // カテゴリクリックハンドラー
    const handleCategoryClick = useCallback(
      (category: CategoryData) => {
        propOnCategoryClick?.(category);
      },
      [propOnCategoryClick]
    );

    // ローディング状態の表示
    if (isLoading) {
      return (
        <div className="space-y-6">
          <DashboardActions />

          {/* ローディング状態 */}
          <Loading
            size="lg"
            variant="spinner"
            text={t("loading")}
            description={t("loadingCategories")}
            className={className}
          />
        </div>
      );
    }

    // エラー状態の表示
    if (error) {
      return (
        <div className="space-y-6">
          <DashboardActions />

          {/* エラー状態 */}
          <div className={cn("text-center py-12", className)}>
            <div className="text-red-500 dark:text-red-400">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium mb-2">{t("error")}</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </div>
        </div>
      );
    }

    // 空の状態の表示（初期化完了後かつカテゴリが空の場合のみ）
    if (isInitialized && categories.length === 0 && !propCategories?.length) {
      return (
        <div className="space-y-6">
          <DashboardActions />

          {/* 空の状態 */}
          <div className={cn("text-center py-12", className)}>
            <div className="text-gray-500 dark:text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium mb-2">{t("title")}</p>
              <p className="text-sm">{t("description")}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <DashboardActions />

        {/* カテゴリグリッド */}
        <div
          className={cn("grid", "gap-6", "w-full", "justify-items-center", className)}
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "24px",
          }}
        >
          {categories.map(category => (
            <CategoryFolder
              key={category.id}
              category={category}
              onClick={handleCategoryClick}
              onDelete={handleCategoryDelete}
            />
          ))}
        </div>
      </div>
    );
  }
);

CategoryGrid.displayName = "CategoryGrid";
