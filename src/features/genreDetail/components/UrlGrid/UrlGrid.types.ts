import { UrlData } from "../UrlCard";

export interface UrlGridProps {
  urls: UrlData[];
  onUrlClick: (url: UrlData) => void;
  onUrlDelete?: (urlId: string) => void;
  isLoading?: boolean;
  className?: string;
  onEndReached?: () => void;
}
