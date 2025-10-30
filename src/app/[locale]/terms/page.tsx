import { AppFooter } from "@/components/layout";
import { Button, Container, GlassBackground, Typography } from "@/components/ui";
import { generateMetadata as generateMeta, isLocaleEnglish } from "@/utils/meta";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";

/**
 * 利用規約ページのメタデータ
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const metaOptions = {
    title: isLocaleEnglish(locale) ? "Terms of Service" : "利用規約",
    description: isLocaleEnglish(locale)
      ? "MemoLia Terms of Service - Rules and guidelines for using our URL management service"
      : "MemoLiaの利用規約 - URL管理サービスの利用に関する規則とガイドライン",
    type: "website" as const,
    url: "/terms",
  };

  return generateMeta(locale, metaOptions);
}

/**
 * 利用規約コンテンツコンポーネント
 */
function TermsContent() {
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
              {t("terms.title")}
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
                    {t("terms.sections.acceptance.title")}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    {t("terms.sections.acceptance.content")}
                  </Typography>
                </section>

                <section className="border-b border-white/20 dark:border-gray-700/20 pb-8">
                  <Typography as="h2" variant="h3" weight="semibold" className="mb-4">
                    {t("terms.sections.description.title")}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    {t("terms.sections.description.content")}
                  </Typography>
                </section>

                <section className="border-b border-white/20 dark:border-gray-700/20 pb-8">
                  <Typography as="h2" variant="h3" weight="semibold" className="mb-4">
                    {t("terms.sections.responsibilities.title")}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    {t("terms.sections.responsibilities.content")}
                  </Typography>
                </section>

                <section className="border-b border-white/20 dark:border-gray-700/20 pb-8">
                  <Typography as="h2" variant="h3" weight="semibold" className="mb-4">
                    {t("terms.sections.prohibited.title")}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    {t("terms.sections.prohibited.content")}
                  </Typography>
                </section>

                <section className="border-b border-white/20 dark:border-gray-700/20 pb-8">
                  <Typography as="h2" variant="h3" weight="semibold" className="mb-4">
                    {t("terms.sections.ownership.title")}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    {t("terms.sections.ownership.content")}
                  </Typography>
                </section>

                <section className="border-b border-white/20 dark:border-gray-700/20 pb-8">
                  <Typography as="h2" variant="h3" weight="semibold" className="mb-4">
                    {t("terms.sections.availability.title")}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    {t("terms.sections.availability.content")}
                  </Typography>
                </section>

                <section className="border-b border-white/20 dark:border-gray-700/20 pb-8">
                  <Typography as="h2" variant="h3" weight="semibold" className="mb-4">
                    {t("terms.sections.privacy.title")}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    {t("terms.sections.privacy.content")}
                  </Typography>
                </section>

                <section className="border-b border-white/20 dark:border-gray-700/20 pb-8">
                  <Typography as="h2" variant="h3" weight="semibold" className="mb-4">
                    {t("terms.sections.advertising.title")}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    {t("terms.sections.advertising.content")}
                  </Typography>
                </section>

                <section className="border-b border-white/20 dark:border-gray-700/20 pb-8">
                  <Typography as="h2" variant="h3" weight="semibold" className="mb-4">
                    {t("terms.sections.liability.title")}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    {t("terms.sections.liability.content")}
                  </Typography>
                </section>

                <section className="border-b border-white/20 dark:border-gray-700/20 pb-8">
                  <Typography as="h2" variant="h3" weight="semibold" className="mb-4">
                    {t("terms.sections.changes.title")}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    {t("terms.sections.changes.content")}
                  </Typography>
                </section>

                <section className="pb-8">
                  <Typography as="h2" variant="h3" weight="semibold" className="mb-4">
                    {t("terms.sections.contact.title")}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed">
                    {t("terms.sections.contact.content")}
                  </Typography>
                </section>

                <div className="pt-8 border-t border-white/20 dark:border-gray-700/20">
                  <Typography variant="caption" color="muted" className="text-center block mb-6">
                    {t("terms.lastUpdated")}
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
 * 利用規約ページ
 */
export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  await params; // paramsを待機

  return <TermsContent />;
}
