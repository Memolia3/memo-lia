/**
 * ボタンコンポーネントのProps
 * @param variant - ボタンの種類
 * @param size - ボタンのサイズ
 * @param loading - ローディング中かどうか
 * @param leftIcon - 左にアイコンを表示
 * @param rightIcon - 右にアイコンを表示
 * @param fullWidth - ボタンを全幅にするかどうか
 * @param rounded - ボタンの角丸度
 * @param disabled - ボタンを無効化するかどうか
 * @param children - ボタンの中に表示するコンテンツ
 * @param props - ボタンの属性
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
}
