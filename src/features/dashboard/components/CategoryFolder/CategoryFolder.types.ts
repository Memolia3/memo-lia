import { CategoryData } from "@/actions/categories";

export interface CategoryFolderProps {
  category: CategoryData;
  onClick: (category: CategoryData) => void;
  className?: string;
}
