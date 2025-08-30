import { Button, GlassBackground, Icon, Typography } from "@/components/ui";
import { AdSense } from "@/features/google";
import { useTranslations } from "next-intl";

/**
 * デスクトップ版TOPページ
 */
export const TopDesktop: React.FC = () => {
  const t = useTranslations();

  return (
    <div className="hidden lg:flex lg:flex-col h-full">
      {/* メインコンテンツ */}
      <div className="grid grid-cols-2 gap-12 items-center flex-1">
        {/* 左半分: 主要機能3つ（縦並び） */}
        <div className="space-y-6 overflow-y-auto max-h-full">
          <GlassBackground variant="default" className="p-6">
            <div className="flex items-center space-x-4">
              <Icon name="bookmark" size="xl" color="accent" />
              <div>
                <Typography as="h3" variant="h4" weight="semibold" color="primary" className="mb-2">
                  {t("top.features.bookmark.title")}
                </Typography>
                <Typography variant="body" color="muted">
                  {t("top.features.bookmark.description")}
                </Typography>
              </div>
            </div>
          </GlassBackground>

          <GlassBackground variant="subtle" className="p-6">
            <div className="flex items-center space-x-4">
              <Icon name="sell" size="xl" color="accent" />
              <div>
                <Typography as="h3" variant="h4" weight="semibold" color="primary" className="mb-2">
                  {t("top.features.customize.title")}
                </Typography>
                <Typography variant="body" color="muted">
                  {t("top.features.customize.description")}
                </Typography>
              </div>
            </div>
          </GlassBackground>

          <GlassBackground variant="intense" className="p-6">
            <div className="flex items-center space-x-4">
              <Icon name="search" size="xl" color="accent" />
              <div>
                <Typography as="h3" variant="h4" weight="semibold" color="primary" className="mb-2">
                  {t("top.features.search.title")}
                </Typography>
                <Typography variant="body" color="muted">
                  {t("top.features.search.description")}
                </Typography>
              </div>
            </div>
          </GlassBackground>
        </div>

        {/* 右半分: アプリ名・キャッチコピー・CTA（シンプル表示） */}
        <div className="flex flex-col items-center justify-center text-center space-y-8 h-full overflow-y-auto">
          {/* アプリ名・キャッチコピー */}
          <div className="space-y-6 text-center w-full">
            {/* メインタイトル */}
            <Typography as="h1" variant="display" weight="bold" color="primary" align="center">
              {t("top.title")}
            </Typography>

            {/* タグライン（短い説明） */}
            <Typography variant="h4" color="accent" align="center" className="font-medium">
              {t("top.tagline")}
            </Typography>

            {/* サブタイトル（詳細説明） */}
            <Typography
              variant="body"
              color="secondary"
              align="center"
              className="max-w-lg mx-auto"
            >
              {t("top.subtitle")}
            </Typography>
          </div>

          {/* CTA */}
          <div className="space-y-4 text-center w-full">
            <Typography as="h2" variant="h3" weight="bold" color="primary" align="center">
              {t("top.cta.title")}
            </Typography>
            <Typography variant="body" color="muted" align="center">
              {t("top.cta.description")}
            </Typography>
            <Button size="xl" rounded="xl" className="shadow-lg hover:shadow-xl">
              {t("top.cta.button")}
            </Button>
          </div>
        </div>
      </div>

      {/* PC画面専用: 下部の横長AdSense広告 */}
      <div className="mt-8">
        <AdSense adSlot="1234567890" adFormat="banner" responsive={true} className="w-full" />
      </div>
    </div>
  );
};
