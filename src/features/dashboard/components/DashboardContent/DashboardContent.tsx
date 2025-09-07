"use client";

import { cn } from "@/utils";
import { CategoryGrid } from "../CategoryGrid";
import { ExtendedDashboardContentProps } from "./DashboardContent.types";

/**
 * ダッシュボードコンテンツコンポーネント
 * カテゴリフォルダのグリッドを表示
 */
export const DashboardContent: React.FC<ExtendedDashboardContentProps> = ({
  categories,
  onCategoryClick,
  className,
}) => {
  return (
    <main className={cn("flex-1 overflow-auto", "px-4 py-6 sm:px-6 sm:py-8", className)}>
      <div className="max-w-7xl mx-auto">
        <CategoryGrid categories={categories} onCategoryClick={onCategoryClick} />
      </div>
    </main>
  );
};
