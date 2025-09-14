import { CreateCategoryData } from "@/actions/categories";

export interface CategoryFormProps {
  onSubmit: (data: CreateCategoryData) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  color: string;
}

export interface CategoryFormErrors {
  name?: string;
  description?: string;
  color?: string;
}
