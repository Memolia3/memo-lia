"use client";

import { Container } from "@/components/ui";
import { useSession } from "@/features/auth/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 認証ガードコンポーネント
 * 認証が必要なページを保護します
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <Container className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">認証中...</p>
        </div>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <Container className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted">認証が必要です</p>
        </div>
      </Container>
    );
  }

  return <>{children}</>;
};
