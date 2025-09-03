import { isLocaleEnglish } from "@/utils/meta";

/**
 * 通知メッセージ（多言語対応）
 */
export const NOTIFICATION_MESSAGES = {
  // 認証関連
  AUTH: {
    SUCCESS: {
      ja: "認証に成功しました",
      en: "Authentication successful",
    },
    FAILED: {
      ja: "認証に失敗しました",
      en: "Authentication failed",
    },
    RETRY_DESCRIPTION: {
      ja: "しばらく時間をおいてから再度お試しください",
      en: "Please try again after a while",
    },
    UNSUPPORTED_PROVIDER: {
      ja: "未対応のプロバイダー",
      en: "Unsupported provider",
    },
    CHECK_CREDENTIALS: {
      ja: "ログイン情報を確認してください",
      en: "Please check your login credentials",
    },
  },
  // ネットワーク関連
  NETWORK: {
    ERROR: {
      ja: "ネットワークエラー",
      en: "Network error",
    },
    CHECK_CONNECTION: {
      ja: "インターネット接続を確認してください",
      en: "Please check your internet connection",
    },
  },
  // サーバー関連
  SERVER: {
    ERROR: {
      ja: "サーバーエラー",
      en: "Server error",
    },
  },
} as const;

/**
 * 通知の種類
 */
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
} as const;

/**
 * 通知の重要度
 */
export const NOTIFICATION_SEVERITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

/**
 * 通知のカテゴリ
 */
export const NOTIFICATION_CATEGORIES = {
  AUTHENTICATION: "authentication",
  NETWORK: "network",
  SERVER: "server",
  VALIDATION: "validation",
  LOGIN: "login",
  SAVE: "save",
  DELETE: "delete",
  UPDATE: "update",
  CREATE: "create",
  UPLOAD: "upload",
  DOWNLOAD: "download",
  OTHER: "other",
} as const;

/**
 * 通知のデフォルト設定
 */
export const NOTIFICATION_DEFAULTS = {
  // 認証エラー
  AUTH_ERROR: {
    duration: 5000,
    severity: NOTIFICATION_SEVERITY.MEDIUM,
    category: NOTIFICATION_CATEGORIES.AUTHENTICATION,
  },
  // 認証成功
  AUTH_SUCCESS: {
    category: NOTIFICATION_CATEGORIES.LOGIN,
  },
  // 一般的な通知
  SUCCESS: {
    duration: 3000,
    severity: NOTIFICATION_SEVERITY.LOW,
  },
  ERROR: {
    duration: 5000,
    severity: NOTIFICATION_SEVERITY.MEDIUM,
  },
  INFO: {
    duration: 5000,
    severity: NOTIFICATION_SEVERITY.LOW,
  },
  WARNING: {
    duration: 4000,
    severity: NOTIFICATION_SEVERITY.MEDIUM,
  },
} as const;

/**
 * 認証プロバイダー名
 */
export const AUTH_PROVIDER_NAMES = {
  GOOGLE: "Google",
  GITHUB: "GitHub",
  DISCORD: "Discord",
} as const;

/**
 * エラー定数
 */
export const ERROR_CONSTANTS = {
  NEXT_REDIRECT: "NEXT_REDIRECT",
} as const;

/**
 * 言語に応じてメッセージを取得するヘルパー関数
 */
export const getNotificationMessage = (
  message: { ja: string; en: string },
  locale: string
): string => {
  return isLocaleEnglish(locale) ? message.en : message.ja;
};
