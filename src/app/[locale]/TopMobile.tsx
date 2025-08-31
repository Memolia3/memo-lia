import { Button, Divider, GlassBackground, Icon, Image, Typography } from "@/components/ui";
import { ROUTE } from "@/constants";
import { useTranslations } from "next-intl";
import Link from "next/link";

/**
 * スマートフォン版TOPページ
 */
export const TopMobile: React.FC = () => {
  const t = useTranslations();

  return (
    <div className="lg:hidden flex flex-col w-full">
      {/* 上部: アプリ名・キャッチコピー (35%) */}
      <div className="flex-shrink-0 pt-8 pb-8 text-center space-y-4">
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

      {/* 境界線 */}
      <Divider variant="gradient" thickness="normal" color="gray" />

      {/* 中央: CTA (20%) */}
      <div className="flex-shrink-0 flex items-center justify-center px-4 py-6">
        <div className="text-center space-y-4 w-full max-w-sm">
          <Typography as="h2" variant="h4" weight="bold" color="primary" align="center">
            {t("top.cta.title")}
          </Typography>
          <Typography variant="body" color="muted" align="center">
            {t("top.cta.description")}
          </Typography>
          <Link href={ROUTE.AUTH} className="inline-block">
            <Button size="lg" className="shadow-lg hover:shadow-xl w-full">
              {t("top.cta.button")}
            </Button>
          </Link>
        </div>
      </div>

      {/* 下部: 主要機能3つ（縦並び）(45%) */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
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
