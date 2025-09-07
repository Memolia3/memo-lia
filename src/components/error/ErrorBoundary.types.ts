import { ErrorInfo, ReactNode } from "react";

/**
 * エラーバウンダリのプロパティ
 */
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
}

/**
 * エラーバウンダリの状態
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}
