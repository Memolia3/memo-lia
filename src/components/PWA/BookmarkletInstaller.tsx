"use client";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Typography } from "@/components/ui/Typography";
import { ArrowLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BookmarkletInstallerProps {
  className?: string;
}

export const BookmarkletInstaller: React.FC<BookmarkletInstallerProps> = ({ className }) => {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("bookmarklet");
  const locale = useLocale();
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push(`/${locale}/dashboard`);
  };

  const bookmarklet = `javascript:(function(){
  const title = encodeURIComponent(document.title);
  const url = encodeURIComponent(location.href);
  const baseUrl = "${process.env.NEXT_PUBLIC_APP_URL || ""}";
  const currentHost = window.location.hostname;

  // 現在のドメインがMemoLiaのドメインの場合、同じドメインを使用
  let targetUrl = baseUrl;
  if (currentHost.includes('memo-lia') || currentHost.includes('localhost')) {
    targetUrl = window.location.protocol + '//' + currentHost;
  }

  window.location.href = targetUrl + "/share?title="+title+"&url="+url;
})();`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bookmarklet);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // コピーに失敗した場合は何もしない
    }
  };

  return (
    <div
      className={`p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl
        bg-white/10 dark:bg-gray-900/10 backdrop-blur-md
        border border-white/20 dark:border-gray-700/20
        max-h-screen overflow-y-auto ${className}`}
    >
      {/* ヘッダーセクション */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        {/* Safari用 */}
        <div className="flex items-center gap-2">
          <Icon name="star" size="sm" color="accent" className="drop-shadow-sm" />
          <Typography variant="body" className="text-sm sm:text-base text-accent font-medium">
            {t("title")}
          </Typography>
        </div>

        {/* ダッシュボードに戻るボタン */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackToDashboard}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToDashboard")}
        </Button>
      </div>

      <div className="text-center mb-4 sm:mb-6">
        <Typography variant="body" color="muted" className="mb-4 text-sm sm:text-base text-center">
          {t("description")}
        </Typography>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="bg-white/5 dark:bg-gray-800/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 dark:border-gray-700/10">
          <Typography
            variant="label"
            className="mb-2 sm:mb-3 block text-accent text-sm sm:text-base"
          >
            {t("step1")}
          </Typography>
          <Typography variant="body" className="text-xs sm:text-sm leading-relaxed">
            {t("step1Description")}
          </Typography>
        </div>

        <div className="bg-white/5 dark:bg-gray-800/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 dark:border-gray-700/10">
          <Typography
            variant="label"
            className="mb-2 sm:mb-3 block text-accent text-sm sm:text-base"
          >
            {t("step2")}
          </Typography>
          <Typography variant="body" className="text-xs sm:text-sm leading-relaxed">
            {t("step2Description")}
          </Typography>
        </div>

        <div className="bg-white/5 dark:bg-gray-800/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 dark:border-gray-700/10">
          <Typography
            variant="label"
            className="mb-2 sm:mb-3 block text-accent text-sm sm:text-base"
          >
            {t("step3")}
          </Typography>
          <Typography variant="body" className="text-xs sm:text-sm leading-relaxed">
            {t("step3Description")}
          </Typography>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 text-center">
        <Button
          onClick={handleCopy}
          className="w-full sm:w-auto px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          disabled={copied}
        >
          {copied ? t("copied") : t("copyButton")}
        </Button>
        {copied && (
          <Typography variant="body" color="accent" className="mt-3">
            {t("copySuccess")}
          </Typography>
        )}
      </div>

      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-blue-500/20 dark:border-purple-600/20">
        <Typography
          variant="body"
          className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 flex items-start sm:items-center gap-2 sm:gap-3"
        >
          <Icon
            name="lightbulb"
            size="md"
            color="accent"
            className="drop-shadow-sm flex-shrink-0 mt-0.5 sm:mt-0"
          />
          <span className="leading-relaxed">{t("tip")}</span>
        </Typography>
      </div>
    </div>
  );
};
