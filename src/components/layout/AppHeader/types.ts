import type { ReactNode } from "react";

/**
 * アプリケーションヘッダーのプロパティ
 */
export interface AppHeaderProps {
  /** ヘッダーに表示するタイトル */
  title: string;
  /** 右側に表示するユーザー情報コンポーネント */
  userInfo: ReactNode;
  /** 追加のCSSクラス */
  className?: string;
}
