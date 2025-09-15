"use client";

import { ShareHandler } from "@/features/share/components/ShareHandler";

interface SharedData {
  title?: string;
  text?: string;
  url?: string;
}

interface ShareMobileProps {
  locale: string;
  sharedData: SharedData;
}

export const ShareMobile: React.FC<ShareMobileProps> = ({ locale, sharedData }) => {
  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <ShareHandler locale={locale} sharedData={sharedData} />
      </div>
    </div>
  );
};
