/**
 * DividerコンポーネントのProps
 */
export interface DividerProps {
  /** 境界線のスタイル */
  variant?: "default" | "gradient" | "solid";
  /** 境界線の太さ */
  thickness?: "thin" | "normal" | "thick";
  /** 境界線の色 */
  color?: "gray" | "accent" | "primary" | "custom";
  /** カスタムクラス名 */
  className?: string;
  /** カスタムスタイル */
  style?: React.CSSProperties;
}
