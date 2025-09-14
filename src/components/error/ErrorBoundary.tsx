"use client";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { globalErrorHandler } from "@/lib/error-handler";
import { AlertTriangle, RefreshCw } from "lucide-react";
import React, { Component } from "react";
import { ErrorBoundaryProps, ErrorBoundaryState } from "./ErrorBoundary.types";

/**
 * エラーバウンダリコンポーネント
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Next.jsのリダイレクトエラーは正常な動作なので無視
    if (error.message === "NEXT_REDIRECT") {
      return;
    }

    this.setState({
      error,
      errorInfo,
    });

    // エラーハンドラーを呼び出し
    globalErrorHandler(error, "ErrorBoundary");

    // カスタムエラーハンドラーがあれば呼び出し
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // カスタムフォールバックが指定されている場合
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // デフォルトのエラー表示
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              {/* エラーアイコン */}
              <div className="flex justify-center mb-4">
                <AlertTriangle className="w-16 h-16 text-red-500" />
              </div>

              {/* エラータイトル */}
              <Typography as="h1" variant="h3" weight="bold" color="primary" className="mb-2">
                エラーが発生しました
              </Typography>

              {/* エラーメッセージ */}
              <Typography variant="body" color="secondary" className="mb-6">
                申し訳ございません。予期しないエラーが発生しました。
              </Typography>

              {/* エラー詳細（開発環境のみ） */}
              {this.props.showErrorDetails && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
                  <Typography
                    variant="caption"
                    weight="semibold"
                    color="primary"
                    className="mb-2 block"
                  >
                    エラー詳細:
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-red-600 dark:text-red-400 font-mono text-xs break-all"
                  >
                    {this.state.error.message}
                  </Typography>
                  {this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-gray-600 dark:text-gray-400">
                        スタックトレース
                      </summary>
                      <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-32">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* アクションボタン */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={this.handleRetry} variant="primary" className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  再試行
                </Button>
                <Button onClick={this.handleReload} variant="outline" className="flex-1">
                  ページを再読み込み
                </Button>
              </div>

              {/* ヘルプテキスト */}
              <Typography variant="caption" color="muted" className="mt-4 block">
                問題が解決しない場合は、ページを再読み込みしてください。
              </Typography>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * グローバルエラーバウンダリ
 */
export const GlobalErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      showErrorDetails={process.env.NODE_ENV === "development"}
      onError={(error, errorInfo) => {
        // エラーを外部サービスに送信（例：Sentry）
        const windowWithSentry = window as unknown as {
          Sentry?: { captureException: (error: Error, context: unknown) => void };
        };
        if (typeof window !== "undefined" && windowWithSentry.Sentry) {
          windowWithSentry.Sentry.captureException(error, {
            contexts: {
              react: {
                componentStack: errorInfo.componentStack,
              },
            },
          });
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
