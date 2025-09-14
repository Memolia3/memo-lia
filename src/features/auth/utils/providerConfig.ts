import { AUTH_PROVIDERS } from "@/constants";
import { AuthProviderKey, ProviderConfig } from "./providerConfig.types";

/**
 * プロバイダー固有のスタイル設定
 */
const PROVIDER_STYLES: Record<AuthProviderKey, Omit<ProviderConfig, "icon">> = {
  GOOGLE: {
    bgColor: "bg-white hover:bg-gray-100",
    textColor: "text-gray-700",
    borderColor: "border-gray-300 hover:border-gray-400",
    shadow: "shadow-sm hover:shadow-md",
  },
  GITHUB: {
    bgColor: "bg-white hover:bg-gray-100",
    textColor: "text-gray-700",
    borderColor: "border-gray-300 hover:border-gray-400",
    shadow: "shadow-sm hover:shadow-md",
  },
  DISCORD: {
    bgColor: "bg-white hover:bg-gray-100",
    textColor: "text-gray-700",
    borderColor: "border-gray-300 hover:border-gray-400",
    shadow: "shadow-sm hover:shadow-md",
  },
};

/**
 * 認証プロバイダーの設定を取得
 */
export const getProviderConfig = (provider: AuthProviderKey): ProviderConfig => {
  const providerData = AUTH_PROVIDERS.find(p => p.provider === provider);
  if (!providerData) {
    throw new Error(`Unknown provider: ${provider}`);
  }

  return {
    icon: providerData.value,
    ...PROVIDER_STYLES[provider],
  };
};

/**
 * すべてのプロバイダー設定を取得
 */
export const getAllProviderConfigs = () => {
  return AUTH_PROVIDERS.map(provider => ({
    ...provider,
    config: getProviderConfig(provider.provider),
  }));
};

/**
 * プロバイダーが有効かチェック
 */
export const isValidProvider = (provider: string): provider is AuthProviderKey => {
  return AUTH_PROVIDERS.some(p => p.provider === provider);
};
