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
    sm: "px-2 py-4",
    md: "px-4 py-8",
    lg: "px-6 py-12",
    xl: "px-8 py-16",
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
        "mx-auto h-full overflow-hidden",
        size !== "full" && maxWidthStyles[maxWidth],
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
};
