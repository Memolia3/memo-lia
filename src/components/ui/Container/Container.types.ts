/**
 * コンテナコンポーネントのProps
 * @param children - 子要素
 * @param className - クラス名
 * @param size - コンテナのサイズ
 * @param padding - コンテナのパディング
 * @param maxWidth - コンテナの最大幅
 */
export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  maxWidth?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
}
