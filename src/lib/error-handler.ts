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
        message: "Redirecting...",
        originalError: error,
      };
    }

    // ネットワークエラーの判定
    if (error.name === "NetworkError" || error.message.includes("fetch")) {
      return {
        type: "network",
        message: "Network error occurred",
        originalError: error,
      };
    }

    // タイムアウトエラーの判定
    if (error.name === "TimeoutError" || error.message.includes("timeout")) {
      return {
        type: "timeout",
        message: "Request timed out",
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
      const status = Number(errorObj.status || errorObj.statusCode);

      if (status >= 400 && status < 500) {
        if (status === 401) {
          return {
            type: "authentication",
            message: "Authentication required",
            status,
            originalError: error,
          };
        }

        if (status === 403) {
          return {
            type: "authorization",
            message: "Access denied",
            status,
            originalError: error,
          };
        }

        if (status === 422) {
          return {
            type: "validation",
            message: "Validation error",
            status,
            originalError: error,
          };
        }

        return {
          type: "client",
          message: (errorObj.message as string) || "Client error occurred",
          status,
          originalError: error,
        };
      }

      if (status >= 500) {
        return {
          type: "server",
          message: "Server error occurred",
          status,
          originalError: error,
        };
      }
    }

    return {
      type: "unknown",
      message: (errorObj.message as string) || "Unknown error occurred",
      originalError: error,
    };
  }

  // その他の場合
  return {
    type: "unknown",
    message: "Unknown error occurred",
    originalError: error,
  };
};

/**
 * エラー詳細から通知設定を生成
 */
export const createErrorNotificationConfig = (
  errorDetails: ErrorDetails,
  t?: (key: string) => string
): ErrorNotificationConfig => {
  const baseConfig: ErrorNotificationConfig = {
    type: "error",
    message: errorDetails.message,
    error: errorDetails.originalError,
    category: errorDetails.type === "timeout" ? "timeout" : errorDetails.type,
    showStackTrace: false,
  };

  // エラーの種類に応じて詳細設定
  const getTranslation = (key: string) => t?.(key) || key;
  switch (errorDetails.type) {
    case "network":
      return {
        ...baseConfig,
        description: getTranslation("common.errors.networkError"),
        duration: 8000,
        severity: "high",
      };

    case "timeout":
      return {
        ...baseConfig,
        description: getTranslation("common.errors.timeoutError"),
        duration: 6000,
        severity: "medium",
      };

    case "authentication":
      return {
        ...baseConfig,
        description: getTranslation("common.errors.authenticationError"),
        duration: 6000,
        severity: "high",
        actions: [
          {
            label: getTranslation("common.errors.loginButton"),
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
        description: getTranslation("common.errors.authorizationError"),
        duration: 6000,
        severity: "high",
      };

    case "validation":
      return {
        ...baseConfig,
        description: getTranslation("common.errors.validationError"),
        duration: 6000,
        severity: "medium",
      };

    case "server":
      return {
        ...baseConfig,
        description: getTranslation("common.errors.serverError"),
        duration: 8000,
        severity: "high",
      };

    case "client":
      return {
        ...baseConfig,
        description: getTranslation("common.errors.validationError"),
        duration: 6000,
        severity: "medium",
      };

    default:
      return {
        ...baseConfig,
        description: getTranslation("common.errors.unexpectedError"),
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

  return createErrorNotificationConfig(errorDetails);
};
