"use client";

import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { CategoryFolder } from "../CategoryFolder";
import { CategoryGridProps } from "./CategoryGrid.types";

/**
 * カテゴリグリッドコンポーネント
 * カテゴリフォルダを横並び（レスポンシブ対応）で表示
 */
export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onCategoryClick,
  className,
}) => {
  const t = useTranslations("dashboard.emptyState");

  if (categories.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="text-gray-500 dark:text-gray-400">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
              />
            </svg>
          </div>
          <p className="text-lg font-medium mb-2">{t("title")}</p>
          <p className="text-sm">{t("description")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8",
        "gap-4 sm:gap-6",
        "w-full",
        className
      )}
    >
      {categories.map(category => (
        <CategoryFolder key={category.id} category={category} onClick={onCategoryClick} />
      ))}
    </div>
  );
};
