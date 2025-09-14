import { OAuthProviderValue } from "@/constants";
import { AuthProvider } from "@/types/auth";

/**
 * 認証プロバイダー
 */
export type AuthProviderType = OAuthProviderValue;

export interface AuthHookState {
  isLoading: boolean;
  error: string | null;
}

export interface AuthHookActions {
  handleProviderSignIn: (provider: AuthProvider) => Promise<void>;
  handleSignOut: () => Promise<void>;
}
