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
    <div className={cn("h-full flex flex-col zoom-safe", className)}>
      <AppHeader title={t("title")} userInfo={<UserInfo />} />

      <main className="flex-1 flex flex-col overflow-hidden zoom-container">
        <div className="max-w-7xl mx-auto w-full flex flex-col h-full zoom-safe">
          {/* カテゴリ情報 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6 flex-shrink-0 zoom-safe">
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 xs:gap-4 mb-4">
              <div className="w-12 h-12 xs:w-16 xs:h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                {category.icon ? (
                  <Icon name={category.icon} className="w-6 h-6 xs:w-8 xs:h-8 text-primary" />
                ) : (
                  <Folder
                    className="w-6 h-6 xs:w-8 xs:h-8 text-primary"
                    style={{ color: category.color || undefined }}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-gray-100 zoom-text break-words">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-sm xs:text-base text-gray-600 dark:text-gray-400 mt-1 zoom-text break-words">
                    {category.description}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4 text-sm zoom-text">
              <div className="flex flex-col xs:flex-row xs:items-center">
                <span className="text-gray-500 dark:text-gray-400">{t("info.createdAt")}:</span>
                <span className="xs:ml-2 text-gray-900 dark:text-gray-100 break-words">
                  {new Date(category.createdAt).toLocaleDateString(
                    locale === "ja" ? "ja-JP" : "en-US"
                  )}
                </span>
              </div>
              <div className="flex flex-col xs:flex-row xs:items-center">
                <span className="text-gray-500 dark:text-gray-400">{t("info.updatedAt")}:</span>
                <span className="xs:ml-2 text-gray-900 dark:text-gray-100 break-words">
                  {new Date(category.updatedAt).toLocaleDateString(
                    locale === "ja" ? "ja-JP" : "en-US"
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* ジャンル一覧 */}
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
                    {t("genres.title")}
                  </Typography>
                  <div className="flex items-center gap-2 h-full">
                    <Typography
                      as="span"
                      variant="body-sm"
                      color="muted"
                      className="flex items-center zoom-text"
                    >
                      {t("genres.count")}:
                    </Typography>
                    <Typography
                      as="span"
                      variant="h5"
                      weight="semibold"
                      color="accent"
                      className="ml-2 flex items-center zoom-text"
                    >
                      {genres.length}
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center gap-2 xs:gap-3 zoom-flex">
                  <ActionButtons onBackToDashboard={handleBackToDashboard} />
                  <GenreCreateButton onCreateGenre={handleCreateGenre} />
                </div>
              </div>
              <Typography
                as="p"
                variant="body"
                color="muted"
                className="mb-4 zoom-text break-words"
              >
                {t("genres.description")}
              </Typography>

              <Divider />
            </div>

            {/* スクロール可能なジャンル一覧エリア */}
            <ScrollArea className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 zoom-safe">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 zoom-container">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                  <Typography variant="body" color="muted" className="zoom-text">
                    {t("genres.loading")}
                  </Typography>
                </div>
              ) : error ? (
                <div className="text-center py-8 zoom-container">
                  <div className="text-red-500 dark:text-red-400 mb-2 zoom-text">
                    {t("genres.loadError")}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 zoom-text break-words">
                    {error.message}
                  </div>
                </div>
              ) : (
                <div className="p-1.5 zoom-container">
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
