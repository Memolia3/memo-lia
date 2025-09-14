"use client";

import { Button, Divider, GlassBackground, Typography } from "@/components/ui";
import { AUTH_PROVIDERS, ROUTE } from "@/constants";
import { ProviderButton } from "@/features/auth/components/ProviderButton";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTranslations } from "next-intl";
import Link from "next/link";

/**
 * 認証フォーム
 * 各プロバイダーのブランドガイドラインに従ったレイアウト
 */
export const AuthForm: React.FC = () => {
  const t = useTranslations();
  const { isLoading, handleProviderSignIn } = useAuth();

  return (
    <GlassBackground variant="default" className="p-10 w-full max-w-md mx-auto" enableScale={false}>
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3">
          <Typography as="h1" variant="h2" weight="bold" color="primary" padding="md">
            {t("auth.title")}
          </Typography>
        </div>
        <Typography
          variant="body"
          color="secondary"
          align="center"
          className="mb-2 whitespace-pre-line"
        >
          {t("auth.subtitle")}
        </Typography>
        <Typography variant="caption" color="muted" align="center" padding="md">
          {t("auth.description")}
        </Typography>
      </div>

      {/* 認証プロバイダーボタン */}
      <div className="space-y-4 mx-4">
        {AUTH_PROVIDERS.map(({ key, value, provider }) => (
          <ProviderButton
            key={key}
            provider={provider}
            onClick={() => handleProviderSignIn(value)}
            disabled={isLoading !== null}
            className={isLoading === value ? "opacity-75 cursor-not-allowed" : ""}
          />
        ))}
      </div>

      {/* 利用規約 */}
      <div className="text-center">
        <Typography
          variant="caption"
          color="muted"
          align="center"
          padding="md"
          className="leading-relaxed"
        >
          {t("auth.terms")}
        </Typography>
      </div>

      {/* 境界線 */}
      <Divider variant="gradient" thickness="thin" color="gray" padding="md" className="my-8" />

      {/* トップに戻るリンク */}
      <div className="text-center">
        <Link href={ROUTE.TOP}>
          <Button variant="ghost" size="sm" className="text-muted hover:text-primary">
            {t("auth.backToTop")}
          </Button>
        </Link>
      </div>
    </GlassBackground>
  );
};
