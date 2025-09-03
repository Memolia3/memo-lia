/**
 * ユーザープロバイダー関連のSQLクエリ
 */

/**
 * ユーザープロバイダー情報を取得するクエリ
 */
export const GET_USER_PROVIDER = `
  SELECT id, user_id, provider, provider_id, access_token, refresh_token, expires_at, created_at, updated_at
  FROM user_providers
  WHERE user_id = $1 AND provider = $2
`;

/**
 * ユーザープロバイダー情報を作成または更新するクエリ
 */
export const UPSERT_USER_PROVIDER = `
  INSERT INTO user_providers (
    user_id, provider, provider_id, access_token, refresh_token, expires_at
  )
  VALUES ($1, $2, $3, $4, $5, $6)
  ON CONFLICT (provider, provider_id)
  DO UPDATE SET
    access_token = EXCLUDED.access_token,
    refresh_token = EXCLUDED.refresh_token,
    expires_at = EXCLUDED.expires_at,
    updated_at = now()
  RETURNING id, user_id, provider, provider_id, access_token, refresh_token, expires_at, created_at, updated_at
`;

/**
 * ユーザーとプロバイダー情報を結合して取得するクエリ（セッション用）
 */
export const GET_USER_WITH_PROVIDER = `
  SELECT
    u.id, u.email, u.name, u.avatar_url, u.created_at, u.updated_at,
    up.id as provider_id, up.user_id, up.provider, up.provider_id,
    up.access_token, up.refresh_token, up.expires_at,
    up.created_at as provider_created_at, up.updated_at as provider_updated_at
  FROM users u
  LEFT JOIN user_providers up ON u.id = up.user_id
  WHERE u.email = $1 AND up.provider = $2
`;

/**
 * プロバイダー情報を更新するクエリ
 */
export const UPDATE_USER_PROVIDER = `
  UPDATE user_providers
  SET
    access_token = $3,
    refresh_token = $4,
    expires_at = $5,
    updated_at = now()
  WHERE user_id = $1 AND provider = $2
  RETURNING id, user_id, provider, provider_id, access_token, refresh_token, expires_at, created_at, updated_at
`;

/**
 * プロバイダー情報を削除するクエリ
 */
export const DELETE_USER_PROVIDER = `
  DELETE FROM user_providers
  WHERE user_id = $1 AND provider = $2
`;
