import { CreateGenreData } from "@/actions/categories";

export interface GenreFormProps {
  categoryId: string;
  onSubmit: (data: CreateGenreData) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export interface GenreFormData {
  name: string;
  description: string;
  color: string;
}

export interface GenreFormErrors {
  name?: string;
  description?: string;
  color?: string;
}
