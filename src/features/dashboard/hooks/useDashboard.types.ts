import { CategoryData } from "@/actions/categories";

export interface DashboardState {
  isAuthenticated: boolean;
  isLoading: boolean;
  categories: CategoryData[];
  error: string | null;
}

export interface DashboardActions {
  handleCategoryClick: (category: CategoryData) => void;
  refreshCategories: () => void;
}
