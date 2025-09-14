import { CategoryData } from "@/actions/categories";

export interface CategoryFolderProps {
  category: CategoryData;
  onClick: (category: CategoryData) => void;
  onDelete?: (categoryId: string) => void;
  className?: string;
}
