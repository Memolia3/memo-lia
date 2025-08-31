"use server";

import { signIn } from "@/auth";
import { OAUTH_PROVIDER, ROUTE } from "@/constants";

/**
 * Google認証を行う
 * @returns 認証成功時にはリダイレクト先のパスを返す
 */
export const signInWithGoogle = async (): Promise<void> => {
  await signIn(OAUTH_PROVIDER.GOOGLE, {
    redirectTo: ROUTE.TOP,
  });
};

/**
 * GitHub認証を行う
 * @returns 認証成功時にはリダイレクト先のパスを返す
 */
export const signInWithGitHub = async (): Promise<void> => {
  await signIn(OAUTH_PROVIDER.GITHUB, {
    redirectTo: ROUTE.TOP,
  });
};

/**
 * Discord認証を行う
 * @returns 認証成功時にはリダイレクト先のパスを返す
 */
export const signInWithDiscord = async (): Promise<void> => {
  await signIn(OAUTH_PROVIDER.DISCORD, {
    redirectTo: ROUTE.TOP,
  });
};
