"use client";

import { Typography } from "@/components/ui";
import { cn } from "@/utils";
import type { AppHeaderProps } from "./types";

/**
 * アプリケーション共通ヘッダーコンポーネント
 * 左上にタイトル、右上にユーザー情報を表示
 */
export const AppHeader: React.FC<AppHeaderProps> = ({ title, userInfo, className }) => {
  return (
    <header
      className={cn(
        "flex items-center justify-between w-full",
        "px-4 py-4 sm:px-6 sm:py-6",
        "bg-white/5 dark:bg-gray-900/5",
        "backdrop-blur-sm border-b border-white/10 dark:border-gray-700/10",
        "min-h-[60px]",
        className
      )}
    >
      {/* 左側: タイトル */}
      <div className="flex items-center flex-shrink-0">
        <Typography variant="h1" weight="bold" className="text-2xl sm:text-3xl">
          {title}
        </Typography>
      </div>

      {/* 右側: ユーザー情報 */}
      <div className="flex items-center flex-shrink-0 ml-auto">{userInfo}</div>
    </header>
  );
};
