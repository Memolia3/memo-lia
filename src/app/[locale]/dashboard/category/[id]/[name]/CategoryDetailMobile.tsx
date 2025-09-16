"use client";

import { AppHeader } from "@/components/layout";
import { Divider, Icon, Loading, ScrollArea, Typography, UserInfo } from "@/components/ui";
import { ActionButtons } from "@/features/categoryDetail/components/ActionButtons";
import { GenreCreateButton } from "@/features/categoryDetail/components/GenreCreateButton";
import { GenreGrid } from "@/features/categoryDetail/components/GenreGrid";
import { useCategoryDetail, useGenres } from "@/features/categoryDetail/hooks";
import { CategoryDetailMobileProps } from "@/features/categoryDetail/types";
import { AdSense } from "@/features/google";
import { cn } from "@/utils";
import { Folder } from "lucide-react";
import { useTranslations } from "next-intl";

export const CategoryDetailMobile: React.FC<CategoryDetailMobileProps> = ({
  category,
  className,
}) => {
  const t = useTranslations("categoryDetail");
  const { handleBackToDashboard, handleCreateGenre } = useCategoryDetail(category);
  const { genres, isLoading, error, handleGenreDelete } = useGenres(category.id, category.userId);

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <AppHeader title={t("title")} userInfo={<UserInfo />} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="w-full flex flex-col h-full px-4">
          {/* カテゴリ情報 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-1 flex-shrink-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                {category.icon ? (
                  <Icon name={category.icon} className="w-6 h-6 text-primary" />
                ) : (
                  <Folder
                    className="w-6 h-6 text-primary"
                    style={{ color: category.color || undefined }}
                  />
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ジャンル一覧 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col flex-1 min-h-0 mb-4">
            <div className="p-4 flex-shrink-0">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <Typography as="h2" variant="h5" weight="semibold" color="primary">
                    {t("genres.title")}
                  </Typography>
                  <div className="flex items-center">
                    <Typography as="span" variant="body-sm" color="muted">
                      {t("genres.count")}:
                    </Typography>
                    <Typography
                      as="span"
                      variant="h5"
                      weight="semibold"
                      color="accent"
                      className="ml-2"
                    >
                      {genres.length}
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-3">
                <ActionButtons onBackToDashboard={handleBackToDashboard} />
                <GenreCreateButton onCreateGenre={handleCreateGenre} />
              </div>

              <Divider padding="sm" />
            </div>

            {/* スクロール可能なジャンル一覧エリア */}
            <ScrollArea className="flex-1 px-4 pb-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loading
                    size="lg"
                    variant="spinner"
                    text={t("genres.loading")}
                    showBackground={false}
                  />
                </div>
              ) : error ? (
                <div className="text-center py-6">
                  <div className="text-red-500 dark:text-red-400 mb-2">{t("genres.loadError")}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{error.message}</div>
                </div>
              ) : (
                <div className="p-1.5">
                  <GenreGrid genres={genres} onGenreDelete={handleGenreDelete} />
                </div>
              )}
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
