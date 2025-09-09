import { Image, Typography } from "@/components/ui";
import { AuthForm } from "@/features/auth/components/AuthForm";
import { useTranslations } from "next-intl";

/**
 * PC画面用認証ページ
 * トップ画面と一貫性のあるレイアウト
 */
export const AuthDesktop: React.FC = () => {
  const t = useTranslations();

  return (
    <div className="hidden lg:flex lg:flex-col h-full overflow-hidden zoom-safe">
      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12 items-center flex-1 zoom-container">
        {/* 左半分: アプリ情報（トップ画面と同様のレイアウト） */}
        <div className="flex flex-col items-center justify-center text-center space-y-6 xl:space-y-8 h-full zoom-safe">
          {/* アプリ名・キャッチコピー */}
          <div className="space-y-4 xl:space-y-6 text-center w-full zoom-container">
            {/* メインタイトル */}
            <div className="flex flex-col xs:flex-row items-center justify-center gap-3 xs:gap-4">
              <Image name="memo-lia-icon" size="3xl" alt="MemoLia Icon" className="flex-shrink-0" />
              <Typography
                as="h1"
                variant="display"
                weight="bold"
                color="primary"
                className="zoom-text break-words"
              >
                {t("top.title")}
              </Typography>
            </div>

            {/* タグライン（短い説明） */}
            <Typography
              variant="h4"
              color="accent"
              align="center"
              className="font-medium zoom-text break-words"
            >
              {t("top.tagline")}
            </Typography>

            {/* サブタイトル（詳細説明） */}
            <Typography
              variant="body"
              color="secondary"
              align="center"
              className="max-w-lg mx-auto zoom-text break-words"
            >
              {t("top.subtitle")}
            </Typography>
          </div>

          {/* 認証の説明 */}
          <div className="space-y-4 text-center w-full zoom-container">
            <Typography
              as="h2"
              variant="h3"
              weight="bold"
              color="primary"
              align="center"
              className="zoom-text break-words"
            >
              {t("auth.loginDescription")}
            </Typography>
            <Typography
              variant="body"
              color="muted"
              align="center"
              className="zoom-text break-words"
            >
              {t("auth.loginSubDescription")}
            </Typography>
          </div>
        </div>

        {/* 右半分: 認証フォーム */}
        <div className="flex items-center justify-center h-full zoom-safe">
          <div className="w-full max-w-md zoom-container">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
};
