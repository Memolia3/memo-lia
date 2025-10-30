import { AppFooter } from "@/components/layout";
import { Button, Container, GlassBackground, Typography } from "@/components/ui";
import { generateMetadata as generateMeta, isLocaleEnglish } from "@/utils/meta";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";

/**
 * プライバシーポリシーページのメタデータ
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const metaOptions = {
    title: isLocaleEnglish(locale) ? "Privacy Policy" : "プライバシーポリシー",
    description: isLocaleEnglish(locale)
      ? "MemoLia Privacy Policy - How we collect, use, and protect your data"
      : "MemoLiaのプライバシーポリシー - データの収集、使用、保護について",
    type: "website" as const,
    url: "/privacy",
  };

  return generateMeta(locale, metaOptions);
}

/**
 * プライバシーポリシーコンテンツコンポーネント
 */
function PrivacyContent() {
  const t = useTranslations("legal");

  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="flex-shrink-0 px-4 py-6 border-b border-white/10 dark:border-gray-700/10">
        <Container maxWidth="4xl">
          <div className="flex items-center">
            {/* 戻るボタン */}
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <ArrowLeft size={16} />
                <span>{t("backToTop")}</span>
              </Button>
            </Link>

            {/* タイトル */}
            <Typography as="h1" variant="h1" weight="bold" className="flex-1 text-center">
              {t("privacy.title")}
            </Typography>
          </div>
        </Container>
      </div>

      {/* スクロール可能なコンテンツ */}
      <div className="flex-1 overflow-y-auto">
        <Container padding="lg" maxWidth="4xl" className="py-8">
          <GlassBackground variant="default" className="p-8" enableScale={false}>
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div className="space-y-8">
                <section className="border-b border-white/20 dark:border-gray-700/20 pb-8">
                  <Typography as="h2" variant="h3" weight="semibold" className="mb-4">
                    {t("privacy.sections.collection.title")}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    {t("privacy.sections.collection.content")}
                  </Typography>
                </section>

                <section className="border-b border-white/20 dark:border-gray-700/20 pb-8">
                  <Typography as="h2" variant="h3" weight="semibold" className="mb-4">
                    {t("privacy.sections.usage.title")}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    {t("privacy.sections.usage.content")}
                  </Typography>
                </section>

                <section className="border-b border-white/20 dark:border-gray-700/20 pb-8">
                  <Typography as="h2" variant="h3" weight="semibold" className="mb-4">
                    {t("privacy.sections.sharing.title")}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    {t("privacy.sections.sharing.content")}
                  </Typography>
                </section>

                <section className="border-b border-white/20 dark:border-gray-700/20 pb-8">
                  <Typography as="h2" variant="h3" weight="semibold" className="mb-4">
                    {t("privacy.sections.security.title")}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    {t("privacy.sections.security.content")}
                  </Typography>
                </section>

                <section className="border-b border-white/20 dark:border-gray-700/20 pb-8">
                  <Typography as="h2" variant="h3" weight="semibold" className="mb-4">
                    {t("privacy.sections.cookies.title")}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    {t("privacy.sections.cookies.content")}
                  </Typography>
                </section>

                <section className="border-b border-white/20 dark:border-gray-700/20 pb-8">
                  <Typography as="h2" variant="h3" weight="semibold" className="mb-4">
                    {t("privacy.sections.thirdParty.title")}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    {t("privacy.sections.thirdParty.content")}
                  </Typography>
                </section>

                <section className="border-b border-white/20 dark:border-gray-700/20 pb-8">
                  <Typography as="h2" variant="h3" weight="semibold" className="mb-4">
                    {t("privacy.sections.rights.title")}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    {t("privacy.sections.rights.content")}
                  </Typography>
                </section>

                <section className="border-b border-white/20 dark:border-gray-700/20 pb-8">
                  <Typography as="h2" variant="h3" weight="semibold" className="mb-4">
                    {t("privacy.sections.changes.title")}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    {t("privacy.sections.changes.content")}
                  </Typography>
                </section>

                <section className="pb-8">
                  <Typography as="h2" variant="h3" weight="semibold" className="mb-4">
                    {t("privacy.sections.contact.title")}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    {t("privacy.sections.contact.content")}
                  </Typography>
                </section>

                <div className="pt-8 border-t border-white/20 dark:border-gray-700/20">
                  <Typography variant="caption" color="muted" className="text-center block mb-6">
                    {t("privacy.lastUpdated")}
                  </Typography>

                  {/* 戻るボタン */}
                  <div className="flex justify-center">
                    <Link href="/">
                      <Button variant="outline" className="flex items-center space-x-2">
                        <ArrowLeft size={16} />
                        <span>{t("backToTop")}</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </GlassBackground>
        </Container>
      </div>

      {/* フッター */}
      <AppFooter />
    </div>
  );
}

/**
 * プライバシーポリシーページ
 */
export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  await params; // paramsを待機

  return <PrivacyContent />;
}
