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

export interface GenreDetailMobileProps {
  category: CategoryData;
  genreId: string;
  locale: string;
  className?: string;
}

export const GenreDetailMobile: React.FC<GenreDetailMobileProps> = ({
  category,
  genreId,
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
          <Loading
            size="lg"
            variant="spinner"
            text={t("loading")}
            description={t("loadingDescription")}
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
    <div className={cn("h-full flex flex-col", className)}>
      <AppHeader title={t("title")} userInfo={<UserInfo />} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="w-full flex flex-col h-full px-4">
          {/* ジャンル情報 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-1 flex-shrink-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                {genre.icon ? (
                  <Icon name={genre.icon} className="w-6 h-6 text-primary" />
                ) : (
                  <Folder
                    className="w-6 h-6 text-primary"
                    style={{ color: genre.color || undefined }}
                  />
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">{genre.name}</h1>
                {genre.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {genre.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {t("info.categoryName")}: {category.name}
                </p>
              </div>
            </div>
          </div>

          {/* URL一覧 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col flex-1 min-h-0 mb-4">
            <div className="p-4 flex-shrink-0">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <Typography as="h2" variant="h5" weight="semibold" color="primary">
                    {t("urls.title")}
                  </Typography>
                  <div className="flex items-center">
                    <Typography as="span" variant="body-sm" color="muted">
                      {t("urls.count")}:
                    </Typography>
                    <Typography
                      as="span"
                      variant="h5"
                      weight="semibold"
                      color="accent"
                      className="ml-2"
                    >
                      {urls.length}
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-3">
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

              <Divider padding="sm" />
            </div>

            {/* スクロール可能なURL一覧エリア */}
            <ScrollArea className="flex-1 px-4 pb-4">
              <div className="p-1.5">
                <UrlGrid urls={urls} onUrlClick={handleUrlClick} onUrlDelete={handleUrlDelete} />
              </div>
            </ScrollArea>
          </div>
        </div>
      </main>

      {/* AdSense広告 - 画面の一番下 */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <AdSense adSlot="1234567890" adFormat="fluid" responsive={true} className="w-full" />
      </div>
    </div>
  );
};
