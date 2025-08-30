import { cn } from "@/utils";
import { BackgroundProps } from "./Background.types";

/**
 * バックグラウンドコンポーネント
 * @param className - クラス名
 * @param children - 子要素
 */
export const Background: React.FC<BackgroundProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "h-full w-full relative transition-all duration-500 overflow-hidden",
        "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
        "dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
        className
      )}
    >
      {/* 動的な背景要素 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 装飾的な円形要素 - ライトモード */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full filter blur-3xl transition-all duration-500 bg-gradient-to-br from-blue-400/30 via-indigo-400/30 to-purple-400/30 dark:hidden" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full filter blur-3xl transition-all duration-500 bg-gradient-to-br from-indigo-400/30 via-purple-400/30 to-pink-400/30 dark:hidden" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full filter blur-3xl transition-all duration-500 bg-gradient-to-br from-cyan-400/20 via-blue-400/20 to-indigo-400/20 dark:hidden" />

        {/* 追加の美しい円形要素 - ライトモード */}
        <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full filter blur-2xl transition-all duration-500 bg-gradient-to-br from-emerald-400/25 via-teal-400/25 to-cyan-400/25 dark:hidden" />
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full filter blur-2xl transition-all duration-500 bg-gradient-to-br from-rose-400/20 via-pink-400/20 to-purple-400/20 dark:hidden" />

        {/* 装飾的な円形要素 - ダークモード */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full filter blur-3xl transition-all duration-500 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20 hidden dark:block" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full filter blur-3xl transition-all duration-500 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 hidden dark:block" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full filter blur-3xl transition-all duration-500 bg-gradient-to-br from-yellow-600/20 via-orange-600/20 to-red-600/20 hidden dark:block" />
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 h-full overflow-hidden">{children}</div>
    </div>
  );
};
