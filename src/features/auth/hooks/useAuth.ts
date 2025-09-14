"use client";

import { signInWithDiscord, signInWithGitHub, signInWithGoogle } from "@/actions/auth";
import {
  ERROR_CONSTANTS,
  getNotificationMessage,
  NOTIFICATION_DEFAULTS,
  NOTIFICATION_MESSAGES,
  NOTIFICATION_TYPES,
} from "@/constants";
import { useNotificationHelpers } from "@/hooks/useNotificationHelpers";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { AuthProvider } from "./useAuth.types";

/**
 * 認証処理用のカスタムフック
 * ハイドレーションエラーを防ぐためにクライアントサイドでのみ状態を管理
 */
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState<AuthProvider | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { showSuccess, showError } = useNotificationHelpers();
  const locale = useLocale();

  // クライアントサイドでのみ状態を初期化
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleProviderSignIn = useCallback(
    async (provider: AuthProvider) => {
      if (!isClient) return;

      setIsLoading(provider);
      try {
        let result;
        switch (provider) {
          case "google":
            result = await signInWithGoogle();
            break;
          case "github":
            result = await signInWithGitHub();
            break;
          case "discord":
            result = await signInWithDiscord();
            break;
          default:
            throw new Error(
              `${getNotificationMessage(
                NOTIFICATION_MESSAGES.AUTH.UNSUPPORTED_PROVIDER,
                locale
              )}: ${provider}`
            );
        }

        // 通知を表示
        if (result && result.notification) {
          if (result.success) {
            showSuccess({
              type: NOTIFICATION_TYPES.SUCCESS,
              message: result.notification.message,
              description: result.notification.description,
              duration: result.notification.duration,
              severity: result.notification.severity,
              category: result.notification.category as
                | "save"
                | "delete"
                | "update"
                | "create"
                | "login"
                | "logout"
                | "upload"
                | "download"
                | "other",
            });
          } else {
            showError({
              type: NOTIFICATION_TYPES.ERROR,
              message: result.notification.message,
              description: result.notification.description,
              duration: result.notification.duration,
              severity: result.notification.severity,
              category: result.notification.category as
                | "network"
                | "validation"
                | "authentication"
                | "authorization"
                | "server"
                | "client"
                | "unknown",
            });
          }
        } else if (result && result.success) {
          // 通知設定がない場合でも成功時は通知を表示
          showSuccess({
            type: NOTIFICATION_TYPES.SUCCESS,
            message: getNotificationMessage(NOTIFICATION_MESSAGES.AUTH.SUCCESS, locale),
            category: NOTIFICATION_DEFAULTS.AUTH_SUCCESS.category,
          });
        }

        // 成功時はローディング状態をクリア
        setIsLoading(null);
      } catch (error) {
        // リダイレクトエラーの場合は正常な動作なので通知しない
        if (error instanceof Error && error.message === ERROR_CONSTANTS.NEXT_REDIRECT) {
          return;
        }

        // エラー通知を表示
        showError({
          type: NOTIFICATION_TYPES.ERROR,
          message: getNotificationMessage(NOTIFICATION_MESSAGES.AUTH.FAILED, locale),
          error,
          category: NOTIFICATION_DEFAULTS.AUTH_ERROR.category,
        });

        // エラーの場合はローディング状態をクリア
        setIsLoading(null);
      }
    },
    [isClient, showSuccess, showError, locale]
  );

  return {
    isLoading: isClient ? isLoading : null,
    handleProviderSignIn,
  };
};
