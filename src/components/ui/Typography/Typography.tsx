import { cn } from "@/utils";
import { TypographyProps } from "./Typography.types";

/**
 * テキストを表示するコンポーネント
 * @param children - テキスト
 * @param className - クラス名
 * @param as - タグ名
 * @param variant - テキストの種類
 * @param weight - テキストの太さ
 * @param color - テキストの色
 * @param align - テキストの揃え
 */
export const Typography: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = "div",
  variant = "body",
  weight = "normal",
  color = "primary",
  align = "left",
}) => {
  const variantStyles = {
    display: "text-6xl lg:text-7xl",
    h1: "text-4xl lg:text-5xl",
    h2: "text-3xl lg:text-4xl",
    h3: "text-2xl lg:text-3xl",
    h4: "text-xl lg:text-2xl",
    h5: "text-lg lg:text-xl",
    h6: "text-base lg:text-lg",
    body: "text-base lg:text-lg",
    "body-sm": "text-sm lg:text-base",
    caption: "text-xs lg:text-sm",
  };

  const weightStyles = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
  };

  const colorStyles = {
    primary: "text-gray-900 dark:text-gray-100",
    secondary: "text-gray-700 dark:text-gray-300",
    muted: "text-gray-600 dark:text-gray-400",
    accent: "text-blue-600 dark:text-blue-400",
    white: "text-white dark:text-white",
    black: "text-black dark:text-black",
  };

  const alignStyles = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };

  return (
    <Component
      className={cn(
        variantStyles[variant],
        weightStyles[weight],
        colorStyles[color],
        alignStyles[align],
        align === "center" && "text-center !important",
        className
      )}
      style={align === "center" ? { textAlign: "center" } : undefined}
    >
      {children}
    </Component>
  );
};
