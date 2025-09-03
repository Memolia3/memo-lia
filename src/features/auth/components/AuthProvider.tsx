"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 認証プロバイダーコンポーネント
 * NextAuth.jsのSessionProviderをラップします
 * ハイドレーションエラーを防ぐためにrefetchIntervalを設定
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // 5分ごとにセッションを再取得
      refetchOnWindowFocus={false} // ウィンドウフォーカス時の再取得を無効化
    >
      {children}
    </SessionProvider>
  );
};
