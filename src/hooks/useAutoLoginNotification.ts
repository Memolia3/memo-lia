"use client";

import { useNotification } from "@/components/notification/NotificationProvider";
import { autoLoginSuccessHandler } from "@/lib/success-handler";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

/**
 * 自動ログイン通知フック
 * セッション情報が更新されて自動ログインが成功した場合に通知を表示
 */
export const useAutoLoginNotification = () => {
  const { data: session, status } = useSession();
  const { addNotification } = useNotification();
  const hasShownNotification = useRef(false);

  // ブラウザの言語設定から言語を取得（next-intlコンテキストに依存しない）
  const getCurrentLocale = () => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      // URLパスから言語を抽出（例: /en/dashboard -> en, /ja/dashboard -> ja）
      const localeMatch = pathname.match(/^\/([a-z]{2})\//);
      return localeMatch ? localeMatch[1] : "ja"; // デフォルトは日本語
    }
    return "ja";
  };

  useEffect(() => {
    // デバッグ用ログ
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("useAutoLoginNotification - Status:", status);
      // eslint-disable-next-line no-console
      console.log("useAutoLoginNotification - Session:", session);
      // eslint-disable-next-line no-console
      console.log("useAutoLoginNotification - autoLoginSuccess:", session?.autoLoginSuccess);
      // eslint-disable-next-line no-console
      console.log("useAutoLoginNotification - hasShownNotification:", hasShownNotification.current);
    }

    // セッションが読み込まれ、認証済みの場合
    if (status === "authenticated" && !hasShownNotification.current) {
      // 通知設定を取得（言語設定を渡す）
      const currentLocale = getCurrentLocale();
      const notificationConfig = autoLoginSuccessHandler(currentLocale);

      // 通知を表示
      addNotification(notificationConfig);

      // フラグを立てて重複表示を防ぐ
      hasShownNotification.current = true;

      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log("Auto-login notification displayed:", notificationConfig);
      }
    }
  }, [session, status, addNotification]);

  // セッションが無効になったらフラグをリセット
  useEffect(() => {
    if (status === "unauthenticated") {
      hasShownNotification.current = false;
    }
  }, [status]);
};
