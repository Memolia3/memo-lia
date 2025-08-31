/**
 * テキストを表示するコンポーネントのProps
 * @param children - テキスト
 * @param className - クラス名
 * @param as - タグ名
 * @param variant - テキストの種類
 * @param weight - テキストの太さ
 * @param color - テキストの色
 * @param align - テキストの揃え
 */
export interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  variant?: "display" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" | "body-sm" | "caption";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";
  color?: "primary" | "secondary" | "muted" | "accent" | "white" | "black";
  align?: "left" | "center" | "right" | "justify";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}
