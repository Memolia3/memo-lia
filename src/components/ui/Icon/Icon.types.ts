/**
 * SVGアイコンコンポーネントのProps
 */
export interface IconProps {
  /** アイコン名 */
  name: "bookmark" | "search" | "sell" | "google" | "github" | "discord" | "user";
  /** アイコンのサイズ */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  /** アイコンの色 */
  color?: "primary" | "secondary" | "accent" | "muted" | "white" | "black" | "current";
  /** カスタムクラス名 */
  className?: string;
  /** カスタムスタイル */
  style?: React.CSSProperties;
}
