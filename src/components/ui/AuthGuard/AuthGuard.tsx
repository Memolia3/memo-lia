"use client";

import { Container, Loading } from "@/components/ui";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import type { AuthGuardProps } from "./AuthGuard.types";

/**
 * 認証ガードコンポーネント
 * 認証が必要な画面で使用する共通コンポーネント
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  isAuthenticated,
  isLoading,
  error,
  children,
  className,
  loadingMessage,
  unauthenticatedMessage,
  errorMessage,
  errorSubMessage,
}) => {
  const t = useTranslations("dashboard");
  // ローディング状態
  if (isLoading) {
    return (
      <Container
        padding="md"
        maxWidth="7xl"
        className={cn("h-full flex items-center justify-center", className)}
      >
        <Loading
          size="lg"
          variant="spinner"
          text={loadingMessage || t("loading")}
          description={t("auth.loading.description")}
        />
      </Container>
    );
  }

  // 未認証状態
  if (!isAuthenticated) {
    return (
      <Container
        padding="md"
        maxWidth="7xl"
        className={cn("h-full flex items-center justify-center", className)}
      >
        <div className="text-center">
          <p className="text-muted">{unauthenticatedMessage || t("unauthenticated")}</p>
        </div>
      </Container>
    );
  }

  // エラー状態
  if (error) {
    return (
      <Container
        padding="md"
        maxWidth="7xl"
        className={cn("h-full flex items-center justify-center", className)}
      >
        <div className="text-center">
          <p className="text-muted">{errorMessage || t("error")}</p>
          {(errorSubMessage || t("errorSubMessage")) && (
            <p className="text-sm text-gray-500 mt-2">{errorSubMessage || t("errorSubMessage")}</p>
          )}
        </div>
      </Container>
    );
  }

  // 認証済みで正常な状態の場合、子コンポーネントを表示
  return <>{children}</>;
};
