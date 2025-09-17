"use client";

import { createGenre } from "@/actions/categories";
import { AppHeader } from "@/components/layout";
import { useNotification } from "@/components/notification/NotificationProvider";
import { ScrollArea, UserInfo } from "@/components/ui";
import { getNotificationMessage, NOTIFICATION_MESSAGES } from "@/constants/notification";
import { GenreForm } from "@/features/genres";
import { AdSense } from "@/features/google";
import { cn, getErrorI18nKey, isShowAdsense } from "@/utils";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface GenreAddMobileProps {
  categoryId: string;
  categoryName: string;
  className?: string;
}

/**
 * ジャンル追加モバイル版コンポーネント
 * スマートフォン画面用のレイアウト
 */
export const GenreAddMobile: React.FC<GenreAddMobileProps> = ({
  categoryId,
  categoryName,
  className,
}) => {
  const { data: session } = useSession();
  const { addNotification } = useNotification();
  const router = useRouter();
  const t = useTranslations();
  const tGenre = useTranslations("genreForm");
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

  const handleCreateGenre = async (data: Parameters<typeof createGenre>[1]) => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      await createGenre(session.user.id, data);

      // 成功通知を表示
      const currentLocale = getCurrentLocale();
      addNotification({
        type: "success",
        message: getNotificationMessage(
          { ja: `「${data.name}」を作成しました`, en: `Created "${data.name}"` },
          currentLocale
        ),
        description: getNotificationMessage(
          NOTIFICATION_MESSAGES.SUCCESS.GENRE_CREATE_DESCRIPTION,
          currentLocale
        ),
        duration: 3000,
        severity: "medium",
      });

      // カテゴリ詳細ページにリダイレクト
      const urlSafeName = encodeURIComponent(categoryName);
      router.push(`/dashboard/category/${categoryId}/${urlSafeName}`);
    } catch (error) {
      // エラー通知を表示
      const errorI18nKey = getErrorI18nKey(error);
      addNotification({
        type: "error",
        message: t("categoryDetail.genres.errors.createFailed"),
        description: t(errorI18nKey),
        duration: 5000,
        severity: "high",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <AppHeader title={tGenre("title")} userInfo={<UserInfo />} />

      <ScrollArea className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex items-center min-h-full">
          <GenreForm
            categoryId={categoryId}
            onSubmit={handleCreateGenre}
            isLoading={isLoading}
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

export default GenreAddMobile;
