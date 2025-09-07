"use server";

import {
  checkUserExists as dbCheckUserExists,
  createUser as dbCreateUser,
  getUserProvider as dbGetUserProvider,
  getUserWithProvider as dbGetUserWithProvider,
  updateUser as dbUpdateUser,
  updateUserProvider as dbUpdateUserProvider,
  upsertUserProvider as dbUpsertUserProvider,
  type UserData,
  type UserProviderData,
} from "@/lib/db";
import { Account } from "next-auth";

// 型定義はデータベースアクセス層から再エクスポート
export type { UserData, UserProviderData } from "@/lib/db";

/**
 * ユーザーが存在するかチェック
 */
export async function checkUserExists(email: string): Promise<UserData | null> {
  return dbCheckUserExists(email);
}

/**
 * 新規ユーザーを作成
 */
export async function createUser(
  email: string,
  name?: string,
  avatar_url?: string
): Promise<UserData> {
  return dbCreateUser(email, name, avatar_url);
}

/**
 * ユーザー情報を更新
 */
export async function updateUser(
  userId: string,
  name?: string,
  avatar_url?: string
): Promise<UserData> {
  return dbUpdateUser(userId, name, avatar_url);
}

/**
 * ユーザープロバイダー情報を取得
 */
export async function getUserProvider(
  userId: string,
  provider: string
): Promise<UserProviderData | null> {
  return dbGetUserProvider(userId, provider);
}

/**
 * ユーザープロバイダー情報を作成または更新
 */
export async function upsertUserProvider(
  userId: string,
  account: Account
): Promise<UserProviderData> {
  return dbUpsertUserProvider(userId, account);
}

/**
 * 認証時のユーザー情報を同期（メイン関数）
 */
export async function syncUserOnAuth(
  email: string,
  name?: string,
  avatar_url?: string,
  account?: Account
): Promise<{ user: UserData; provider?: UserProviderData }> {
  try {
    // ユーザーが存在するかチェック
    let user = await checkUserExists(email);

    if (!user) {
      // 新規ユーザーを作成
      user = await createUser(email, name, avatar_url);
    } else {
      // 既存ユーザーの情報を更新（必要に応じて）
      if (name || avatar_url) {
        user = await updateUser(user.id, name, avatar_url);
      }
    }

    let provider: UserProviderData | undefined;

    // アカウント情報がある場合、プロバイダー情報も更新
    if (account) {
      provider = await upsertUserProvider(user.id, account);
    }

    return { user, provider };
  } catch {
    throw new Error("認証処理に失敗しました");
  }
}

/**
 * ユーザー情報を取得（セッション用）
 */
export async function getUserForSession(
  email: string,
  provider: string
): Promise<{ user: UserData; provider: UserProviderData } | null> {
  return dbGetUserWithProvider(email, provider);
}

/**
 * ユーザープロバイダーのトークン情報を更新
 */
export const updateUserProviderTokens = async (
  userId: string,
  provider: string,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
): Promise<UserProviderData | null> => {
  try {
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    return await dbUpdateUserProvider(userId, provider, accessToken, refreshToken, expiresAt);
  } catch (error) {
    // エラーログは本番環境では適切なログサービスを使用
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Error updating user provider tokens:", error);
    }
    return null;
  }
};
