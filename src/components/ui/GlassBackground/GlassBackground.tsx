import { cn } from "@/utils";
import type { GlassBackgroundProps } from "./GlassBackground.types";

/**
 * グラスモーフィズム効果を持つバックグラウンドコンポーネント
 *
 * @param children - 子要素
 * @param className - 追加のCSSクラス
 * @param variant - グラス効果の強度
 * @param blur - ぼかしの強度
 * @param opacity - 透明度（0-1）
 * @param borderRadius - 角丸のサイズ
 * @param backdrop - 背景のぼかし効果を有効にするか
 */
export const GlassBackground: React.FC<GlassBackgroundProps> = ({
  children,
  className,
  variant = "default",
  blur = "md",
  opacity = 0.8,
  borderRadius = "md",
  backdrop = true,
}) => {
  const variantStyles = {
    default:
      `bg-white/[${opacity * 0.1}] border-white/[${opacity * 0.2}] ` +
      `dark:bg-gray-800/[${opacity * 0.3}] dark:border-gray-700/[${opacity * 0.4}]`,
    subtle:
      `bg-white/[${opacity * 0.05}] border-white/[${opacity * 0.1}] ` +
      `dark:bg-gray-800/[${opacity * 0.2}] dark:border-gray-700/[${opacity * 0.3}]`,
    intense:
      `bg-white/[${opacity * 0.2}] border-white/[${opacity * 0.3}] ` +
      `dark:bg-gray-800/[${opacity * 0.4}] dark:border-gray-700/[${opacity * 0.5}]`,
  };

  const blurStyles = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
  };

  const borderRadiusStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  return (
    <div
      className={cn(
        // 基本スタイル
        "relative overflow-hidden",
        // グラス効果
        variantStyles[variant],
        // ボーダー
        "border",
        // 角丸
        borderRadiusStyles[borderRadius],
        // シャドウ
        "shadow-2xl",
        // 背景のぼかし
        backdrop && blurStyles[blur],
        // ホバー効果（スケールとシャドウ）
        "transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-3xl",
        // カスタムクラス
        className
      )}
    >
      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />

      {/* コンテンツ */}
      <div className="relative z-10">{children}</div>

      {/* 光沢効果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-50" />
    </div>
  );
};

export default GlassBackground;
