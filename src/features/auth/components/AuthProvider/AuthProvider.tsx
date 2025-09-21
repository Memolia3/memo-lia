"use client";

import { useAutoLoginNotification } from "@/hooks";
import { SessionProvider } from "next-auth/react";
import { AuthProviderProps } from "./AuthProvider.types";

/**
 * 認証プロバイダーコンポーネント
 * NextAuth.jsのSessionProviderをラップします
 * ハイドレーションエラーを防ぐためにrefetchIntervalを設定
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <SessionProvider
      refetchInterval={0} // セッション再取得を無効化（手動で管理）
      refetchOnWindowFocus={false} // ウィンドウフォーカス時の再取得を無効化
    >
      <AuthNotificationHandler />
      {children}
    </SessionProvider>
  );
};

/**
 * 認証通知ハンドラーコンポーネント
 * 自動ログイン通知を管理
 */
const AuthNotificationHandler: React.FC = () => {
  useAutoLoginNotification();
  return null;
};
