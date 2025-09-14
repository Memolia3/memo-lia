import { ComponentPropsWithoutRef } from "react";

/**
 * スクロールエリアのバリアント
 */
export type ScrollAreaVariant = "default" | "primary" | "subtle";

/**
 * スクロールバーのサイズ
 */
export type ScrollAreaSize = "sm" | "md" | "lg";

/**
 * スクロール方向
 */
export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";

/**
 * ScrollAreaコンポーネントのプロパティ
 */
export interface ScrollAreaProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * スクロールバーのスタイルバリアント
   * @default "default"
   */
  variant?: ScrollAreaVariant;

  /**
   * スクロールバーのサイズ
   * @default "md"
   */
  size?: ScrollAreaSize;

  /**
   * スクロールバーを非表示にするか
   * @default false
   */
  hideScrollbar?: boolean;

  /**
   * スクロール方向
   * @default "vertical"
   */
  orientation?: ScrollAreaOrientation;
}
