import { cn } from "@/utils/cn";
import { IconProps } from "./Icon.types";

/**
 * SVGアイコンコンポーネント
 * @param name - アイコン名
 * @param size - アイコンのサイズ (xs, sm, md, lg, xl, 2xl, 3xl)
 * @param color - アイコンの色 (primary, secondary, accent, muted, white, black, current)
 * @param className - アイコンのクラス名
 * @param style - アイコンのスタイル
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = "md",
  color = "current",
  className,
  style,
}) => {
  // サイズスタイル
  const sizeStyles = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10",
    "2xl": "w-12 h-12",
    "3xl": "w-16 h-16",
  };

  // 色スタイル
  const colorStyles = {
    primary: "text-gray-900 dark:text-gray-100",
    secondary: "text-gray-700 dark:text-gray-300",
    accent: "text-blue-600 dark:text-blue-400",
    muted: "text-gray-600 dark:text-gray-400",
    white: "text-white",
    black: "text-black",
    current: "text-current",
  };

  // SVGパスデータ
  const svgPaths = {
    bookmark:
      "M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z",
    search:
      "M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z",
    sell: "M856-390 570-104q-12 12-27 18t-30 6q-15 0-30-6t-27-18L103-457q-11-11-17-25.5T80-513v-287q0-33 23.5-56.5T160-880h287q16 0 31 6.5t26 17.5l352 353q12 12 17.5 27t5.5 30q0 15-5.5 29.5T856-390ZM513-160l286-286-353-354H160v286l353 354ZM260-640q25 0 42.5-17.5T320-700q0-25-17.5-42.5T260-760q-25 0-42.5 17.5T200-700q0 25 17.5 42.5T260-640Zm220 160Z",
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      className={cn(sizeStyles[size], colorStyles[color], "fill-current", className)}
      style={style}
    >
      <path d={svgPaths[name]} />
    </svg>
  );
};
