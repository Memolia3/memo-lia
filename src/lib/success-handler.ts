import { getNotificationMessage, NOTIFICATION_MESSAGES } from "@/constants/notification";
import { SuccessNotificationConfig } from "@/types/notification";

/**
 * 成功通知のカテゴリ型
 */
type SuccessNotificationCategory = NonNullable<SuccessNotificationConfig["category"]>;

/**
 * 成功の種類
 */
export type SuccessType = SuccessNotificationCategory;

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
 * @param successDetails 成功の詳細情報
 * @param locale 言語（オプション）
 */
export const createSuccessNotificationConfig = (
  successDetails: SuccessDetails,
  locale?: string
): SuccessNotificationConfig => {
  const baseConfig = {
    type: "success" as const,
    category: successDetails.type,
    duration: 3000,
    severity: "medium" as const,
  };

  // 言語設定（デフォルトは日本語）
  const currentLocale = locale || "ja";

  // 成功の種類に応じて詳細設定
  switch (successDetails.type) {
    case "save":
      return {
        ...baseConfig,
        message: successDetails.item
          ? getNotificationMessage(
              { ja: `${successDetails.item}を保存しました`, en: `${successDetails.item} saved` },
              currentLocale
            )
          : getNotificationMessage(NOTIFICATION_MESSAGES.SUCCESS.SAVED, currentLocale),
        description: getNotificationMessage(
          NOTIFICATION_MESSAGES.SUCCESS.SAVE_DESCRIPTION,
          currentLocale
        ),
      };

    case "delete":
      return {
        ...baseConfig,
        message: successDetails.item
          ? getNotificationMessage(
              { ja: `${successDetails.item}を削除しました`, en: `${successDetails.item} deleted` },
              currentLocale
            )
          : getNotificationMessage(NOTIFICATION_MESSAGES.SUCCESS.DELETED, currentLocale),
        description: getNotificationMessage(
          NOTIFICATION_MESSAGES.SUCCESS.DELETE_DESCRIPTION,
          currentLocale
        ),
        duration: 4000,
      };

    case "update":
      return {
        ...baseConfig,
        message: successDetails.item
          ? getNotificationMessage(
              { ja: `${successDetails.item}を更新しました`, en: `${successDetails.item} updated` },
              currentLocale
            )
          : getNotificationMessage(NOTIFICATION_MESSAGES.SUCCESS.UPDATED, currentLocale),
        description: getNotificationMessage(
          NOTIFICATION_MESSAGES.SUCCESS.UPDATE_DESCRIPTION,
          currentLocale
        ),
      };

    case "create":
      return {
        ...baseConfig,
        message: successDetails.item
          ? getNotificationMessage(
              { ja: `${successDetails.item}を作成しました`, en: `${successDetails.item} created` },
              currentLocale
            )
          : getNotificationMessage(NOTIFICATION_MESSAGES.SUCCESS.CREATED, currentLocale),
        description: getNotificationMessage(
          NOTIFICATION_MESSAGES.SUCCESS.CREATE_DESCRIPTION,
          currentLocale
        ),
      };

    case "login":
      return {
        ...baseConfig,
        message: getNotificationMessage(NOTIFICATION_MESSAGES.SUCCESS.LOGGED_IN, currentLocale),
        description: getNotificationMessage(
          NOTIFICATION_MESSAGES.SUCCESS.LOGIN_DESCRIPTION,
          currentLocale
        ),
        duration: 4000,
      };

    case "auto-login":
      return {
        ...baseConfig,
        message: getNotificationMessage(NOTIFICATION_MESSAGES.SUCCESS.LOGGED_IN, currentLocale),
        description: getNotificationMessage(
          NOTIFICATION_MESSAGES.SUCCESS.AUTO_LOGIN_DESCRIPTION,
          currentLocale
        ),
        duration: 3000,
        severity: "low",
      };

    case "logout":
      return {
        ...baseConfig,
        message: getNotificationMessage(NOTIFICATION_MESSAGES.SUCCESS.LOGGED_OUT, currentLocale),
        description: getNotificationMessage(
          NOTIFICATION_MESSAGES.SUCCESS.LOGOUT_DESCRIPTION,
          currentLocale
        ),
        duration: 3000,
      };

    case "upload":
      return {
        ...baseConfig,
        message: successDetails.item
          ? getNotificationMessage(
              {
                ja: `${successDetails.item}をアップロードしました`,
                en: `${successDetails.item} uploaded`,
              },
              currentLocale
            )
          : getNotificationMessage(NOTIFICATION_MESSAGES.SUCCESS.UPLOADED, currentLocale),
        description: getNotificationMessage(
          NOTIFICATION_MESSAGES.SUCCESS.UPLOAD_DESCRIPTION,
          currentLocale
        ),
        duration: 4000,
      };

    case "download":
      return {
        ...baseConfig,
        message: successDetails.item
          ? getNotificationMessage(
              {
                ja: `${successDetails.item}をダウンロードしました`,
                en: `${successDetails.item} downloaded`,
              },
              currentLocale
            )
          : getNotificationMessage(NOTIFICATION_MESSAGES.SUCCESS.DOWNLOADED, currentLocale),
        description: getNotificationMessage(
          NOTIFICATION_MESSAGES.SUCCESS.DOWNLOAD_DESCRIPTION,
          currentLocale
        ),
        duration: 4000,
      };

    default:
      return {
        ...baseConfig,
        message: successDetails.message,
        description: getNotificationMessage(
          NOTIFICATION_MESSAGES.SUCCESS.DEFAULT_DESCRIPTION,
          currentLocale
        ),
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
  context?: Record<string, unknown>,
  locale?: string
) => {
  const successDetails: SuccessDetails = {
    type,
    message: message || "",
    item,
    context,
  };

  return createSuccessNotificationConfig(successDetails, locale);
};

/**
 * 認証成功ハンドラー
 */
export const authSuccessHandler = (provider?: string, locale?: string) => {
  const currentLocale = locale || "ja";
  const message = provider
    ? getNotificationMessage(
        { ja: `${provider}でログインしました`, en: `Logged in with ${provider}` },
        currentLocale
      )
    : getNotificationMessage(NOTIFICATION_MESSAGES.SUCCESS.LOGGED_IN, currentLocale);

  return globalSuccessHandler("login", message, undefined, undefined, locale);
};

/**
 * 自動ログイン成功ハンドラー
 */
export const autoLoginSuccessHandler = (locale?: string) => {
  return globalSuccessHandler("auto-login", undefined, undefined, undefined, locale);
};

/**
 * データ操作成功ハンドラー
 */
export const dataOperationSuccessHandler = (
  operation: "save" | "delete" | "update" | "create",
  item?: string,
  locale?: string
) => {
  return globalSuccessHandler(operation, undefined, item, undefined, locale);
};

/**
 * ファイル操作成功ハンドラー
 */
export const fileOperationSuccessHandler = (
  operation: "upload" | "download",
  filename?: string,
  locale?: string
) => {
  return globalSuccessHandler(operation, undefined, filename, undefined, locale);
};
