"use client";

import { AppHeader } from "@/components/layout";
import { AuthGuard, UserInfo } from "@/components/ui";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { cn, isShowAdsense } from "@/utils";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Suspense } from "react";
// DashboardContentを遅延読み込み
const DashboardContent = dynamic(
  () =>
    import("@/features/dashboard/components/DashboardContent").then(mod => ({
      default: mod.DashboardContent,
    })),
  {
    ssr: true,
    loading: () => (
      <div className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Skeleton for DashboardActions */}
          <div className="flex justify-center">
            <div className="loading-skeleton w-32 h-10 rounded-lg" />
          </div>
          {/* Skeleton for CategoryGrid */}
          <div
            className="grid gap-6 justify-items-center"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))" }}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <div key={`skeleton-${i}`} className="loading-skeleton w-24 h-24 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    ),
  }
);

// AdSenseコンポーネントを遅延読み込み
const AdSense = dynamic(() => import("@/features/google").then(mod => ({ default: mod.AdSense })), {
  ssr: false,
  loading: () => <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />,
});

export interface DashboardDesktopProps {
  className?: string;
}

/**
 * ダッシュボードデスクトップ版コンポーネント
 * PC画面用のレイアウト
 */
export const DashboardDesktop: React.FC<DashboardDesktopProps> = ({ className }) => {
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
            <Suspense
              fallback={
                <div className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
                  <div className="max-w-7xl mx-auto space-y-6">
                    {/* Skeleton for DashboardActions */}
                    <div className="flex justify-center">
                      <div className="loading-skeleton w-32 h-10 rounded-lg" />
                    </div>
                    {/* Skeleton for CategoryGrid */}
                    <div
                      className="grid gap-6 justify-items-center"
                      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))" }}
                    >
                      {Array.from({ length: 6 }, (_, i) => (
                        <div
                          key={`skeleton-suspense-${i}`}
                          className="loading-skeleton w-24 h-24 rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              }
            >
              <DashboardContent onCategoryClick={handleCategoryClick} />
            </Suspense>
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
