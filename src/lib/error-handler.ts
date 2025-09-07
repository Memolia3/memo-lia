import { NOTIFICATION_MESSAGES } from "@/constants";
import { ErrorNotificationConfig } from "@/types/notification";

/**
 * エラーの種類
 */
export type ErrorType =
  | "network"
  | "validation"
  | "authentication"
  | "authorization"
  | "server"
  | "client"
  | "timeout"
  | "unknown";

/**
 * エラーの詳細情報
 */
export interface ErrorDetails {
  type: ErrorType;
  message: string;
  code?: string | number;
  status?: number;
  originalError?: unknown;
  context?: Record<string, unknown>;
}

/**
 * エラーを解析して詳細情報を取得
 */
export const parseError = (error: unknown): ErrorDetails => {
  // Error オブジェクトの場合
  if (error instanceof Error) {
    // Next.jsのリダイレクトエラーは正常な動作なので無視
    if (error.message === "NEXT_REDIRECT") {
      return {
        type: "unknown",
        message: "リダイレクト処理中",
        originalError: error,
      };
    }

    // ネットワークエラーの判定
    if (error.name === "NetworkError" || error.message.includes("fetch")) {
      return {
        type: "network",
        message: "ネットワークエラーが発生しました",
        originalError: error,
      };
    }

    // タイムアウトエラーの判定
    if (error.name === "TimeoutError" || error.message.includes("timeout")) {
      return {
        type: "timeout",
        message: "リクエストがタイムアウトしました",
        originalError: error,
      };
    }

    return {
      type: "unknown",
      message: error.message,
      originalError: error,
    };
  }

  // 文字列の場合
  if (typeof error === "string") {
    return {
      type: "unknown",
      message: error,
      originalError: error,
    };
  }

  // オブジェクトの場合（APIエラーレスポンスなど）
  if (typeof error === "object" && error !== null) {
    const errorObj = error as Record<string, unknown>;

    // HTTPステータスコードによる判定
    if (errorObj.status || errorObj.statusCode) {
      const status = errorObj.status || errorObj.statusCode;

      if (status >= 400 && status < 500) {
        if (status === 401) {
          return {
            type: "authentication",
            message: "認証が必要です",
            status,
            originalError: error,
          };
        }

        if (status === 403) {
          return {
            type: "authorization",
            message: "アクセス権限がありません",
            status,
            originalError: error,
          };
        }

        if (status === 422) {
          return {
            type: "validation",
            message: "入力内容に問題があります",
            status,
            originalError: error,
          };
        }

        return {
          type: "client",
          message: errorObj.message || "クライアントエラーが発生しました",
          status,
          originalError: error,
        };
      }

      if (status >= 500) {
        return {
          type: "server",
          message: "サーバーエラーが発生しました",
          status,
          originalError: error,
        };
      }
    }

    return {
      type: "unknown",
      message: errorObj.message || "不明なエラーが発生しました",
      originalError: error,
    };
  }

  // その他の場合
  return {
    type: "unknown",
    message: "不明なエラーが発生しました",
    originalError: error,
  };
};

/**
 * エラー詳細から通知設定を生成
 */
export const createErrorNotificationConfig = (
  errorDetails: ErrorDetails
): ErrorNotificationConfig => {
  const baseConfig: ErrorNotificationConfig = {
    type: "error",
    message: errorDetails.message,
    error: errorDetails.originalError,
    category: errorDetails.type,
    showStackTrace: false,
  };

  // エラーの種類に応じて詳細設定
  switch (errorDetails.type) {
    case "network":
      return {
        ...baseConfig,
        description: "インターネット接続を確認してください",
        duration: 8000,
        severity: "high",
      };

    case "timeout":
      return {
        ...baseConfig,
        description: NOTIFICATION_MESSAGES.AUTH.RETRY_DESCRIPTION,
        duration: 6000,
        severity: "medium",
      };

    case "authentication":
      return {
        ...baseConfig,
        description: "ログイン情報を確認してください",
        duration: 6000,
        severity: "high",
        actions: [
          {
            label: "ログイン",
            action: () => {
              // ログインページにリダイレクト
              window.location.href = "/auth";
            },
            variant: "primary",
          },
        ],
      };

    case "authorization":
      return {
        ...baseConfig,
        description: "この操作を実行する権限がありません",
        duration: 6000,
        severity: "high",
      };

    case "validation":
      return {
        ...baseConfig,
        description: "入力内容を確認してください",
        duration: 6000,
        severity: "medium",
      };

    case "server":
      return {
        ...baseConfig,
        description: "サーバーに問題が発生しています。しばらく時間をおいてから再度お試しください",
        duration: 8000,
        severity: "high",
      };

    case "client":
      return {
        ...baseConfig,
        description: "リクエストに問題があります",
        duration: 6000,
        severity: "medium",
      };

    default:
      return {
        ...baseConfig,
        description: "予期しないエラーが発生しました",
        duration: 6000,
        severity: "medium",
      };
  }
};

/**
 * グローバルエラーハンドラー
 */
export const globalErrorHandler = (error: unknown, context?: string) => {
  const errorDetails = parseError(error);

  // Next.jsのリダイレクトエラーは正常な動作なので無視
  if (error instanceof Error && error.message === "NEXT_REDIRECT") {
    return null;
  }

  // コンテキスト情報を追加
  if (context) {
    errorDetails.context = { ...errorDetails.context, context };
  }

  // コンソールにエラーを出力（開発環境のみ）
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.error("Global Error Handler:", errorDetails);
  }

  return createErrorNotificationConfig(errorDetails);
};
