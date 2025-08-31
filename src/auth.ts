import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { sql } from "@/lib/neon";

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
          // ユーザーが既に存在するかチェック
          const existingUser = await sql`
            SELECT id FROM users WHERE email = ${user.email}
          `;

          let userId: string;

          if (existingUser.length === 0) {
            // 新規ユーザーの場合、usersテーブルに挿入
            const newUser = await sql`
              INSERT INTO users (email, name, avatar_url)
              VALUES (${user.email}, ${user.name}, ${user.image || "/assets/images/default-icon.png"})
              RETURNING id
            `;
            userId = newUser[0].id;
          } else {
            // 既存ユーザーの場合、IDを取得
            userId = existingUser[0].id;
          }

          // user_providersテーブルにOAuth情報を挿入または更新
          await sql`
            INSERT INTO user_providers (
              user_id, provider, provider_id, access_token, refresh_token, expires_at
            )
            VALUES (
              ${userId}, ${account.provider}, ${account.providerAccountId},
              ${account.access_token}, ${account.refresh_token},
              ${account.expires_at ? new Date(account.expires_at * 1000) : null}
            )
            ON CONFLICT (provider, provider_id)
            DO UPDATE SET
              access_token = EXCLUDED.access_token,
              refresh_token = EXCLUDED.refresh_token,
              expires_at = EXCLUDED.expires_at,
              updated_at = now()
          `;

          // userオブジェクトを更新
          Object.assign(user, {
            id: userId,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            expiresAt: account.expires_at,
          });
        } catch (error) {
          console.error("OAuth認証に失敗:", error);
          if (error instanceof Error) {
            console.error("エラー詳細:", error.message);
          }
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
          // ユーザー情報をデータベースから取得
          const userData = await sql`
            SELECT
              u.id, u.email, u.name, u.avatar_url,
              up.access_token, up.refresh_token, up.expires_at
            FROM users u
            LEFT JOIN user_providers up ON u.id = up.user_id
            WHERE u.email = ${user.email} AND up.provider = ${account.provider}
          `;

          if (userData.length > 0) {
            const userRow = userData[0];
            return {
              ...token,
              id: userRow.id,
              email: userRow.email,
              name: userRow.name,
              picture: userRow.avatar_url,
              accessToken: userRow.access_token,
              refreshToken: userRow.refresh_token,
              expiresAt: userRow.expires_at
                ? Math.floor(new Date(userRow.expires_at).getTime() / 1000)
                : undefined,
            };
          }
        } catch (error) {
          console.error("ユーザー情報の取得に失敗:", error);
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
          console.log("トークンの更新が必要です");
          return { ...token, error: "RefreshAccessTokenError" };
        } catch (error) {
          console.error("トークン更新エラー:", error);
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
