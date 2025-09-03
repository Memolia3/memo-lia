import { sql } from "@/lib/neon";

/**
 * ユーザーデータの型定義
 */
export interface UserData {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * ユーザーが存在するかチェック
 */
export async function checkUserExists(email: string): Promise<UserData | null> {
  try {
    const result = await sql`
      SELECT id, email, name, avatar_url, created_at, updated_at
      FROM users
      WHERE email = ${email}
    `;
    return result.length > 0 ? (result[0] as UserData) : null;
  } catch {
    throw new Error("ユーザー存在チェックに失敗しました");
  }
}

/**
 * 新規ユーザーを作成
 */
export async function createUser(
  email: string,
  name?: string,
  avatar_url?: string
): Promise<UserData> {
  try {
    const result = await sql`
      INSERT INTO users (email, name, avatar_url)
      VALUES (${email}, ${name || null}, ${avatar_url || null})
      RETURNING id, email, name, avatar_url, created_at, updated_at
    `;
    return result[0] as UserData;
  } catch {
    throw new Error("ユーザー作成に失敗しました");
  }
}

/**
 * ユーザー情報を更新
 */
export async function updateUser(
  userId: string,
  name?: string,
  avatar_url?: string
): Promise<UserData> {
  try {
    const result = await sql`
      UPDATE users
      SET
        name = COALESCE(${name || null}, name),
        avatar_url = COALESCE(${avatar_url || null}, avatar_url),
        updated_at = now()
      WHERE id = ${userId}
      RETURNING id, email, name, avatar_url, created_at, updated_at
    `;
    return result[0] as UserData;
  } catch {
    throw new Error("ユーザー更新に失敗しました");
  }
}

/**
 * IDでユーザー情報を取得
 */
export async function getUserById(userId: string): Promise<UserData | null> {
  try {
    const result = await sql`
      SELECT id, email, name, avatar_url, created_at, updated_at
      FROM users
      WHERE id = ${userId}
    `;
    return result.length > 0 ? (result[0] as UserData) : null;
  } catch {
    throw new Error("ユーザー情報の取得に失敗しました");
  }
}

/**
 * メールアドレスでユーザー情報を取得
 */
export async function getUserByEmail(email: string): Promise<UserData | null> {
  try {
    const result = await sql`
      SELECT id, email, name, avatar_url, created_at, updated_at
      FROM users
      WHERE email = ${email}
    `;
    return result.length > 0 ? (result[0] as UserData) : null;
  } catch {
    throw new Error("ユーザー情報の取得に失敗しました");
  }
}

/**
 * ユーザーを削除
 */
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM users
      WHERE id = ${userId}
    `;
    return result.length > 0;
  } catch {
    throw new Error("ユーザー削除に失敗しました");
  }
}
