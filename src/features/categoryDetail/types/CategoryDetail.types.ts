import { CategoryData } from "@/actions/categories";
import { GenreData } from "./Genre.types";

export interface CategoryDetailProps {
  category: CategoryData;
  initialGenres?: GenreData[];
  locale: string;
  className?: string;
}

export type CategoryDetailDesktopProps = CategoryDetailProps;

export type CategoryDetailMobileProps = CategoryDetailProps;
