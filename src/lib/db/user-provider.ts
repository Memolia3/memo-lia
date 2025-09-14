import { sql } from "@/lib/neon";
import { Account } from "next-auth";

/**
 * ユーザープロバイダーデータの型定義
 */
export interface UserProviderData {
  id: string;
  user_id: string;
  provider: string;
  provider_id: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: Date;
  created_at: Date;
  updated_at: Date;
}

/**
 * ユーザーとプロバイダー情報の結合データの型定義
 */
export interface UserWithProviderData {
  user: {
    id: string;
    email: string;
    name?: string;
    avatar_url?: string;
    created_at: Date;
    updated_at: Date;
  };
  provider: UserProviderData;
}

/**
 * ユーザープロバイダー情報を取得
 */
export async function getUserProvider(
  userId: string,
  provider: string
): Promise<UserProviderData | null> {
  try {
    const result = await sql`
      SELECT id, user_id, provider, provider_id, access_token, refresh_token,
             expires_at, created_at, updated_at
      FROM user_providers
      WHERE user_id = ${userId} AND provider = ${provider}
    `;
    return result.length > 0 ? (result[0] as UserProviderData) : null;
  } catch {
    throw new Error("ユーザープロバイダー情報の取得に失敗しました");
  }
}

/**
 * ユーザープロバイダー情報を作成または更新
 */
export async function upsertUserProvider(
  userId: string,
  account: Account
): Promise<UserProviderData> {
  try {
    const expiresAt = account.expires_at ? new Date(account.expires_at * 1000) : null;
    const result = await sql`
      INSERT INTO user_providers (
        user_id, provider, provider_id, access_token, refresh_token, expires_at
      )
      VALUES (
        ${userId},
        ${account.provider},
        ${account.providerAccountId},
        ${account.access_token || null},
        ${account.refresh_token || null},
        ${expiresAt}
      )
      ON CONFLICT (provider, provider_id)
      DO UPDATE SET
        access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token,
        expires_at = EXCLUDED.expires_at,
        updated_at = now()
      RETURNING id, user_id, provider, provider_id, access_token, refresh_token,
                expires_at, created_at, updated_at
    `;
    return result[0] as UserProviderData;
  } catch {
    throw new Error("ユーザープロバイダー情報の更新に失敗しました");
  }
}

/**
 * ユーザーとプロバイダー情報を結合して取得（セッション用）
 */
export async function getUserWithProvider(
  email: string,
  provider: string
): Promise<UserWithProviderData | null> {
  try {
    const result = await sql`
      SELECT
        u.id, u.email, u.name, u.avatar_url, u.created_at, u.updated_at,
        up.id as provider_id, up.user_id, up.provider, up.provider_id,
        up.access_token, up.refresh_token, up.expires_at,
        up.created_at as provider_created_at, up.updated_at as provider_updated_at
      FROM users u
      LEFT JOIN user_providers up ON u.id = up.user_id
      WHERE u.email = ${email} AND up.provider = ${provider}
    `;

    if (result.length === 0) {
      return null;
    }

    const row = result[0];

    const user = {
      id: row.id,
      email: row.email,
      name: row.name,
      avatar_url: row.avatar_url,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };

    const providerData: UserProviderData = {
      id: row.provider_id,
      user_id: row.user_id,
      provider: row.provider,
      provider_id: row.provider_id,
      access_token: row.access_token,
      refresh_token: row.refresh_token,
      expires_at: row.expires_at,
      created_at: row.provider_created_at,
      updated_at: row.provider_updated_at,
    };

    return { user, provider: providerData };
  } catch {
    throw new Error("ユーザー情報の取得に失敗しました");
  }
}

/**
 * プロバイダー情報を更新
 */
export async function updateUserProvider(
  userId: string,
  provider: string,
  accessToken?: string,
  refreshToken?: string,
  expiresAt?: Date
): Promise<UserProviderData | null> {
  try {
    const result = await sql`
      UPDATE user_providers
      SET
        access_token = ${accessToken || null},
        refresh_token = ${refreshToken || null},
        expires_at = ${expiresAt || null},
        updated_at = now()
      WHERE user_id = ${userId} AND provider = ${provider}
      RETURNING id, user_id, provider, provider_id, access_token, refresh_token,
                expires_at, created_at, updated_at
    `;
    return result.length > 0 ? (result[0] as UserProviderData) : null;
  } catch {
    throw new Error("プロバイダー情報の更新に失敗しました");
  }
}

/**
 * プロバイダー情報を削除
 */
export async function deleteUserProvider(userId: string, provider: string): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM user_providers
      WHERE user_id = ${userId} AND provider = ${provider}
    `;
    return result.length > 0;
  } catch {
    throw new Error("プロバイダー情報の削除に失敗しました");
  }
}
