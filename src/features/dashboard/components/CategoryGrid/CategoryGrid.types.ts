import { CategoryData } from "@/actions/categories";

export interface CategoryGridProps {
  categories: CategoryData[];
  onCategoryClick: (category: CategoryData) => void;
  onCategoryDelete?: (categoryId: string) => void;
  className?: string;
}
