"use client";

import { Container, Loading } from "@/components/ui";
import { Button } from "@/components/ui/Button";
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
    if (!isLoading && !isAuthenticated) {
      if (!isSharePage) {
        // 通常ページ: 即座にリダイレクト
        if (typeof window !== "undefined" && !window.location.pathname.includes("/auth")) {
          router.push("/auth");
        }
      } else {
        // 共有ページ: 3秒後にリダイレクト
        const timer = setTimeout(() => {
          const callbackUrl =
            typeof window !== "undefined"
              ? `${window.location.pathname}${window.location.search}`
              : `/${locale}`;
          router.push(`/${locale}/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, isLoading, router, isSharePage, locale]);

  if (isLoading) {
    return (
      <Container className="flex items-center justify-center min-h-screen">
        <Loading
          size="md"
          variant="spinner"
          text={t("authenticating")}
          showBackground={false}
          className="flex-row gap-3 py-0"
        />
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
              <Button
                onClick={() => {
                  const callbackUrl =
                    typeof window !== "undefined"
                      ? `${window.location.pathname}${window.location.search}`
                      : `/${locale}`;
                  router.push(`/${locale}/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`);
                }}
                className="w-full"
              >
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
