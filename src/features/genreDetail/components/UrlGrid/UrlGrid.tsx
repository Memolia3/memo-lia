"use client";

import { Loading } from "@/components/ui";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { Virtuoso } from "react-virtuoso";
import { UrlCard, UrlData } from "../UrlCard";
import { UrlGridProps } from "./UrlGrid.types";

export const UrlGrid: React.FC<UrlGridProps> = memo(
  ({ urls, onUrlClick, onUrlDelete, isLoading = false, className, onEndReached }) => {
    const t = useTranslations("genreDetail.urls");

    // URL取得中のローディング表示
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-6">
          <Loading
            size="md"
            variant="spinner"
            text={t("loading")}
            showBackground={false}
            className="flex-row gap-3 py-0"
          />
        </div>
      );
    }

    // URLが空の場合の表示
    if (urls.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t("empty")}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t("emptyDescription")}</p>
        </div>
      );
    }

    return (
      <div className={cn("w-full h-full", className)}>
        <Virtuoso
          data={urls}
          itemContent={(index: number, url: UrlData) => (
            <div className="pb-4 px-1">
              <UrlCard url={url} onClick={onUrlClick} onDelete={onUrlDelete} />
            </div>
          )}
          style={{ height: "100%" }}
          endReached={onEndReached}
        />
      </div>
    );
  }
);

UrlGrid.displayName = "UrlGrid";
