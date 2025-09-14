/**
 * 認証関連の型定義
 */

// NextAuth拡張型
export interface ExtendedSession {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  error?: "RefreshAccessTokenError";
  autoLoginSuccess?: boolean;
}

export interface ExtendedUser {
  id?: string;
  provider?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface ExtendedJWT {
  id?: string;
  provider?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  error?: "RefreshAccessTokenError";
  autoLoginSuccess?: boolean;
}

// 認証プロバイダー関連
export type AuthProvider = "google" | "github" | "discord";

export interface AuthProviderConfig {
  id: string;
  name: string;
  type: AuthProvider;
}

export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name?: string;
    image?: string;
  };
  error?: string;
  redirectTo?: string;
}

// 認証フック関連
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: ExtendedUser | null;
  session: ExtendedSession | null;
}

export interface AuthActions {
  signIn: (provider: AuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

// 認証ガード関連
export interface AuthGuardProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string | null;
  children: React.ReactNode;
  className?: string;
  loadingMessage?: string;
  unauthenticatedMessage?: string;
  errorMessage?: string;
  errorSubMessage?: string;
}
