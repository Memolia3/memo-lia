import type { ReactNode } from "react";

/**
 * アプリケーションヘッダーのプロパティ
 */
export interface AppHeaderProps {
  /** ヘッダーに表示するタイトル */
  title: string;
  /** 右側に表示するユーザー情報コンポーネント */
  userInfo: ReactNode;
  /** タイトルとユーザー情報の間に表示するアクションボタン */
  actions?: ReactNode;
  /** 追加のCSSクラス */
  className?: string;
}
