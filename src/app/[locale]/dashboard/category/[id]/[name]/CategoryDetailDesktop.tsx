"use client";

import { AppHeader } from "@/components/layout";
import { Divider, Icon, ScrollArea, Typography, UserInfo } from "@/components/ui";
import { ActionButtons } from "@/features/categoryDetail/components/ActionButtons";
import { GenreCreateButton } from "@/features/categoryDetail/components/GenreCreateButton";
import { GenreGrid } from "@/features/categoryDetail/components/GenreGrid";
import { useCategoryDetail, useGenres } from "@/features/categoryDetail/hooks";
import { CategoryDetailDesktopProps, GenreData } from "@/features/categoryDetail/types";
import { AdSense } from "@/features/google";
import { cn } from "@/utils";
import { Folder } from "lucide-react";
import { useTranslations } from "next-intl";

export const CategoryDetailDesktop: React.FC<CategoryDetailDesktopProps> = ({
  category,
  locale,
  className,
}) => {
  const t = useTranslations("categoryDetail");
  const { handleBackToDashboard, handleCreateGenre } = useCategoryDetail(category);
  const { genres, isLoading, error, handleGenreDelete } = useGenres(category.id, category.userId);

  const handleGenreClick = (genre: GenreData) => {
    // TODO: ジャンル詳細画面への遷移
    // eslint-disable-next-line no-console
    console.log("Genre clicked:", genre);
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <AppHeader title={t("title")} userInfo={<UserInfo />} />

      <main className="flex-1 flex flex-col overflow-hidden px-4 py-6 sm:px-6 sm:py-8">
        <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
          {/* カテゴリ情報 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 flex-shrink-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                {category.icon ? (
                  <Icon name={category.icon} className="w-8 h-8 text-primary" />
                ) : (
                  <Folder
                    className="w-8 h-8 text-primary"
                    style={{ color: category.color || undefined }}
                  />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{category.description}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">{t("info.createdAt")}:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {new Date(category.createdAt).toLocaleDateString(
                    locale === "ja" ? "ja-JP" : "en-US"
                  )}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">{t("info.updatedAt")}:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {new Date(category.updatedAt).toLocaleDateString(
                    locale === "ja" ? "ja-JP" : "en-US"
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* ジャンル一覧 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col flex-1 min-h-0">
            <div className="p-6 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-12">
                  <Typography as="h2" variant="h4" weight="semibold" color="primary">
                    {t("genres.title")}
                  </Typography>
                  <div className="flex items-center gap-2 h-full">
                    <Typography
                      as="span"
                      variant="body-sm"
                      color="muted"
                      className="flex items-center"
                    >
                      {t("genres.count")}:
                    </Typography>
                    <Typography
                      as="span"
                      variant="h5"
                      weight="semibold"
                      color="accent"
                      className="ml-2 flex items-center"
                    >
                      {genres.length}
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ActionButtons onBackToDashboard={handleBackToDashboard} />
                  <GenreCreateButton onCreateGenre={handleCreateGenre} />
                </div>
              </div>
              <Typography as="p" variant="body" color="muted" className="mb-4">
                {t("genres.description")}
              </Typography>

              <Divider padding="lg" />
            </div>

            {/* スクロール可能なジャンル一覧エリア */}
            <ScrollArea className="flex-1 px-6 pb-6">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {t("genres.loading")}
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red-500 dark:text-red-400 mb-2">{t("genres.loadError")}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{error.message}</div>
                </div>
              ) : (
                <div className="p-1.5">
                  <GenreGrid
                    genres={genres}
                    onGenreClick={handleGenreClick}
                    onGenreDelete={handleGenreDelete}
                  />
                </div>
              )}
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
