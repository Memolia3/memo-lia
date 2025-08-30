import { Button, GlassBackground, Icon, Typography } from "@/components/ui";
import { useTranslations } from "next-intl";

/**
 * スマートフォン版TOPページ
 */
export const TopMobile: React.FC = () => {
  const t = useTranslations();

  return (
    <div className="lg:hidden flex flex-col h-full">
      {/* 上部: アプリ名・キャッチコピー (33.33%) */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 px-4">
        {/* メインタイトル */}
        <Typography as="h1" variant="h1" weight="bold" color="primary" align="center">
          {t("top.title")}
        </Typography>

        {/* タグライン（短い説明） */}
        <Typography variant="h5" color="accent" align="center" className="font-medium">
          {t("top.tagline")}
        </Typography>

        {/* サブタイトル（詳細説明） */}
        <Typography variant="body" color="secondary" align="center">
          {t("top.subtitle")}
        </Typography>
      </div>

      {/* 中央: CTA (33.33%) */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4 w-full max-w-sm">
          <Typography as="h2" variant="h4" weight="bold" color="primary" align="center">
            {t("top.cta.title")}
          </Typography>
          <Typography variant="body" color="muted" align="center">
            {t("top.cta.description")}
          </Typography>
          <Button size="lg" className="shadow-lg hover:shadow-xl w-full">
            {t("top.cta.button")}
          </Button>
        </div>
      </div>

      {/* 下部: 主要機能3つ（縦並び）(33.33%) */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="space-y-4 w-full max-w-sm">
          <GlassBackground variant="default" className="p-4">
            <div className="flex items-start space-x-4">
              <Icon name="bookmark" size="lg" color="accent" className="flex-shrink-0 mt-1" />
              <div className="flex-1">
                <Typography as="h3" variant="h6" weight="semibold" color="primary" className="mb-2">
                  {t("top.features.bookmark.title")}
                </Typography>
                <Typography variant="caption" color="muted">
                  {t("top.features.bookmark.description")}
                </Typography>
              </div>
            </div>
          </GlassBackground>

          <GlassBackground variant="subtle" className="p-4">
            <div className="flex items-start space-x-4">
              <Icon name="sell" size="lg" color="accent" className="flex-shrink-0 mt-1" />
              <div className="flex-1">
                <Typography as="h3" variant="h6" weight="semibold" color="primary" className="mb-2">
                  {t("top.features.customize.title")}
                </Typography>
                <Typography variant="caption" color="muted">
                  {t("top.features.customize.description")}
                </Typography>
              </div>
            </div>
          </GlassBackground>

          <GlassBackground variant="intense" className="p-4">
            <div className="flex items-start space-x-4">
              <Icon name="search" size="lg" color="accent" className="flex-shrink-0 mt-1" />
              <div className="flex-1">
                <Typography as="h3" variant="h6" weight="semibold" color="primary" className="mb-2">
                  {t("top.features.search.title")}
                </Typography>
                <Typography variant="caption" color="muted">
                  {t("top.features.search.description")}
                </Typography>
              </div>
            </div>
          </GlassBackground>
        </div>
      </div>
    </div>
  );
};
