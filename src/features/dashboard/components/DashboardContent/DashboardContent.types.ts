import { CategoryData } from "@/actions/categories";

export interface DashboardContentProps {
  className?: string;
}

export interface ExtendedDashboardContentProps extends DashboardContentProps {
  categories: CategoryData[];
  onCategoryClick: (category: CategoryData) => void;
}
