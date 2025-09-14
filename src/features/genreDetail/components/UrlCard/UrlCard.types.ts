export interface UrlData {
  id: string;
  title: string;
  url: string;
  description?: string;
  faviconUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UrlCardProps {
  url: UrlData;
  onClick: (url: UrlData) => void;
  onDelete?: (urlId: string) => void;
  className?: string;
}
