import { CategoryData } from "@/actions/categories";

export interface CategoryDetailProps {
  category: CategoryData;
  locale: string;
  className?: string;
}

export type CategoryDetailDesktopProps = CategoryDetailProps;

export type CategoryDetailMobileProps = CategoryDetailProps;
