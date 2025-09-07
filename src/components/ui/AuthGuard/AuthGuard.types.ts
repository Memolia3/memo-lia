import type { ReactNode } from "react";

export interface AuthGuardProps {
  /** 認証状態 */
  isAuthenticated: boolean;
  /** ローディング状態 */
  isLoading: boolean;
  /** エラー状態 */
  error?: string | null;
  /** 子コンポーネント */
  children: ReactNode;
  /** 追加のCSSクラス */
  className?: string;
  /** ローディング時のメッセージ */
  loadingMessage?: string;
  /** 未認証時のメッセージ */
  unauthenticatedMessage?: string;
  /** エラー時のメッセージ */
  errorMessage?: string;
  /** エラー時のサブメッセージ */
  errorSubMessage?: string;
}
