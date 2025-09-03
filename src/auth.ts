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
    maxAge: 14 * 24 * 60 * 60, // 14 days
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
              accessToken: userData.provider.access_token,
              refreshToken: userData.provider.refresh_token,
              expiresAt: userData.provider.expires_at
                ? Math.floor(new Date(userData.provider.expires_at).getTime() / 1000)
                : undefined,
            };
          }
        } catch {
          // ユーザー情報の取得に失敗
        }
      }

      // トークンの有効期限チェック
      if (token.expiresAt && Date.now() >= Number(token.expiresAt) * 1000) {
        if (!token.refreshToken) {
          return { ...token, error: "RefreshAccessTokenError" };
        }

        try {
          // リフレッシュトークンを使用して新しいアクセストークンを取得
          // ここではOAuthプロバイダーに直接リクエストする必要があります
          // 実装は各プロバイダーによって異なります
          return { ...token, error: "RefreshAccessTokenError" };
        } catch {
          return { ...token, error: "RefreshAccessTokenError" };
        }
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
      };
    },
  },
});
