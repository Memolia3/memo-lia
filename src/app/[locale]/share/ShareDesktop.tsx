"use client";

import { ShareHandler } from "@/features/share/components/ShareHandler";

interface SharedData {
  title?: string;
  text?: string;
  url?: string;
}

interface ShareDesktopProps {
  locale: string;
  sharedData: SharedData;
}

export const ShareDesktop: React.FC<ShareDesktopProps> = ({ locale, sharedData }) => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <ShareHandler locale={locale} sharedData={sharedData} />
      </div>
    </div>
  );
};
