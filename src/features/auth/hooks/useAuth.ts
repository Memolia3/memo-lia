"use client";

import { signInWithDiscord, signInWithGitHub, signInWithGoogle } from "@/lib/nextauth/actions/auth";
import { useState } from "react";
import { AuthProvider } from "./useAuth.types";

/**
 * 認証処理用のカスタムフック
 */
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState<AuthProvider | null>(null);

  const handleProviderSignIn = async (provider: AuthProvider) => {
    setIsLoading(provider);
    try {
      const signInFunctions: Record<AuthProvider, () => Promise<void>> = {
        google: signInWithGoogle,
        github: signInWithGitHub,
        discord: signInWithDiscord,
      };
      await signInFunctions[provider]();
    } catch (error) {
      console.error("認証エラー:", error);
      setIsLoading(null);
    }
  };

  return {
    isLoading,
    handleProviderSignIn,
  };
};
