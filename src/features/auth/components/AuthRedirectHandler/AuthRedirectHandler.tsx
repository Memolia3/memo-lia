"use client";

import { ROUTE } from "@/constants";
import { useSession } from "@/features/auth/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * 認証リダイレクトハンドラーコンポーネント
 * 認証済みユーザーをダッシュボードに自動リダイレクト
 */
export const AuthRedirectHandler: React.FC = () => {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    // ローディング中は何もしない
    if (isLoading) return;

    // 認証済みの場合はダッシュボードにリダイレクト
    if (isAuthenticated) {
      router.push(ROUTE.DASHBOARD);
    }
  }, [isAuthenticated, isLoading, router]);

  // このコンポーネントはUIを表示しない
  return null;
};
