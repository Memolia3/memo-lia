export interface LoadingProps {
  /**
   * ローディングのサイズ
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * ローディングのタイプ
   */
  variant?: "spinner" | "dots" | "pulse" | "glass" | "morph" | "shimmer";
  /**
   * カスタムクラス名
   */
  className?: string;
  /**
   * ローディングテキスト
   */
  text?: string;
  /**
   * 説明テキスト
   */
  description?: string;
  /**
   * フルスクリーン表示するかどうか
   */
  fullScreen?: boolean;
  /**
   * 背景を表示するかどうか
   */
  showBackground?: boolean;
}
