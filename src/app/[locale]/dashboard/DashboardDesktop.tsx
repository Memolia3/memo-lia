"use client";

import { AppHeader } from "@/components/layout";
import { AuthGuard, ScrollArea, UserInfo } from "@/components/ui";
import { CategoryGrid } from "@/features/dashboard/components/CategoryGrid";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { cn, isShowAdsense } from "@/utils";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// AdSenseコンポーネントを遅延読み込み
const AdSense = dynamic(() => import("@/features/google").then(mod => ({ default: mod.AdSense })), {
  ssr: false,
  loading: () => <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />,
});

import type { CategoryData } from "@/actions/categories";

export interface DashboardDesktopProps {
  className?: string;
  initialCategories?: CategoryData[];
}

/**
 * ダッシュボードデスクトップ版コンポーネント
 * PC画面用のレイアウト
 */
export const DashboardDesktop: React.FC<DashboardDesktopProps> = ({
  className,
  initialCategories,
}) => {
  const { isAuthenticated, isLoading, handleCategoryClick } = useDashboard();
  const t = useTranslations("dashboard");

  return (
    <AuthGuard
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      error={null}
      className={className}
    >
      <div className={cn("h-full flex flex-col overflow-visible zoom-safe", className)}>
        <AppHeader title={t("title")} userInfo={<UserInfo />} />
        <div className="flex-1 flex flex-col overflow-hidden zoom-container">
          <div className="max-w-7xl mx-auto w-full flex flex-col h-full zoom-safe">
            {/* カテゴリ一覧（カード内スクロール） */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col flex-1 min-h-0 zoom-safe mt-2 sm:mt-3">
              {/* スクロール可能エリア（タイトル無し） */}
              <ScrollArea className="flex-1 px-4 sm:px-6 py-4 sm:py-6 zoom-safe">
                <div className="p-1.5 zoom-container">
                  <CategoryGrid
                    categories={initialCategories}
                    onCategoryClick={handleCategoryClick}
                  />
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* AdSense広告 - 画面の一番下 */}
        {isShowAdsense && (
          <div className="px-4 py-4 sm:px-6 sm:py-6 border-t border-gray-200 dark:border-gray-700 zoom-container">
            <Suspense
              fallback={
                <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
              }
            >
              <AdSense
                adSlot="1234567890"
                adFormat="fluid"
                responsive={true}
                className="w-full zoom-safe"
              />
            </Suspense>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};
