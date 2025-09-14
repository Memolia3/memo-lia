"use client";

import { Button, Icon, Typography } from "@/components/ui";
import { OAuthProviderValue } from "@/constants";
import { getProviderConfig } from "@/features/auth/utils/providerConfig";
import { AuthProviderKey } from "@/features/auth/utils/providerConfig.types";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { ProviderButtonProps } from "./ProviderButton.types";

/**
 * 認証プロバイダーボタン
 * 各プロバイダーのブランドガイドラインに従ったデザイン
 */
export const ProviderButton: React.FC<ProviderButtonProps> = ({
  provider,
  onClick,
  className,
  disabled = false,
}) => {
  const t = useTranslations();
  const config = getProviderConfig(provider);

  const getProviderName = () => {
    const names: Record<AuthProviderKey, string> = {
      GOOGLE: t("auth.providers.google.name"),
      GITHUB: t("auth.providers.github.name"),
      DISCORD: t("auth.providers.discord.name"),
    };
    return names[provider] || "Unknown";
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full h-12 lg:h-14 px-4 lg:px-6 border-2 transition-all duration-200 font-medium",
        config.bgColor,
        config.textColor,
        config.borderColor,
        config.shadow,
        "flex items-center justify-center gap-2 lg:gap-3 space-x-2 lg:space-x-3",
        className
      )}
      rounded="xl"
    >
      <Icon
        name={config.icon as OAuthProviderValue}
        size="md"
        className="flex-shrink-0 lg:size-lg"
      />
      <Typography variant="body" weight="semibold" className="text-sm lg:text-base">
        {getProviderName()}
      </Typography>
    </Button>
  );
};
