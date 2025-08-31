import { Image, Typography } from "@/components/ui";
import { AuthForm } from "@/features/auth/components/AuthForm";
import { useTranslations } from "next-intl";

/**
 * スマホ画面用認証ページ
 * トップ画面と一貫性のあるレイアウト
 */
export const AuthMobile: React.FC = () => {
  const t = useTranslations();

  return (
    <div className="lg:hidden flex flex-col h-full overflow-y-auto overflow-x-hidden">
      {/* 上部: アプリ名・キャッチコピー (35%) */}
      <div className="flex-shrink-0 pt-8 pb-6 text-center space-y-4">
        {/* メインタイトル */}
        <div className="flex items-center justify-center space-x-3">
          <Image name="memo-lia-icon" size="2xl" alt="MemoLia Icon" />
          <Typography as="h1" variant="h1" weight="bold" color="primary">
            {t("top.title")}
          </Typography>
        </div>

        {/* タグライン（短い説明） */}
        <Typography variant="h5" color="accent" align="center" className="font-medium">
          {t("top.tagline")}
        </Typography>

        {/* サブタイトル（詳細説明） */}
        <Typography variant="body" color="secondary" align="center">
          {t("top.subtitle")}
        </Typography>
      </div>

      {/* 中央: 認証フォーム (65%) */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <AuthForm />
      </div>
    </div>
  );
};
