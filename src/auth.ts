import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { getUserForSession, syncUserOnAuth } from "@/actions/user";

import type { Session } from "next-auth";

export const { auth, handlers, signIn, signOut } = NextAuth({
  // 信頼できるホストを設定
  trustHost: true,
  // セッション設定
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day (セキュリティ向上のため短縮)
  },
  // ページ設定
  pages: {
    signIn: "/auth",
    signOut: "/",
    error: "/auth",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  events: {
    // サインイン時
    async signIn({ user, account }) {
      if (account && user.email) {
        try {
          // サーバアクションを使用してユーザー情報を同期
          const { user: userData, provider } = await syncUserOnAuth(
            user.email,
            user.name || undefined,
            user.image || undefined,
            account
          );

          // userオブジェクトを更新
          Object.assign(user, {
            id: userData.id,
            provider: account.provider,
            accessToken: provider?.access_token,
            refreshToken: provider?.refresh_token,
            expiresAt: provider?.expires_at
              ? Math.floor(new Date(provider.expires_at).getTime() / 1000)
              : undefined,
          });
        } catch {
          // エラーが発生した場合は認証を拒否
          throw new Error("認証処理に失敗しました");
        }
      }
    },
    // サインアウト時
    async signOut() {
      // クライアントサイドの情報をクリア
      if (typeof window !== "undefined") {
        window.sessionStorage.clear();
        window.localStorage.clear();
      }
    },
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === "update") {
        return {
          ...token,
          ...session.user,
        };
      }

      // 初回サインイン時またはユーザー情報更新時
      if (account && user) {
        try {
          // サーバアクションを使用してユーザー情報を取得
          const userData = await getUserForSession(user.email!, account.provider);

          if (userData) {
            return {
              ...token,
              id: userData.user.id,
              email: userData.user.email,
              name: userData.user.name,
              picture: userData.user.avatar_url,
              provider: account.provider,
              accessToken: userData.provider.access_token,
              refreshToken: userData.provider.refresh_token,
              expiresAt: userData.provider.expires_at
                ? Math.floor(new Date(userData.provider.expires_at).getTime() / 1000)
                : undefined,
            };
          } else {
            // ユーザー情報が見つからない場合、同期処理を実行
            try {
              const { user: syncedUser, provider: syncedProvider } = await syncUserOnAuth(
                user.email!,
                user.name || undefined,
                user.image || undefined,
                account
              );

              return {
                ...token,
                id: syncedUser.id,
                email: syncedUser.email,
                name: syncedUser.name,
                picture: syncedUser.avatar_url,
                provider: account.provider,
                accessToken: syncedProvider?.access_token,
                refreshToken: syncedProvider?.refresh_token,
                expiresAt: syncedProvider?.expires_at
                  ? Math.floor(new Date(syncedProvider.expires_at).getTime() / 1000)
                  : undefined,
              };
            } catch {
              // 同期処理も失敗した場合は、基本的な情報のみを返す
              return {
                ...token,
                id: user.id,
                email: user.email,
                name: user.name,
                picture: user.image,
                provider: account.provider,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                expiresAt: account.expires_at,
              };
            }
          }
        } catch {
          // ユーザー情報の取得に失敗した場合、基本的な情報のみを返す
          return {
            ...token,
            id: user.id,
            email: user.email,
            name: user.name,
            picture: user.image,
            provider: account.provider,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            expiresAt: account.expires_at,
          };
        }
      }

      // トークンの有効期限チェック
      if (token.expiresAt && Date.now() >= Number(token.expiresAt) * 1000) {
        if (!token.refreshToken) {
          return { ...token, error: "RefreshAccessTokenError" };
        }

        try {
          // リフレッシュトークンを使用して新しいアクセストークンを取得
          const { refreshAccessToken } = await import("@/lib/auth/refresh-token");
          const { updateUserProviderTokens } = await import("@/actions/user");

          const tokenData = await refreshAccessToken(
            token.provider as string,
            token.refreshToken as string
          );

          // データベースのトークン情報を更新
          await updateUserProviderTokens(
            token.id as string,
            token.provider as string,
            tokenData.access_token,
            tokenData.refresh_token || (token.refreshToken as string),
            tokenData.expires_in
          );

          return {
            ...token,
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token || token.refreshToken,
            expiresAt: Math.floor(Date.now() / 1000) + tokenData.expires_in,
            error: undefined,
            // 自動ログイン成功フラグを追加（リフレッシュ時のみ）
            autoLoginSuccess: true,
          };
        } catch {
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }

      // 既存のトークンが有効な場合、autoLoginSuccessフラグをクリア
      if (token.autoLoginSuccess) {
        return {
          ...token,
          autoLoginSuccess: undefined,
        };
      }

      return token;
    },

    /**
     * セッション情報を更新
     */
    async session({ session, token }): Promise<Session> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id?.toString() ?? undefined,
          name: token.name ?? undefined,
          email: token.email ?? undefined,
          image: token.picture ?? undefined,
        },
        accessToken: token.accessToken as string | undefined,
        refreshToken: token.refreshToken as string | undefined,
        expiresAt: token.expiresAt as number | undefined,
        error: token.error as "RefreshAccessTokenError" | undefined,
        autoLoginSuccess: token.autoLoginSuccess as boolean | undefined,
      };
    },
  },
});
