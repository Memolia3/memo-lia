"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { useSession } from "@/features/auth/hooks";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { AuthGuardProps } from "./AuthGuard.types";

/**
 * 認証ガードコンポーネント
 * 認証が必要なページを保護します
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback,
  isSharePage = false,
}) => {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth");

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isSharePage) {
      // 現在のパスが/authでない場合のみリダイレクト
      if (typeof window !== "undefined" && !window.location.pathname.includes("/auth")) {
        router.push("/auth");
      }
    }
  }, [isAuthenticated, isLoading, router, isSharePage]);

  if (isLoading) {
    return (
      <Container className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <Typography variant="body" color="muted">
            {t("authenticating")}
          </Typography>
        </div>
      </Container>
    );
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (isSharePage) {
      return (
        <Container className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center max-w-md mx-auto">
            <Typography variant="h2" className="mb-4">
              {t("authRequired")}
            </Typography>
            <Typography variant="body" color="muted" className="mb-6">
              {t("safariBookmarkletMessage")}
            </Typography>

            <div className="space-y-3">
              <Button onClick={() => router.push(`/${locale}/auth`)} className="w-full">
                {t("loginButton")}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push(`/${locale}`)}
                className="w-full"
              >
                {t("backToTop")}
              </Button>
            </div>
          </div>
        </Container>
      );
    }

    return (
      <Container className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Typography variant="body" color="muted">
            {t("authRequired")}
          </Typography>
        </div>
      </Container>
    );
  }

  return <>{children}</>;
};
