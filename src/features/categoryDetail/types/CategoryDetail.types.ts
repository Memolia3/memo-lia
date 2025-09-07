import { CategoryData } from "@/actions/categories";

export interface CategoryDetailProps {
  category: CategoryData;
  locale: string;
  className?: string;
}

export interface CategoryDetailDesktopProps extends CategoryDetailProps {}

export interface CategoryDetailMobileProps extends CategoryDetailProps {}
