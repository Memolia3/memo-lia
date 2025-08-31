/**
 * バックグラウンドコンポーネントのProps
 * @param className - クラス名
 * @param children - 子要素
 * @param padding - パディングのサイズ
 */
export interface BackgroundProps {
  className?: string;
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}
