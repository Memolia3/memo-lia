"use client";

import { useSession as useNextAuthSession } from "next-auth/react";

/**
 * セッション管理用のカスタムフック
 */
export const useSession = () => {
  const { data: session, status, update } = useNextAuthSession();

  return {
    session,
    status,
    update,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
};
