"use client";

import { AppHeader } from "@/components/layout";
import { Icon, Typography, UserInfo } from "@/components/ui";
import { AdSense } from "@/features/google";
import { cn } from "@/utils";
import { Folder } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCategoryDetail } from "../../hooks/useCategoryDetail";
import { useGenres } from "../../hooks/useGenres";
import { CategoryDetailDesktopProps, GenreData } from "../../types";
import { ActionButtons } from "../ActionButtons";
import { GenreCreateButton } from "../GenreCreateButton";
import { GenreGrid } from "../GenreGrid";

export const CategoryDetailDesktop: React.FC<CategoryDetailDesktopProps> = ({
  category,
  locale,
  className,
}) => {
  const t = useTranslations("categoryDetail");
  const { handleBackToDashboard, handleCreateGenre } = useCategoryDetail(category);
  const { genres, isLoading, handleGenreDelete } = useGenres(category.id, category.userId);

  const handleGenreClick = (genre: GenreData) => {
    // TODO: ジャンル詳細画面への遷移
    // eslint-disable-next-line no-console
    console.log("Genre clicked:", genre);
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <AppHeader title={t("title")} userInfo={<UserInfo />} />

      <main className="flex-1 overflow-auto px-4 py-6 sm:px-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* カテゴリ情報 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
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

            {isLoading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">読み込み中...</div>
            ) : (
              <GenreGrid
                genres={genres}
                onGenreClick={handleGenreClick}
                onGenreDelete={handleGenreDelete}
              />
            )}
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
