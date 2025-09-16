"use client";

import { cn } from "@/utils";
import { CategoryGrid } from "../CategoryGrid";

import type { CategoryData } from "@/actions/categories";

export interface DashboardContentProps {
  onCategoryClick?: (category: CategoryData) => void;
  onCategoryDelete?: (categoryId: string) => void;
  className?: string;
}

/**
 * ダッシュボードコンテンツコンポーネント
 * カテゴリフォルダのグリッドを表示
 * データ読み込みはCategoryGridに委任
 */
export const DashboardContent: React.FC<DashboardContentProps> = ({
  onCategoryClick,
  onCategoryDelete,
  className,
}) => {
  return (
    <main className={cn("flex-1 overflow-visible", "px-4 py-6 sm:px-6 sm:py-8", className)}>
      <div className="max-w-7xl mx-auto">
        <CategoryGrid onCategoryClick={onCategoryClick} onCategoryDelete={onCategoryDelete} />
      </div>
    </main>
  );
};
