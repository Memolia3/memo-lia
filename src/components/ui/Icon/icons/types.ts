/**
 * SVGアイコンデータの型定義
 */

export interface IconPath {
  fill: string;
  d: string;
}

export interface IconData {
  viewBox: string;
  paths: IconPath[];
}

export type IconName =
  | keyof typeof import("./auth").AUTH_ICONS
  | keyof typeof import("./common").COMMON_ICONS;
