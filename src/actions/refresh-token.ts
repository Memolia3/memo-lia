"use server";

import { updateUserProviderTokens } from "@/actions/user";
import { refreshAccessToken } from "@/lib/auth/refresh-token";

/**
 * リフレッシュトークンアクションの結果型
 */
export interface RefreshTokenActionResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  error?: string;
}

/**
 * リフレッシュトークンを使用してアクセストークンを更新
 */
export async function refreshUserToken(
  userId: string,
  provider: string,
  refreshToken: string
): Promise<RefreshTokenActionResult> {
  try {
    // リフレッシュトークンを使用して新しいアクセストークンを取得
    const tokenData = await refreshAccessToken(provider, refreshToken);

    // データベースのトークン情報を更新
    const updatedProvider = await updateUserProviderTokens(
      userId,
      provider,
      tokenData.access_token,
      tokenData.refresh_token || refreshToken, // 新しいリフレッシュトークンがない場合は既存のものを使用
      tokenData.expires_in
    );

    if (!updatedProvider) {
      return {
        success: false,
        error: "Failed to update token in database",
      };
    }

    return {
      success: true,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || refreshToken,
      expiresAt: updatedProvider.expires_at
        ? Math.floor(new Date(updatedProvider.expires_at).getTime() / 1000)
        : undefined,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Token refresh failed:", error);
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Token refresh failed",
    };
  }
}

/**
 * トークンの有効性をチェック
 */
export async function checkTokenValidity(
  userId: string,
  provider: string,
  accessToken: string,
  expiresAt: number
): Promise<boolean> {
  try {
    // トークンの有効期限をチェック
    if (Date.now() >= expiresAt * 1000) {
      return false;
    }

    // プロバイダーに応じてトークンの有効性を検証
    switch (provider) {
      case "google": {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
        );
        return response.ok;
      }
      case "github": {
        const response = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return response.ok;
      }
      case "discord": {
        const response = await fetch("https://discord.com/api/users/@me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return response.ok;
      }
      default:
        return false;
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Token validation failed:", error);
    }
    return false;
  }
}
