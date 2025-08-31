"use client";

import { useSession as useNextAuthSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * セッション管理用のカスタムフック
 */
export const useSession = () => {
  const { data: session, status, update } = useNextAuthSession();
  const router = useRouter();

  // 認証が必要なページでのリダイレクト処理
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  return {
    session,
    status,
    update,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
};
