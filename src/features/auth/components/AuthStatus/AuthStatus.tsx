"use client";

import { signOut } from "@/auth";
import { Button, Typography } from "@/components/ui";
import { useSession } from "@/features/auth/hooks";
import { useTranslations } from "next-intl";
import Image from "next/image";

/**
 * 認証状態表示コンポーネント
 */
export const AuthStatus: React.FC = () => {
  const { session, isAuthenticated, isLoading } = useSession();
  const t = useTranslations();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
        <Typography variant="caption" color="muted">
          {t("auth.loading")}
        </Typography>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <Typography variant="caption" color="muted">
          {t("auth.notSignedIn")}
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        {session?.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className="text-left">
          <Typography variant="caption" weight="semibold" color="primary">
            {session?.user?.name || session?.user?.email}
          </Typography>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut()}
        className="text-muted hover:text-primary"
      >
        {t("auth.signOut")}
      </Button>
    </div>
  );
};
