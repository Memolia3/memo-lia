"use client";

import { createCategory } from "@/actions/categories";
import { AppHeader } from "@/components/layout";
import { useNotification } from "@/components/notification/NotificationProvider";
import { ScrollArea, UserInfo } from "@/components/ui";
import { getNotificationMessage, NOTIFICATION_MESSAGES } from "@/constants/notification";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import { AdSense } from "@/features/google";
import { cn, isShowAdsense } from "@/utils";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface CategoryAddMobileProps {
  className?: string;
}

/**
 * カテゴリ追加モバイル版コンポーネント
 * スマートフォン画面用のレイアウト
 */
export const CategoryAddMobile: React.FC<CategoryAddMobileProps> = ({ className }) => {
  const { data: session, status: sessionStatus } = useSession();
  const { addNotification } = useNotification();
  const router = useRouter();
  const t = useTranslations("categoryForm");
  const tErrors = useTranslations("errors");
  const [isLoading, setIsLoading] = useState(false);

  // ブラウザの言語設定から言語を取得
  const getCurrentLocale = () => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const localeMatch = pathname.match(/^\/([a-z]{2})\//);
      return localeMatch ? localeMatch[1] : "ja";
    }
    return "ja";
  };

  const handleCreateCategory = async (data: Parameters<typeof createCategory>[1]) => {
    // セッションがまだ読み込み中の場合は待機
    if (sessionStatus === "loading") {
      return;
    }

    if (!session?.user?.id) {
      // セッション読み込み完了後もユーザーIDがない場合はエラー
      addNotification({
        type: "error",
        message: tErrors("authInfoNotRetrieved"),
        description: tErrors("pleaseRefreshPage"),
        duration: 5000,
        severity: "high",
      });
      return;
    }

    setIsLoading(true);
    try {
      await createCategory(session.user.id, data);

      // 成功通知を表示
      const currentLocale = getCurrentLocale();
      addNotification({
        type: "success",
        message: getNotificationMessage(
          { ja: `「${data.name}」を作成しました`, en: `Created "${data.name}"` },
          currentLocale
        ),
        description: getNotificationMessage(
          NOTIFICATION_MESSAGES.SUCCESS.CATEGORY_CREATE_DESCRIPTION,
          currentLocale
        ),
        duration: 3000,
        severity: "medium",
      });

      // ダッシュボードにリダイレクト
      router.push("/dashboard");
    } catch {
      // エラー通知を表示
      const currentLocale = getCurrentLocale();
      addNotification({
        type: "error",
        message: getNotificationMessage(
          NOTIFICATION_MESSAGES.SUCCESS.CATEGORY_CREATE_ERROR,
          currentLocale
        ),
        description: getNotificationMessage(
          NOTIFICATION_MESSAGES.SUCCESS.CATEGORY_CREATE_ERROR_DESCRIPTION,
          currentLocale
        ),
        duration: 5000,
        severity: "high",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <AppHeader title={t("title")} userInfo={<UserInfo />} />

      <ScrollArea className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex items-center min-h-full">
          <CategoryForm
            onSubmit={handleCreateCategory}
            isLoading={isLoading || sessionStatus === "loading"}
            className="w-full"
          />
        </div>
      </ScrollArea>

      {/* AdSense広告 - 画面の一番下 */}
      {isShowAdsense && (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <AdSense adSlot="1234567890" adFormat="fluid" responsive={true} className="w-full" />
        </div>
      )}
    </div>
  );
};
