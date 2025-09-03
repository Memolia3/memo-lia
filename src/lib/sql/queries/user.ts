/**
 * ユーザー関連のSQLクエリ
 */

/**
 * ユーザーが存在するかチェックするクエリ
 */
export const CHECK_USER_EXISTS = `
  SELECT id, email, name, avatar_url, created_at, updated_at
  FROM users
  WHERE email = $1
`;

/**
 * 新規ユーザーを作成するクエリ
 */
export const CREATE_USER = `
  INSERT INTO users (email, name, avatar_url)
  VALUES ($1, $2, $3)
  RETURNING id, email, name, avatar_url, created_at, updated_at
`;

/**
 * ユーザー情報を更新するクエリ
 */
export const UPDATE_USER = `
  UPDATE users
  SET
    name = COALESCE($2, name),
    avatar_url = COALESCE($3, avatar_url),
    updated_at = now()
  WHERE id = $1
  RETURNING id, email, name, avatar_url, created_at, updated_at
`;

/**
 * ユーザー情報を取得するクエリ（ID指定）
 */
export const GET_USER_BY_ID = `
  SELECT id, email, name, avatar_url, created_at, updated_at
  FROM users
  WHERE id = $1
`;

/**
 * ユーザー情報を取得するクエリ（メール指定）
 */
export const GET_USER_BY_EMAIL = `
  SELECT id, email, name, avatar_url, created_at, updated_at
  FROM users
  WHERE email = $1
`;

/**
 * ユーザーを削除するクエリ
 */
export const DELETE_USER = `
  DELETE FROM users
  WHERE id = $1
`;
