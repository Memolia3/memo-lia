import { cn } from "@/utils/cn";
import { DividerProps } from "./Divider.types";

/**
 * Dividerコンポーネント
 * @param variant - 境界線のスタイル (default, gradient, solid)
 * @param thickness - 境界線の太さ (thin, normal, thick)
 * @param color - 境界線の色 (gray, accent, primary, custom)
 * @param padding - パディングのサイズ (none, sm, md, lg, xl)
 * @param className - カスタムクラス名
 * @param style - カスタムスタイル
 */
export const Divider: React.FC<DividerProps> = ({
  variant = "default",
  thickness = "normal",
  color = "gray",
  padding = "none",
  className,
  style,
}) => {
  // 太さスタイル
  const thicknessStyles = {
    thin: "h-px",
    normal: "h-0.5",
    thick: "h-1",
  };

  // 色スタイル
  const colorStyles = {
    gray: "bg-gradient-to-r from-transparent via-gray-500 dark:via-gray-400 to-transparent",
    accent: "bg-gradient-to-r from-transparent via-blue-500 dark:via-blue-400 to-transparent",
    primary: "bg-gradient-to-r from-transparent via-gray-700 dark:via-gray-300 to-transparent",
    custom: "",
  };

  // スタイルバリエーション
  const variantStyles = {
    default: "w-full",
    gradient: "w-full",
    solid: "w-full",
  };

  // パディングスタイル
  const paddingStyles = {
    none: "",
    sm: "py-2",
    md: "py-4",
    lg: "py-6",
    xl: "py-8",
  };

  return (
    <div
      className={cn("flex items-center justify-center w-full", paddingStyles[padding], className)}
    >
      <div
        className={cn(variantStyles[variant], thicknessStyles[thickness], colorStyles[color])}
        style={style}
      />
    </div>
  );
};
