import { AUTH_PROVIDERS } from "@/constants";

/**
 * 認証プロバイダーのキー
 */
export type AuthProviderKey = (typeof AUTH_PROVIDERS)[number]["provider"];

/**
 * 認証プロバイダーの値
 */
export type AuthProviderValue = (typeof AUTH_PROVIDERS)[number]["value"];

/**
 * 認証プロバイダーの設定
 */
export interface ProviderConfig {
  icon: AuthProviderValue;
  bgColor: string;
  textColor: string;
  borderColor: string;
  shadow: string;
}

/**
 * 認証プロバイダーの完全な設定
 */
export interface AuthProviderConfig {
  key: AuthProviderKey;
  value: AuthProviderValue;
  provider: AuthProviderKey;
}
