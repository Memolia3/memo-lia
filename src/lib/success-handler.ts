import { SuccessNotificationConfig } from "@/types/notification";
// import { NOTIFICATION_TYPES, NOTIFICATION_SEVERITY, NOTIFICATION_CATEGORIES } from "@/constants";

/**
 * 成功の種類
 */
export type SuccessType =
  | "save"
  | "delete"
  | "update"
  | "create"
  | "login"
  | "logout"
  | "upload"
  | "download"
  | "other";

/**
 * 成功の詳細情報
 */
export interface SuccessDetails {
  type: SuccessType;
  message: string;
  item?: string;
  context?: Record<string, unknown>;
}

/**
 * 成功詳細から通知設定を生成
 */
export const createSuccessNotificationConfig = (
  successDetails: SuccessDetails
): SuccessNotificationConfig => {
  const baseConfig = {
    type: "success" as const,
    category: successDetails.type,
    duration: 3000,
    severity: "medium" as const,
  };

  // 成功の種類に応じて詳細設定
  switch (successDetails.type) {
    case "save":
      return {
        ...baseConfig,
        message: successDetails.item ? `${successDetails.item}を保存しました` : "保存しました",
        description: "変更が正常に保存されました",
      };

    case "delete":
      return {
        ...baseConfig,
        message: successDetails.item ? `${successDetails.item}を削除しました` : "削除しました",
        description: "アイテムが正常に削除されました",
        duration: 4000,
      };

    case "update":
      return {
        ...baseConfig,
        message: successDetails.item ? `${successDetails.item}を更新しました` : "更新しました",
        description: "変更が正常に適用されました",
      };

    case "create":
      return {
        ...baseConfig,
        message: successDetails.item ? `${successDetails.item}を作成しました` : "作成しました",
        description: "新しいアイテムが正常に作成されました",
      };

    case "login":
      return {
        ...baseConfig,
        message: "ログインしました",
        description: "アカウントに正常にログインしました",
        duration: 4000,
      };

    case "logout":
      return {
        ...baseConfig,
        message: "ログアウトしました",
        description: "アカウントから正常にログアウトしました",
        duration: 3000,
      };

    case "upload":
      return {
        ...baseConfig,
        message: successDetails.item
          ? `${successDetails.item}をアップロードしました`
          : "アップロードしました",
        description: "ファイルが正常にアップロードされました",
        duration: 4000,
      };

    case "download":
      return {
        ...baseConfig,
        message: successDetails.item
          ? `${successDetails.item}をダウンロードしました`
          : "ダウンロードしました",
        description: "ファイルが正常にダウンロードされました",
        duration: 4000,
      };

    default:
      return {
        ...baseConfig,
        message: successDetails.message,
        description: "操作が正常に完了しました",
      };
  }
};

/**
 * グローバル成功ハンドラー
 */
export const globalSuccessHandler = (
  type: SuccessType,
  message?: string,
  item?: string,
  context?: Record<string, unknown>
) => {
  const successDetails: SuccessDetails = {
    type,
    message: message || "",
    item,
    context,
  };

  return createSuccessNotificationConfig(successDetails);
};

/**
 * 認証成功ハンドラー
 */
export const authSuccessHandler = (provider?: string) => {
  return globalSuccessHandler(
    "login",
    provider ? `${provider}でログインしました` : "ログインしました"
  );
};

/**
 * データ操作成功ハンドラー
 */
export const dataOperationSuccessHandler = (
  operation: "save" | "delete" | "update" | "create",
  item?: string
) => {
  return globalSuccessHandler(operation, undefined, item);
};

/**
 * ファイル操作成功ハンドラー
 */
export const fileOperationSuccessHandler = (
  operation: "upload" | "download",
  filename?: string
) => {
  return globalSuccessHandler(operation, undefined, filename);
};
