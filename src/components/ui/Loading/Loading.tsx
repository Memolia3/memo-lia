"use client";

import { cn } from "@/utils";

export interface LoadingProps {
  /**
   * ローディングのサイズ
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * ローディングのタイプ
   */
  variant?: "spinner" | "dots" | "pulse" | "glass" | "morph" | "shimmer";
  /**
   * カスタムクラス名
   */
  className?: string;
  /**
   * ローディングテキスト
   */
  text?: string;
  /**
   * 説明テキスト
   */
  description?: string;
  /**
   * フルスクリーン表示するかどうか
   */
  fullScreen?: boolean;
  /**
   * 背景を表示するかどうか
   */
  showBackground?: boolean;
}

/**
 * 汎用的なローディングコンポーネント
 * 様々なサイズとバリアントに対応
 */
export const Loading: React.FC<LoadingProps> = ({
  size = "md",
  variant = "spinner",
  className,
  text,
  description,
  fullScreen = false,
  showBackground = true,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const renderSpinner = () => (
    <div className={cn("relative", sizeClasses[size])}>
      {/* 外側のリング */}
      <div
        className={cn(
          "absolute inset-0 rounded-full border-2 border-blue-200/30 border-t-blue-600",
          "dark:border-blue-800/30 dark:border-t-blue-400",
          "animate-spin"
        )}
        style={{
          animationDuration: "1s",
        }}
      />
      {/* 内側のリング */}
      <div
        className={cn(
          "absolute inset-1 rounded-full border border-blue-300/50 border-r-blue-600",
          "dark:border-blue-700/50 dark:border-r-blue-400",
          "animate-spin"
        )}
        style={{
          animationDuration: "0.8s",
          animationDirection: "reverse",
        }}
      />
      {/* 中央のドット */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"
        )}
      />
    </div>
  );

  const renderDots = () => (
    <div className="flex space-x-3">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={cn(
            "rounded-full bg-blue-600 dark:bg-blue-400",
            size === "sm" && "w-3 h-3",
            size === "md" && "w-4 h-4",
            size === "lg" && "w-5 h-5",
            size === "xl" && "w-6 h-6"
          )}
          style={{
            animation: `wave 1.2s ease-in-out infinite ${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className={cn("relative", sizeClasses[size])}>
      {/* 外側の脈動リング */}
      <div
        className={cn(
          "absolute inset-0 rounded-full border-2 border-blue-300/50",
          "dark:border-blue-700/50",
          "animate-ping"
        )}
        style={{
          animationDuration: "2s",
        }}
      />
      {/* 内側のコア */}
      <div
        className={cn(
          "absolute inset-2 rounded-full bg-blue-600 dark:bg-blue-400",
          "animate-pulse"
        )}
        style={{
          animationDuration: "1.5s",
        }}
      />
    </div>
  );

  const renderGlass = () => (
    <div className={cn("relative", sizeClasses[size])}>
      {/* 外側のグラデーションリング */}
      <div
        className={cn(
          "absolute inset-0 rounded-full",
          "bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400",
          "dark:from-blue-500 dark:via-blue-300 dark:to-blue-500",
          "animate-spin opacity-60"
        )}
        style={{
          animationDuration: "2s",
        }}
      />
      {/* 内側の透明なリング */}
      <div
        className={cn(
          "absolute inset-1 rounded-full border-2 border-blue-600/30 border-t-blue-600",
          "dark:border-blue-400/30 dark:border-t-blue-400",
          "animate-spin"
        )}
        style={{
          animationDuration: "1.2s",
          animationDirection: "reverse",
        }}
      />
      {/* 中央のドット */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"
        )}
      />
    </div>
  );

  const renderMorph = () => (
    <div
      className={cn("rounded-full bg-blue-600 dark:bg-blue-400", sizeClasses[size])}
      style={{
        animation: "morph 2s ease-in-out infinite",
      }}
    />
  );

  const renderShimmer = () => (
    <div
      className={cn(
        "rounded-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400",
        "dark:from-blue-500 dark:via-blue-300 dark:to-blue-500",
        "animate-pulse",
        sizeClasses[size]
      )}
      style={{
        backgroundSize: "200% 100%",
        animation: "glass-shimmer 2s ease-in-out infinite",
      }}
    />
  );

  const renderLoader = () => {
    switch (variant) {
      case "dots":
        return renderDots();
      case "pulse":
        return renderPulse();
      case "glass":
        return renderGlass();
      case "morph":
        return renderMorph();
      case "shimmer":
        return renderShimmer();
      case "spinner":
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        fullScreen && "min-h-screen",
        !fullScreen && "py-12",
        className
      )}
    >
      <div
        className={cn(
          "relative",
          showBackground &&
            "w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
        )}
      >
        {renderLoader()}
      </div>

      {text && (
        <p
          className={cn("font-medium mb-2 text-gray-700 dark:text-gray-300", textSizeClasses[size])}
        >
          {text}
        </p>
      )}

      {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};
