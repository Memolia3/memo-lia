"use client";

import { useNotificationStore } from "@/lib/notification/store";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { useNotificationHelpers } from "./useNotificationHelpers";

/**
 * 非同期操作の状態
 */
interface AsyncOperationState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * 非同期操作のオプション
 */
interface AsyncOperationOptions {
  /** 成功時の通知メッセージ */
  successMessage?: string;
  /** エラー時の通知メッセージ */
  errorMessage?: string;
  /** ローディング中の通知を表示するか */
  showLoadingNotification?: boolean;
  /** エラー通知を表示するか */
  showErrorNotification?: boolean;
  /** 成功通知を表示するか */
  showSuccessNotification?: boolean;
  /** エラーの詳細を表示するか */
  showErrorDetails?: boolean;
}

/**
 * 非同期操作フック
 */
export const useAsyncOperation = <T = unknown>(options: AsyncOperationOptions = {}) => {
  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { showSuccess, showError, showInfo } = useNotificationHelpers();
  const removeNotification = useNotificationStore(state => state.removeNotification);
  const t = useTranslations("notifications");

  /**
   * 非同期操作を実行
   */
  const execute = useCallback(
    async (operation: () => Promise<T>, customOptions?: Partial<AsyncOperationOptions>) => {
      const opts = {
        successMessage: options.successMessage,
        errorMessage: options.errorMessage,
        showLoadingNotification: options.showLoadingNotification ?? false,
        showErrorNotification: options.showErrorNotification ?? true,
        showSuccessNotification: options.showSuccessNotification ?? true,
        showErrorDetails: options.showErrorDetails ?? false,
        ...customOptions,
      };

      setState(prev => ({ ...prev, loading: true, error: null }));

      // ローディング通知を表示
      let loadingNotificationId: string | undefined;
      if (opts.showLoadingNotification) {
        loadingNotificationId = showInfo({
          message: t("processing"),
          duration: 0,
          closable: false,
        });
      }

      try {
        const result = await operation();

        setState({
          data: result,
          loading: false,
          error: null,
        });

        // ローディング通知を削除
        if (loadingNotificationId) {
          removeNotification(loadingNotificationId);
        }

        // 成功通知を表示
        if (opts.showSuccessNotification && opts.successMessage) {
          showSuccess({
            type: "success",
            message: opts.successMessage,
            duration: 3000,
          });
        }

        return result;
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));

        setState({
          data: null,
          loading: false,
          error: errorObj,
        });

        // ローディング通知を削除
        if (loadingNotificationId) {
          removeNotification(loadingNotificationId);
        }

        // エラー通知を表示
        if (opts.showErrorNotification) {
          showError({
            type: "error",
            message: opts.errorMessage || errorObj.message,
            error: opts.showErrorDetails ? errorObj : undefined,
            showStackTrace: opts.showErrorDetails,
          });
        }

        throw error;
      }
    },
    [options, showSuccess, showError, showInfo, removeNotification, t]
  );

  /**
   * 状態をリセット
   */
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};
