"use client";

import { AppHeader } from "@/components/layout";
import { AuthGuard, Loading, UserInfo } from "@/components/ui";
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
      <div className="flex-1 flex items-center justify-center">
        <Loading size="md" variant="spinner" showBackground={false} />
      </div>
    ),
  }
);

// AdSenseコンポーネントを遅延読み込み
const AdSense = dynamic(() => import("@/features/google").then(mod => ({ default: mod.AdSense })), {
  ssr: false,
  loading: () => <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />,
});

import { useDashboard } from "@/features/dashboard/hooks/useDashboard";

export interface DashboardMobileProps {
  className?: string;
}

/**
 * ダッシュボードモバイル版コンポーネント
 * スマホ画面用のレイアウト
 */
export const DashboardMobile: React.FC<DashboardMobileProps> = ({ className }) => {
  const { isAuthenticated, isLoading, handleCategoryClick } = useDashboard();
  const t = useTranslations("dashboard");

  return (
    <AuthGuard
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      error={null}
      className={className}
    >
      <div className={cn("h-full flex flex-col", className)}>
        <AppHeader title={t("title")} userInfo={<UserInfo />} />
        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center">
              <Loading size="md" variant="spinner" showBackground={false} />
            </div>
          }
        >
          <DashboardContent onCategoryClick={handleCategoryClick} />
        </Suspense>

        {/* AdSense広告 - 画面の一番下 */}
        {isShowAdsense && (
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <Suspense
              fallback={
                <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
              }
            >
              <AdSense adSlot="1234567890" adFormat="fluid" responsive={true} className="w-full" />
            </Suspense>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};
