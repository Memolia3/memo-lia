import { cn } from "@/utils";
import { ContainerProps } from "./Container.types";

/**
 * コンテナコンポーネント
 * @param children - 子要素
 * @param className - クラス名
 * @param size - コンテナのサイズ
 * @param padding - コンテナのパディング
 * @param maxWidth - コンテナの最大幅
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = "lg",
  padding = "md",
  maxWidth = "7xl",
}) => {
  const paddingStyles = {
    none: "",
    sm: "lg:px-2 lg:py-4",
    md: "lg:px-4 lg:py-8",
    lg: "lg:px-6 lg:py-12",
    xl: "lg:px-8 lg:py-16",
  };

  const maxWidthStyles = {
    none: "",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
  };

  return (
    <div
      className={cn(
        "mx-auto h-full",
        size !== "full" && maxWidthStyles[maxWidth],
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
};
