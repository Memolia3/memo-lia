import type { ReactNode } from "react";

/**
 * ツールチップコンポーネントのProps
 */
export interface TooltipProps {
  /** ツールチップの内容 */
  content: ReactNode;
  /** ツールチップの位置 */
  position?: "top" | "bottom" | "left" | "right";
  /** ツールチップの表示遅延時間（ミリ秒） */
  delay?: number;
  /** 子要素 */
  children: ReactNode;
  /** カスタムクラス名 */
  className?: string;
  /** ツールチップの最大幅 */
  maxWidth?: string;
  /** ツールチップを無効にするかどうか */
  disabled?: boolean;
}
