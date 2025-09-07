"use client";

import { AppHeader } from "@/components/layout";
import { AuthGuard, UserInfo } from "@/components/ui";
import { DashboardContent } from "@/features/dashboard/components/DashboardContent";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { AdSense } from "@/features/google";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";

export interface DashboardDesktopProps {
  className?: string;
}

/**
 * ダッシュボードデスクトップ版コンポーネント
 * PC画面用のレイアウト
 */
export const DashboardDesktop: React.FC<DashboardDesktopProps> = ({ className }) => {
  const {
    isAuthenticated,
    isLoading,
    categories,
    error,
    handleCategoryClick,
    handleCategoryDelete,
  } = useDashboard();
  const t = useTranslations("dashboard");

  return (
    <AuthGuard
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      error={error ? error.message : null}
      className={className}
    >
      <div className={cn("h-full flex flex-col overflow-visible", className)}>
        <AppHeader title={t("title")} userInfo={<UserInfo />} />
        <DashboardContent
          categories={categories}
          onCategoryClick={handleCategoryClick}
          onCategoryDelete={handleCategoryDelete}
        />

        {/* AdSense広告 - 画面の一番下 */}
        <div className="px-4 py-4 sm:px-6 sm:py-6 border-t border-gray-200 dark:border-gray-700">
          <AdSense adSlot="1234567890" adFormat="fluid" responsive={true} className="w-full" />
        </div>
      </div>
    </AuthGuard>
  );
};
