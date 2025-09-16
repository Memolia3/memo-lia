import { CategoryData } from "@/actions/categories";

export interface DashboardContentProps {
  onCategoryClick?: (category: CategoryData) => void;
  onCategoryDelete?: (categoryId: string) => void;
  className?: string;
}

// 後方互換性のための型定義（非推奨）
export interface ExtendedDashboardContentProps extends DashboardContentProps {
  categories: CategoryData[];
  onCategoryClick: (category: CategoryData) => void;
  onCategoryDelete?: (categoryId: string) => void;
}
