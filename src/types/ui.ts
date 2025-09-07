/**
 * UI関連の型定義
 * コンポーネントの共通Props型
 */

import type { JSX, ReactNode } from "react";

// 基本的なコンポーネントProps
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// サイズ関連
export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

// 色関連
export type Color =
  | "primary"
  | "secondary"
  | "accent"
  | "muted"
  | "success"
  | "warning"
  | "error"
  | "info";

// バリアント関連
export type Variant = "default" | "outline" | "ghost" | "subtle" | "intense";

// 配置関連
export type Alignment = "left" | "center" | "right" | "justify";

// ボタン関連
export interface ButtonProps extends BaseComponentProps {
  variant?: Variant;
  size?: Size;
  color?: Color;
  disabled?: boolean;
  loading?: boolean;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  onClick?: () => void;
}

// タイポグラフィ関連
export type TypographyVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body"
  | "caption"
  | "small";
export type TypographyWeight = "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";

export interface TypographyProps extends BaseComponentProps {
  as?: keyof JSX.IntrinsicElements;
  variant?: TypographyVariant;
  weight?: TypographyWeight;
  color?: Color;
  align?: Alignment;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

// コンテナ関連
export type ContainerMaxWidth =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "full";
export type ContainerPadding = "none" | "sm" | "md" | "lg" | "xl";

export interface ContainerProps extends BaseComponentProps {
  maxWidth?: ContainerMaxWidth;
  padding?: ContainerPadding;
}

// アイコン関連
export type IconName =
  | "bookmark"
  | "search"
  | "sell"
  | "google"
  | "github"
  | "discord"
  | "check"
  | "close"
  | "info"
  | "warning"
  | "error";

export interface IconProps extends BaseComponentProps {
  name: IconName;
  size?: Size;
  color?: Color;
}

// 画像関連
export interface ImageProps extends BaseComponentProps {
  name: string;
  size?: Size;
  alt: string;
  width?: number;
  height?: number;
}

// 背景関連
export interface BackgroundProps extends BaseComponentProps {
  variant?: Variant;
  color?: Color;
  opacity?: number;
}

export interface GlassBackgroundProps extends BaseComponentProps {
  variant?: Variant;
  enableScale?: boolean;
  opacity?: number;
}

// ディバイダー関連
export type DividerVariant = "solid" | "dashed" | "dotted" | "gradient";
export type DividerThickness = "thin" | "normal" | "thick";

export interface DividerProps extends BaseComponentProps {
  variant?: DividerVariant;
  thickness?: DividerThickness;
  color?: Color;
  orientation?: "horizontal" | "vertical";
}

// ユーザー情報関連
export interface UserInfoProps extends BaseComponentProps {
  showAvatar?: boolean;
  showName?: boolean;
  showEmail?: boolean;
}
