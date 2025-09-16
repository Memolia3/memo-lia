"use client";

import { AppHeader } from "@/components/layout";
import { Button, Divider, Icon, Loading, ScrollArea, Typography, UserInfo } from "@/components/ui";
import { UrlCreateButton, UrlGrid, useGenreDetail } from "@/features/genreDetail";
import { AdSense } from "@/features/google";
import { cn } from "@/utils";
import { ArrowLeft, Folder } from "lucide-react";
import { useTranslations } from "next-intl";

interface CategoryData {
  id: string;
  name: string;
  userId: string;
}

export interface GenreDetailDesktopProps {
  category: CategoryData;
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
    urlsLoading,
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
          <Loading
            size="lg"
            variant="spinner"
            text={t("loading")}
            description="ジャンル情報を取得しています"
          />
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
    <div className={cn("h-full flex flex-col zoom-safe", className)}>
      <AppHeader title={t("title")} userInfo={<UserInfo />} />

      <main className="flex-1 flex flex-col overflow-hidden zoom-container">
        <div className="max-w-7xl mx-auto w-full flex flex-col h-full zoom-safe">
          {/* ジャンル情報 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6 flex-shrink-0 zoom-safe">
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 xs:gap-4 mb-4">
              <div className="w-12 h-12 xs:w-16 xs:h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                {genre.icon ? (
                  <Icon name={genre.icon} className="w-6 h-6 xs:w-8 xs:h-8 text-primary" />
                ) : (
                  <Folder
                    className="w-6 h-6 xs:w-8 xs:h-8 text-primary"
                    style={{ color: genre.color || undefined }}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-gray-100 zoom-text break-words">
                  {genre.name}
                </h1>
                {genre.description && (
                  <p className="text-sm xs:text-base text-gray-600 dark:text-gray-400 mt-1 zoom-text break-words">
                    {genre.description}
                  </p>
                )}
                <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-500 mt-2 zoom-text break-words">
                  {t("info.categoryName")}: {category.name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4 text-sm zoom-text">
              <div className="flex flex-col xs:flex-row xs:items-center">
                <span className="text-gray-500 dark:text-gray-400">{t("info.createdAt")}:</span>
                <span className="xs:ml-2 text-gray-900 dark:text-gray-100 break-words">
                  {new Date(genre.created_at).toLocaleDateString(
                    locale === "ja" ? "ja-JP" : "en-US"
                  )}
                </span>
              </div>
              <div className="flex flex-col xs:flex-row xs:items-center">
                <span className="text-gray-500 dark:text-gray-400">{t("info.updatedAt")}:</span>
                <span className="xs:ml-2 text-gray-900 dark:text-gray-100 break-words">
                  {new Date(genre.updated_at).toLocaleDateString(
                    locale === "ja" ? "ja-JP" : "en-US"
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* URL一覧 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col flex-1 min-h-0 zoom-safe">
            <div className="p-4 sm:p-6 flex-shrink-0 zoom-container">
              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4 mb-4">
                <div className="flex flex-col xs:flex-row xs:items-center gap-3 xs:gap-12">
                  <Typography
                    as="h2"
                    variant="h4"
                    weight="semibold"
                    color="primary"
                    className="zoom-text"
                  >
                    {t("urls.title")}
                  </Typography>
                  <div className="flex items-center gap-2 h-full">
                    <Typography
                      as="span"
                      variant="body-sm"
                      color="muted"
                      className="flex items-center zoom-text"
                    >
                      {t("urls.count")}:
                    </Typography>
                    <Typography
                      as="span"
                      variant="h5"
                      weight="semibold"
                      color="accent"
                      className="ml-2 flex items-center zoom-text"
                    >
                      {urls.length}
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center gap-2 xs:gap-3 zoom-flex">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBackToCategory}
                    className="flex items-center gap-2 zoom-text"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t("actions.backToCategory")}
                  </Button>
                  <UrlCreateButton onCreateUrl={handleCreateUrl} />
                </div>
              </div>
              <Typography
                as="p"
                variant="body"
                color="muted"
                className="mb-4 zoom-text break-words"
              >
                {t("urls.description")}
              </Typography>

              <Divider />
            </div>

            {/* スクロール可能なURL一覧エリア */}
            <ScrollArea className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 zoom-safe">
              <div className="p-1.5 zoom-container">
                <UrlGrid
                  urls={urls}
                  onUrlClick={handleUrlClick}
                  onUrlDelete={handleUrlDelete}
                  isLoading={urlsLoading}
                />
              </div>
            </ScrollArea>
          </div>
        </div>
      </main>

      {/* AdSense広告 - 画面の一番下 */}
      <div className="px-4 py-4 sm:px-6 sm:py-6 border-t border-gray-200 dark:border-gray-700 zoom-container">
        <AdSense
          adSlot="1234567890"
          adFormat="fluid"
          responsive={true}
          className="w-full zoom-safe"
        />
      </div>
    </div>
  );
};
