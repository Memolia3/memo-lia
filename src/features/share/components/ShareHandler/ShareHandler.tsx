"use client";

import { createUrlAction } from "@/actions/urls";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useSession } from "@/features/auth/hooks";
import { useCategories } from "@/features/dashboard/hooks/useCategories";
import { useNotificationHelpers } from "@/hooks/useNotificationHelpers";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGenres } from "../../hooks/useGenres";

interface SharedData {
  title?: string;
  text?: string;
  url?: string;
}

interface ShareHandlerProps {
  locale: string;
  sharedData: SharedData;
  className?: string;
}

export const ShareHandler: React.FC<ShareHandlerProps> = ({ locale, sharedData, className }) => {
  const { session } = useSession();
  const { data: categories = [] } = useCategories(session?.user?.id || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedGenreId, setSelectedGenreId] = useState<string>("");
  const { genres, fetchGenres, isLoading: genresLoading } = useGenres();
  const { showSuccess, showError } = useNotificationHelpers();
  const router = useRouter();
  const t = useTranslations("share");
  const [isLoading, setIsLoading] = useState(false);

  // カテゴリが変更されたときにジャンルを取得
  useEffect(() => {
    if (selectedCategoryId && session?.user?.id) {
      fetchGenres(selectedCategoryId, session.user.id);
      setSelectedGenreId(""); // ジャンル選択をリセット
    } else {
      setSelectedGenreId("");
    }
  }, [selectedCategoryId, fetchGenres, session?.user?.id]);

  const handleSave = async () => {
    if (!session?.user?.id || !selectedGenreId || !sharedData.url) {
      showError({
        type: "error",
        message: t("missingInfo"),
      });
      return;
    }

    setIsLoading(true);
    try {
      await createUrlAction({
        genreId: selectedGenreId,
        title: sharedData.title || t("defaultTitle"),
        url: sharedData.url,
        description: sharedData.text,
      });

      showSuccess({
        type: "success",
        message: t("saved"),
      });

      router.push(`/${locale}/dashboard`);
    } catch {
      showError({
        type: "error",
        message: t("saveError"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("max-w-2xl mx-auto w-full", className)}>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-6"
      >
        {/* URL入力フィールド */}
        <div className="space-y-2">
          <Typography variant="label" className="text-sm font-medium">
            URL <span className="text-red-500">*</span>
          </Typography>
          <div className="relative">
            <input
              type="url"
              value={sharedData.url || ""}
              readOnly
              className="w-full px-4 py-3 border border-white/20 rounded-lg
                bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm
                text-white dark:text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                transition-all duration-200"
              placeholder="https://example.com"
            />
          </div>
        </div>

        {/* タイトル入力フィールド */}
        <div className="space-y-2">
          <Typography variant="label" className="text-sm font-medium">
            タイトル
          </Typography>
          <input
            type="text"
            value={sharedData.title || ""}
            readOnly
            className="w-full px-4 py-3 border border-white/20 rounded-lg
              bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm
              text-white dark:text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
              transition-all duration-200"
            placeholder="サイトのタイトル"
          />
        </div>

        {/* 説明入力フィールド */}
        <div className="space-y-2">
          <Typography variant="label" className="text-sm font-medium">
            説明
          </Typography>
          <textarea
            value={sharedData.text || ""}
            readOnly
            rows={3}
            className="w-full px-4 py-3 border border-white/20 rounded-lg
              bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm
              text-white dark:text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
              transition-all duration-200 resize-none"
            placeholder="このURLについての説明（任意）"
          />
        </div>

        {/* カテゴリ選択 */}
        <div className="space-y-2">
          <Typography variant="label" className="text-sm font-medium">
            {t("selectCategory")} <span className="text-red-500">*</span>
          </Typography>
          <select
            value={selectedCategoryId}
            onChange={e => setSelectedCategoryId(e.target.value)}
            className="w-full px-4 py-3 border border-white/20 rounded-lg
              bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm
              text-white dark:text-white
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
              transition-all duration-200"
          >
            <option value="" className="bg-gray-800 text-white">
              {t("selectCategoryPlaceholder")}
            </option>
            {categories.map(category => (
              <option key={category.id} value={category.id} className="bg-gray-800 text-white">
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* ジャンル選択 */}
        {selectedCategoryId && (
          <div className="space-y-2">
            <Typography variant="label" className="text-sm font-medium">
              {t("selectGenre")} <span className="text-red-500">*</span>
            </Typography>
            <select
              value={selectedGenreId}
              onChange={e => setSelectedGenreId(e.target.value)}
              disabled={genresLoading}
              className="w-full px-4 py-3 border border-white/20 rounded-lg
                bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm
                text-white dark:text-white disabled:opacity-50
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                transition-all duration-200"
            >
              <option value="" className="bg-gray-800 text-white">
                {genresLoading ? t("loadingGenres") : t("selectGenrePlaceholder")}
              </option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id} className="bg-gray-800 text-white">
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ボタン */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={!selectedGenreId || isLoading || genresLoading}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white
              rounded-lg font-medium transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t("saving") : t("save")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/${locale}/dashboard`)}
            className="px-6 py-3 border border-white/20 text-white
              hover:bg-white/10 rounded-lg font-medium
              transition-colors duration-200"
          >
            {t("cancel")}
          </Button>
        </div>
      </form>
    </div>
  );
};
