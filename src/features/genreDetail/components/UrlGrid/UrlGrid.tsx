"use client";

import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { UrlCard } from "../UrlCard";
import { UrlGridProps } from "./UrlGrid.types";

export const UrlGrid: React.FC<UrlGridProps> = ({ urls, onUrlClick, onUrlDelete, className }) => {
  const t = useTranslations("genreDetail");

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
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {t("urls.empty")}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">{t("urls.emptyDescription")}</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      {urls.map(url => (
        <UrlCard key={url.id} url={url} onClick={onUrlClick} onDelete={onUrlDelete} />
      ))}
    </div>
  );
};
