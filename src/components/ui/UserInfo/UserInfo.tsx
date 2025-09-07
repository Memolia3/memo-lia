"use client";

import { Typography } from "@/components/ui";
import { useSession } from "@/features/auth/hooks";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import NextImage from "next/image";

import type { UserInfoProps } from "@/types/ui";

/**
 * ユーザー情報表示コンポーネント
 * 右上にユーザーのアイコンと名前を表示
 */
export const UserInfo: React.FC<UserInfoProps> = ({ className }) => {
  const { session, isAuthenticated, isLoading } = useSession();
  const t = useTranslations("dashboard.userInfo");

  // ローディング状態
  if (isLoading) {
    return (
      <div className={cn("flex items-center space-x-3", className)}>
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="w-24 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  // セッションがない場合
  if (!isAuthenticated || !session) {
    return (
      <div className={cn("flex items-center space-x-3", className)}>
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Typography variant="body" weight="bold" className="text-gray-500">
            ?
          </Typography>
        </div>
        <div className="text-left">
          <Typography variant="body" weight="semibold" className="text-gray-500">
            {t("unauthenticated")}
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div className="flex items-center space-x-3">
        {session?.user?.image ? (
          <NextImage
            src={session.user.image}
            alt={session.user.name || "User Avatar"}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <Typography variant="body" weight="bold" className="text-primary">
              {session?.user?.name?.charAt(0) || "U"}
            </Typography>
          </div>
        )}
        <div className="text-left">
          <Typography variant="body" weight="semibold" color="primary">
            {session?.user?.name || session?.user?.email || t("user")}
          </Typography>
        </div>
      </div>
    </div>
  );
};
