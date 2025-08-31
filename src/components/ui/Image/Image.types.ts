/**
 * ImageコンポーネントのProps
 */
export interface ImageProps {
  /** 画像名 */
  name: "memo-lia-icon";
  /** 画像のサイズ */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  /** カスタムクラス名 */
  className?: string;
  /** カスタムスタイル */
  style?: React.CSSProperties;
  /** alt属性 */
  alt?: string;
}
