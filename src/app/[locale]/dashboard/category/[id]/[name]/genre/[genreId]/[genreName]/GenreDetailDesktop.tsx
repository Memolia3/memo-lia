"use client";

import { AppHeader } from "@/components/layout";
import { Button, Divider, Icon, ScrollArea, Typography, UserInfo } from "@/components/ui";
import { UrlCreateButton, UrlGrid, useGenreDetail } from "@/features/genreDetail";
import { AdSense } from "@/features/google";
import { cn } from "@/utils";
import { ArrowLeft, Folder } from "lucide-react";
import { useTranslations } from "next-intl";

export interface GenreDetailDesktopProps {
  category: any; // CategoryData type
  genreId: string;
  locale: string;
  className?: string;
}

export const GenreDetailDesktop: React.FC<GenreDetailDesktopProps> = ({
  category,
  genreId,
  locale,
  className,
}) => {
  const t = useTranslations("genreDetail");
  const {
    genre,
    urls,
    isLoading,
    error,
    handleBackToCategory,
    handleUrlClick,
    handleUrlDelete,
    handleCreateUrl,
  } = useGenreDetail(category.id, genreId, category.userId);

  if (isLoading) {
    return (
      <div className={cn("h-full flex flex-col", className)}>
        <AppHeader title={t("title")} userInfo={<UserInfo />} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <Typography variant="body" color="muted">
              {t("loading")}
            </Typography>
          </div>
        </main>
      </div>
    );
  }

  if (error || !genre) {
    return (
      <div className={cn("h-full flex flex-col", className)}>
        <AppHeader title={t("title")} userInfo={<UserInfo />} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Typography variant="h3" color="primary" className="mb-4">
              {t("notFound.title")}
            </Typography>
            <Typography variant="body" color="muted">
              {t("notFound.description")}
            </Typography>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <AppHeader title={t("title")} userInfo={<UserInfo />} />

      <main className="flex-1 flex flex-col overflow-hidden px-4 py-6 sm:px-6 sm:py-8">
        <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
          {/* ジャンル情報 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 flex-shrink-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                {genre.icon ? (
                  <Icon name={genre.icon} className="w-8 h-8 text-primary" />
                ) : (
                  <Folder
                    className="w-8 h-8 text-primary"
                    style={{ color: genre.color || undefined }}
                  />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {genre.name}
                </h1>
                {genre.description && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{genre.description}</p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  {t("info.categoryName")}: {category.name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">{t("info.createdAt")}:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {new Date(genre.createdAt).toLocaleDateString(
                    locale === "ja" ? "ja-JP" : "en-US"
                  )}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">{t("info.updatedAt")}:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {new Date(genre.updatedAt).toLocaleDateString(
                    locale === "ja" ? "ja-JP" : "en-US"
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* URL一覧 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col flex-1 min-h-0">
            <div className="p-6 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-12">
                  <Typography as="h2" variant="h4" weight="semibold" color="primary">
                    {t("urls.title")}
                  </Typography>
                  <div className="flex items-center gap-2 h-full">
                    <Typography
                      as="span"
                      variant="body-sm"
                      color="muted"
                      className="flex items-center"
                    >
                      {t("urls.count")}:
                    </Typography>
                    <Typography
                      as="span"
                      variant="h5"
                      weight="semibold"
                      color="accent"
                      className="ml-2 flex items-center"
                    >
                      {urls.length}
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBackToCategory}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t("actions.backToCategory")}
                  </Button>
                  <UrlCreateButton onCreateUrl={handleCreateUrl} />
                </div>
              </div>
              <Typography as="p" variant="body" color="muted" className="mb-4">
                {t("urls.description")}
              </Typography>

              <Divider padding="lg" />
            </div>

            {/* スクロール可能なURL一覧エリア */}
            <ScrollArea className="flex-1 px-6 pb-6">
              <div className="p-1.5">
                <UrlGrid urls={urls} onUrlClick={handleUrlClick} onUrlDelete={handleUrlDelete} />
              </div>
            </ScrollArea>
          </div>
        </div>
      </main>

      {/* AdSense広告 - 画面の一番下 */}
      <div className="px-4 py-4 sm:px-6 sm:py-6 border-t border-gray-200 dark:border-gray-700">
        <AdSense adSlot="1234567890" adFormat="fluid" responsive={true} className="w-full" />
      </div>
    </div>
  );
};
