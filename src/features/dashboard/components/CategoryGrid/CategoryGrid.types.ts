import { CategoryData } from "@/actions/categories";

export interface CategoryGridProps {
  categories: CategoryData[];
  onCategoryClick: (category: CategoryData) => void;
  className?: string;
}
