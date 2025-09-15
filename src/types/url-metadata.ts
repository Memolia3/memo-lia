/**
 * URLメタデータの型定義
 */
export interface UrlMetadata {
  title?: string;
  description?: string;
  faviconUrl?: string;
  url: string;
}

/**
 * URLメタデータ取得の状態
 */
export interface UrlMetadataState {
  metadata: UrlMetadata | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * URLメタデータ取得のオプション
 */
export interface UrlMetadataOptions {
  autoFetch?: boolean;
  debounceMs?: number;
}
