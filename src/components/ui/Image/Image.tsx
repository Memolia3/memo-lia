import { cn } from "@/utils/cn";
import NextImage from "next/image";
import { ImageProps } from "./Image.types";

/**
 * Imageコンポーネント
 * @param name - 画像名
 * @param size - 画像のサイズ (xs, sm, md, lg, xl, 2xl, 3xl)
 * @param className - カスタムクラス名
 * @param style - カスタムスタイル
 * @param alt - alt属性
 */
export const Image: React.FC<ImageProps> = ({ name, size = "md", className, style, alt }) => {
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

  // 画像パス
  const imagePaths = {
    "memo-lia-icon": "/assets/images/memo-lia-icon.png",
  };

  // サイズを数値に変換
  const getSizeValue = (sizeStr: string) => {
    const sizeMap = {
      xs: 12,
      sm: 16,
      md: 24,
      lg: 32,
      xl: 40,
      "2xl": 48,
      "3xl": 64,
    };
    return sizeMap[sizeStr as keyof typeof sizeMap] || 24;
  };

  return (
    <NextImage
      src={imagePaths[name]}
      alt={alt || `${name} image`}
      width={getSizeValue(size)}
      height={getSizeValue(size)}
      className={cn(sizeStyles[size], className)}
      style={style}
      priority
    />
  );
};
