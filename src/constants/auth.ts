/**
 * OAuthプロバイダー
 */
export const OAUTH_PROVIDER = {
  GOOGLE: "google",
  GITHUB: "github",
  DISCORD: "discord",
} as const;

/**
 * OAuthプロバイダーの値の型
 */
export type OAuthProviderValue = (typeof OAUTH_PROVIDER)[keyof typeof OAUTH_PROVIDER];

/**
 * 認証プロバイダーの設定
 */
export const AUTH_PROVIDERS = [
  {
    key: "GOOGLE" as const,
    value: OAUTH_PROVIDER.GOOGLE,
    provider: "GOOGLE" as const,
  },
  {
    key: "GITHUB" as const,
    value: OAUTH_PROVIDER.GITHUB,
    provider: "GITHUB" as const,
  },
  {
    key: "DISCORD" as const,
    value: OAUTH_PROVIDER.DISCORD,
    provider: "DISCORD" as const,
  },
] as const;

/**
 * ルート
 */
export const ROUTE = {
  TOP: "/",
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
} as const;
