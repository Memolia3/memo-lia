import { OAUTH_PROVIDER } from "@/constants";
import { cn } from "@/utils/cn";
import { IconProps } from "./Icon.types";
import { AUTH_ICONS } from "./icons/auth";
import { COMMON_ICONS } from "./icons/common";

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

  // アイコンデータを取得
  const getIconData = (iconName: string) => {
    if (iconName in AUTH_ICONS) {
      return AUTH_ICONS[iconName as keyof typeof AUTH_ICONS];
    }
    if (iconName in COMMON_ICONS) {
      return COMMON_ICONS[iconName as keyof typeof COMMON_ICONS];
    }
    return null;
  };

  const iconData = getIconData(name);

  if (!iconData) {
    return null;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={iconData.viewBox}
      className={cn(
        sizeStyles[size],
        name === OAUTH_PROVIDER.GOOGLE ? "" : colorStyles[color],
        "fill-current",
        className
      )}
      style={style}
    >
      {iconData.paths.map((path, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <path key={index} fill={path.fill} d={path.d} />
      ))}
    </svg>
  );
};
