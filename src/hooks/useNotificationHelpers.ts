"use client";

import {
  NOTIFICATION_DEFAULTS,
  NOTIFICATION_MESSAGES,
  NOTIFICATION_TYPES,
  getNotificationMessage,
} from "@/constants";
import { useNotificationStore } from "@/lib/notification/store";
import {
  ErrorNotificationConfig,
  NotificationConfig,
  SuccessNotificationConfig,
} from "@/types/notification";
import { useLocale } from "next-intl";
import { useCallback } from "react";

/**
 * 通知ヘルパーフック
 */
export const useNotificationHelpers = () => {
  const addNotification = useNotificationStore(state => state.addNotification);
  const locale = useLocale();

  // 成功通知を表示
  const showSuccess = useCallback(
    (config: SuccessNotificationConfig) => {
      return addNotification({
        duration: NOTIFICATION_DEFAULTS.SUCCESS.duration,
        severity: NOTIFICATION_DEFAULTS.SUCCESS.severity,
        ...config,
        type: NOTIFICATION_TYPES.SUCCESS,
      });
    },
    [addNotification]
  );

  // エラー通知を表示
  const showError = useCallback(
    (config: ErrorNotificationConfig) => {
      const errorMessage =
        config.error instanceof Error
          ? config.error.message
          : typeof config.error === "string"
            ? config.error
            : "不明なエラーが発生しました";

      const description =
        config.showStackTrace && config.error instanceof Error
          ? config.error.stack
          : config.description;

      return addNotification({
        duration: NOTIFICATION_DEFAULTS.ERROR.duration,
        severity: NOTIFICATION_DEFAULTS.ERROR.severity,
        closable: true,
        ...config,
        type: NOTIFICATION_TYPES.ERROR,
        message: config.message || errorMessage,
        description,
      });
    },
    [addNotification]
  );

  // 警告通知を表示
  const showWarning = useCallback(
    (config: Omit<NotificationConfig, "type">) => {
      return addNotification({
        type: "warning",
        duration: 6000,
        severity: "medium",
        ...config,
      });
    },
    [addNotification]
  );

  // 情報通知を表示
  const showInfo = useCallback(
    (config: Omit<NotificationConfig, "type">) => {
      return addNotification({
        type: "info",
        duration: 5000,
        severity: "low",
        ...config,
      });
    },
    [addNotification]
  );

  // 認証エラー通知を表示
  const showAuthError = useCallback(
    (error?: unknown) => {
      return showError({
        type: "error",
        category: "authentication",
        message: getNotificationMessage(NOTIFICATION_MESSAGES.AUTH.FAILED, locale),
        description: getNotificationMessage(NOTIFICATION_MESSAGES.AUTH.CHECK_CREDENTIALS, locale),
        error,
        showStackTrace: false,
      });
    },
    [showError, locale]
  );

  // ネットワークエラー通知を表示
  const showNetworkError = useCallback(
    (error?: unknown) => {
      return showError({
        type: "error",
        category: "network",
        message: getNotificationMessage(NOTIFICATION_MESSAGES.NETWORK.ERROR, locale),
        description: getNotificationMessage(NOTIFICATION_MESSAGES.NETWORK.CHECK_CONNECTION, locale),
        error,
        showStackTrace: false,
      });
    },
    [showError, locale]
  );

  // サーバーエラー通知を表示
  const showServerError = useCallback(
    (error?: unknown) => {
      return showError({
        type: "error",
        category: "server",
        message: getNotificationMessage(NOTIFICATION_MESSAGES.SERVER.ERROR, locale),
        description: getNotificationMessage(NOTIFICATION_MESSAGES.AUTH.RETRY_DESCRIPTION, locale),
        error,
        showStackTrace: false,
      });
    },
    [showError, locale]
  );

  // バリデーションエラー通知を表示
  const showValidationError = useCallback(
    (message: string, details?: string) => {
      return showError({
        type: "error",
        category: "validation",
        message,
        description: details,
        severity: "medium",
      });
    },
    [showError]
  );

  // 保存成功通知を表示
  const showSaveSuccess = useCallback(
    (item?: string) => {
      return showSuccess({
        type: "success",
        category: "save",
        message: item ? `${item}を保存しました` : "保存しました",
        duration: 3000,
      });
    },
    [showSuccess]
  );

  // 削除成功通知を表示
  const showDeleteSuccess = useCallback(
    (item?: string) => {
      return showSuccess({
        type: "success",
        category: "delete",
        message: item ? `${item}を削除しました` : "削除しました",
        duration: 3000,
      });
    },
    [showSuccess]
  );

  // 更新成功通知を表示
  const showUpdateSuccess = useCallback(
    (item?: string) => {
      return showSuccess({
        type: "success",
        category: "update",
        message: item ? `${item}を更新しました` : "更新しました",
        duration: 3000,
      });
    },
    [showSuccess]
  );

  // 作成成功通知を表示
  const showCreateSuccess = useCallback(
    (item?: string) => {
      return showSuccess({
        type: "success",
        category: "create",
        message: item ? `${item}を作成しました` : "作成しました",
        duration: 3000,
      });
    },
    [showSuccess]
  );

  // ログイン成功通知を表示
  const showLoginSuccess = useCallback(
    (provider?: string) => {
      return showSuccess({
        type: "success",
        category: "login",
        message: provider ? `${provider}でログインしました` : "ログインしました",
        duration: 3000,
      });
    },
    [showSuccess]
  );

  // ログアウト成功通知を表示
  const showLogoutSuccess = useCallback(() => {
    return showSuccess({
      type: "success",
      category: "logout",
      message: "ログアウトしました",
      duration: 3000,
    });
  }, [showSuccess]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showAuthError,
    showNetworkError,
    showServerError,
    showValidationError,
    showSaveSuccess,
    showDeleteSuccess,
    showUpdateSuccess,
    showCreateSuccess,
    showLoginSuccess,
    showLogoutSuccess,
  };
};
