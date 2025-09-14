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
  // 成功通知関連
  SUCCESS: {
    LOGGED_IN: {
      ja: "ログインしました",
      en: "Logged in",
    },
    LOGGED_OUT: {
      ja: "ログアウトしました",
      en: "Logged out",
    },
    SAVED: {
      ja: "保存しました",
      en: "Saved",
    },
    DELETED: {
      ja: "削除しました",
      en: "Deleted",
    },
    UPDATED: {
      ja: "更新しました",
      en: "Updated",
    },
    CREATED: {
      ja: "作成しました",
      en: "Created",
    },
    UPLOADED: {
      ja: "アップロードしました",
      en: "Uploaded",
    },
    DOWNLOADED: {
      ja: "ダウンロードしました",
      en: "Downloaded",
    },
    LOGIN_DESCRIPTION: {
      ja: "アカウントに正常にログインしました",
      en: "Successfully logged into your account",
    },
    AUTO_LOGIN_DESCRIPTION: {
      ja: "認証が完了してダッシュボードに移動しました",
      en: "Authentication completed and moved to dashboard",
    },
    LOGOUT_DESCRIPTION: {
      ja: "アカウントから正常にログアウトしました",
      en: "Successfully logged out of your account",
    },
    SAVE_DESCRIPTION: {
      ja: "変更が正常に保存されました",
      en: "Changes saved successfully",
    },
    DELETE_DESCRIPTION: {
      ja: "アイテムが正常に削除されました",
      en: "Item deleted successfully",
    },
    UPDATE_DESCRIPTION: {
      ja: "変更が正常に適用されました",
      en: "Changes applied successfully",
    },
    CREATE_DESCRIPTION: {
      ja: "新しいアイテムが正常に作成されました",
      en: "New item created successfully",
    },
    UPLOAD_DESCRIPTION: {
      ja: "ファイルが正常にアップロードされました",
      en: "File uploaded successfully",
    },
    DOWNLOAD_DESCRIPTION: {
      ja: "ファイルが正常にダウンロードされました",
      en: "File downloaded successfully",
    },
    DEFAULT_DESCRIPTION: {
      ja: "操作が正常に完了しました",
      en: "Operation completed successfully",
    },
    CATEGORY_CREATED: {
      ja: "カテゴリを作成しました",
      en: "Category created",
    },
    CATEGORY_CREATE_DESCRIPTION: {
      ja: "新しいカテゴリフォルダが正常に作成されました",
      en: "New category folder has been created successfully",
    },
    CATEGORY_CREATE_ERROR: {
      ja: "カテゴリの作成に失敗しました",
      en: "Failed to create category",
    },
    CATEGORY_CREATE_ERROR_DESCRIPTION: {
      ja: "カテゴリの作成中にエラーが発生しました",
      en: "An error occurred while creating the category",
    },
    CATEGORY_DELETED: {
      ja: "カテゴリを削除しました",
      en: "Category deleted",
    },
    CATEGORY_DELETE_DESCRIPTION: {
      ja: "カテゴリフォルダが正常に削除されました",
      en: "Category folder has been deleted successfully",
    },
    CATEGORY_DELETE_ERROR: {
      ja: "カテゴリの削除に失敗しました",
      en: "Failed to delete category",
    },
    CATEGORY_DELETE_ERROR_DESCRIPTION: {
      ja: "カテゴリの削除中にエラーが発生しました",
      en: "An error occurred while deleting the category",
    },
    GENRE_CREATED: {
      ja: "ジャンルを作成しました",
      en: "Genre created",
    },
    GENRE_CREATE_DESCRIPTION: {
      ja: "新しいジャンルが正常に作成されました",
      en: "New genre has been created successfully",
    },
    GENRE_CREATE_ERROR: {
      ja: "ジャンルの作成に失敗しました",
      en: "Failed to create genre",
    },
    GENRE_CREATE_ERROR_DESCRIPTION: {
      ja: "ジャンルの作成中にエラーが発生しました",
      en: "An error occurred while creating the genre",
    },
    GENRE_DELETED: {
      ja: "ジャンルを削除しました",
      en: "Genre deleted",
    },
    GENRE_DELETE_DESCRIPTION: {
      ja: "ジャンルが正常に削除されました",
      en: "Genre deleted successfully",
    },
    GENRE_DELETE_ERROR: {
      ja: "ジャンル削除に失敗しました",
      en: "Failed to delete genre",
    },
    GENRE_DELETE_ERROR_DESCRIPTION: {
      ja: "ジャンルの削除中にエラーが発生しました",
      en: "An error occurred while deleting the genre",
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
