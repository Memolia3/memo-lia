"use client";

import { AppHeader } from "@/components/layout";
import { ScrollArea, UserInfo } from "@/components/ui";
import { AdSense } from "@/features/google";
import { ShareHandler } from "@/features/share/components/ShareHandler";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";

interface SharedData {
  title?: string;
  text?: string;
  url?: string;
}

interface ShareDesktopProps {
  locale: string;
  sharedData: SharedData;
  className?: string;
}

export const ShareDesktop: React.FC<ShareDesktopProps> = ({ locale, sharedData, className }) => {
  const t = useTranslations("share");

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <AppHeader title={t("title")} userInfo={<UserInfo />} />

      <ScrollArea className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex items-center min-h-full">
          <ShareHandler locale={locale} sharedData={sharedData} className="w-full" />
        </div>
      </ScrollArea>

      {/* AdSense広告 - 画面の一番下 */}
      <div className="px-4 py-4 sm:px-6 sm:py-6 border-t border-gray-200 dark:border-gray-700">
        <AdSense adSlot="1234567890" adFormat="fluid" responsive={true} className="w-full" />
      </div>
    </div>
  );
};
