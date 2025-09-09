export interface UrlFormData {
  url: string;
  title?: string;
  description?: string;
}

export interface UrlFormProps {
  initialData?: Partial<UrlFormData>;
  onSubmit: (data: UrlFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}
