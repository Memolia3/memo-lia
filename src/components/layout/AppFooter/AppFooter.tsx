"use client";

import { Typography } from "@/components/ui";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";

export interface AppFooterProps {
  className?: string;
}

/**
 * アプリケーション共通フッターコンポーネント
 * 利用規約・プライバシーポリシーへのリンクを小さく表示
 */
export const AppFooter: React.FC<AppFooterProps> = ({ className }) => {
  const t = useTranslations("footer");

  return (
    <footer
      className={cn(
        "flex items-center justify-center w-full",
        "px-4 py-3",
        "bg-white/5 dark:bg-gray-900/5",
        "backdrop-blur-sm border-t border-white/10 dark:border-gray-700/10",
        "min-h-[50px]",
        className
      )}
    >
      <div className="flex items-center space-x-4 text-center">
        <Typography variant="caption" color="muted">
          {t("copyright")}
        </Typography>
        <span className="text-gray-400 dark:text-gray-500">•</span>
        <Link
          href="/terms"
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          {t("terms")}
        </Link>
        <span className="text-gray-400 dark:text-gray-500">•</span>
        <Link
          href="/privacy"
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          {t("privacy")}
        </Link>
      </div>
    </footer>
  );
};
