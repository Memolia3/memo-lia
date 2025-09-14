/**
 * リフレッシュトークン関連のユーティリティ
 */

import { OAUTH_PROVIDER } from "@/constants/auth";

/**
 * リフレッシュトークン結果の型定義
 */
export interface RefreshTokenResult {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

/**
 * Googleのリフレッシュトークンを使用してアクセストークンを更新
 */
export async function refreshGoogleToken(refreshToken: string): Promise<RefreshTokenResult> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(`Google token refresh failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * GitHubのリフレッシュトークンを使用してアクセストークンを更新
 */
export async function refreshGitHubToken(refreshToken: string): Promise<RefreshTokenResult> {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID!,
      client_secret: process.env.GITHUB_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub token refresh failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Discordのリフレッシュトークンを使用してアクセストークンを更新
 */
export async function refreshDiscordToken(refreshToken: string): Promise<RefreshTokenResult> {
  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(`Discord token refresh failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * プロバイダーに応じてリフレッシュトークンを実行
 */
export async function refreshAccessToken(
  provider: string,
  refreshToken: string
): Promise<RefreshTokenResult> {
  switch (provider) {
    case OAUTH_PROVIDER.GOOGLE:
      return refreshGoogleToken(refreshToken);
    case OAUTH_PROVIDER.GITHUB:
      return refreshGitHubToken(refreshToken);
    case OAUTH_PROVIDER.DISCORD:
      return refreshDiscordToken(refreshToken);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * トークンの有効期限をチェック
 */
export function isTokenExpired(expiresAt: number): boolean {
  return Date.now() >= expiresAt * 1000;
}

/**
 * 新しいトークンの有効期限を計算
 */
export function calculateExpiresAt(expiresIn: number): number {
  return Math.floor(Date.now() / 1000) + expiresIn;
}
