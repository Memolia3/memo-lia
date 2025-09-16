"use client";

import { Loading, Typography } from "@/components/ui";
import { UrlMetadata } from "@/types/url-metadata";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";

export interface UrlPreviewProps {
  metadata: UrlMetadata | null;
  error?: string | null;
  isLoading?: boolean;
  className?: string;
}

/**
 * URLメタデータのプレビューコンポーネント
 */
export const UrlPreview: React.FC<UrlPreviewProps> = ({
  metadata,
  error,
  isLoading = false,
  className,
}) => {
  const t = useTranslations("urlForm");
  if (isLoading) {
    return (
      <div className={cn("mt-8", className)}>
        <Typography variant="label" className="text-sm font-medium mb-4 block">
          {t("preview")}
        </Typography>
        <div className="bg-white/5 dark:bg-gray-800/5 backdrop-blur-sm border border-white/10 dark:border-gray-700/10 rounded-lg p-4">
          <Loading
            size="sm"
            variant="dots"
            text={t("messages.fetchingMetadata")}
            showBackground={false}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("mt-8", className)}>
        <Typography variant="label" className="text-sm font-medium mb-4 block">
          {t("preview")}
        </Typography>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <Typography variant="body" className="text-red-600 dark:text-red-400">
            {error}
          </Typography>
        </div>
      </div>
    );
  }

  if (!metadata) {
    return null;
  }

  return (
    <div className={cn("mt-8", className)}>
      <Typography variant="label" className="text-sm font-medium mb-4 block">
        プレビュー
      </Typography>
      <div className="bg-white/5 dark:bg-gray-800/5 backdrop-blur-sm border border-white/10 dark:border-gray-700/10 rounded-lg p-4">
        <div className="flex items-start gap-3">
          {metadata.faviconUrl && (
            <div className="flex-shrink-0">
              <Image
                src={metadata.faviconUrl}
                alt="Favicon"
                width={32}
                height={32}
                className="rounded"
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <Typography variant="h3" className="text-lg font-semibold mb-1 truncate">
              {metadata.title || t("placeholders.noTitle")}
            </Typography>
            <Typography variant="body" className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {metadata.url}
            </Typography>
            {metadata.description && (
              <Typography
                variant="body"
                className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2"
              >
                {metadata.description}
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
