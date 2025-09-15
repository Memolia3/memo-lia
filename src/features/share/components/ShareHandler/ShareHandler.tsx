"use client";

import { createUrlAction } from "@/actions/urls";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useSession } from "@/features/auth/hooks";
import { useCategories } from "@/features/dashboard/hooks/useCategories";
import { useNotificationHelpers } from "@/hooks/useNotificationHelpers";
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
}

export const ShareHandler: React.FC<ShareHandlerProps> = ({ locale, sharedData }) => {
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
    <div className="w-full space-y-6">
      <div className="text-center">
        <Typography variant="h2" className="mb-2">
          {t("title")}
        </Typography>
        <Typography variant="body" color="muted">
          {t("description")}
        </Typography>
      </div>

      {/* 共有されたデータの表示 */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <Typography variant="h3" className="mb-2">
          {sharedData.title || t("noTitle")}
        </Typography>
        <Typography variant="body" className="mb-2">
          {sharedData.url}
        </Typography>
        {sharedData.text && (
          <Typography variant="body" color="muted">
            {sharedData.text}
          </Typography>
        )}
      </div>

      {/* カテゴリ選択 */}
      <div>
        <Typography variant="label" className="mb-2">
          {t("selectCategory")}
        </Typography>
        <select
          value={selectedCategoryId}
          onChange={e => setSelectedCategoryId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">{t("selectCategoryPlaceholder")}</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* ジャンル選択 */}
      {selectedCategoryId && (
        <div>
          <Typography variant="label" className="mb-2">
            {t("selectGenre")}
          </Typography>
          <select
            value={selectedGenreId}
            onChange={e => setSelectedGenreId(e.target.value)}
            disabled={genresLoading}
            className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50"
          >
            <option value="">
              {genresLoading ? t("loadingGenres") : t("selectGenrePlaceholder")}
            </option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 保存ボタン */}
      <div className="flex gap-4">
        <Button
          onClick={handleSave}
          disabled={!selectedGenreId || isLoading || genresLoading}
          className="flex-1"
        >
          {isLoading ? t("saving") : t("save")}
        </Button>
        <Button variant="secondary" onClick={() => router.push(`/${locale}/dashboard`)}>
          {t("cancel")}
        </Button>
      </div>
    </div>
  );
};
