"use client";

import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { GenreFolder } from "../GenreFolder";
import { GenreGridProps } from "./GenreGrid.types";

export const GenreGrid: React.FC<GenreGridProps> = ({
  genres,
  onGenreClick,
  onGenreDelete,
  className,
}) => {
  const t = useTranslations("categoryDetail");

  if (genres.length === 0) {
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {t("genres.empty")}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">{t("genres.emptyDescription")}</p>
      </div>
    );
  }

  return (
    <div
      className={cn("grid", "gap-6", "w-full", "justify-items-center", className)}
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "24px",
      }}
    >
      {genres.map(genre => (
        <GenreFolder key={genre.id} genre={genre} onClick={onGenreClick} onDelete={onGenreDelete} />
      ))}
    </div>
  );
};
