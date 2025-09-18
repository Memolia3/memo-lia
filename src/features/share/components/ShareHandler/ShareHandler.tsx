"use client";

import { createUrlAction } from "@/actions/urls";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { UrlPreview } from "@/components/url";
import { useSession } from "@/features/auth/hooks";
import { useCategories } from "@/features/dashboard/hooks/useCategories";
import { useNotificationHelpers, useUrlMetadata } from "@/hooks";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGenres } from "../../hooks/useGenres";
import { validateBookmarkletSecurity, validateUrl } from "../../hooks/useShareValidation";

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
  const tForm = useTranslations("urlForm");
  const [isLoading, setIsLoading] = useState(false);

  // セキュリティ検証
  const [securityError, setSecurityError] = useState<string | null>(null);

  // URLメタデータ取得フック
  const {
    metadata,
    isLoading: isValidating,
    error: previewError,
  } = useUrlMetadata(sharedData.url || "", { autoFetch: !!sharedData.url && !!session?.user?.id });

  // セキュリティ検証の実行（ブックマークレット対応）
  useEffect(() => {
    if (sharedData.url && sharedData.title) {
      // ブックマークレットからのアクセスの場合は検証を緩和
      const isBookmarklet =
        !document.referrer ||
        document.referrer.includes("javascript:") ||
        document.referrer.includes("bookmarklet") ||
        document.referrer.includes("memolia");

      if (isBookmarklet) {
        // ブックマークレットの場合は基本的な検証のみ
        const basicCheck = validateUrl(sharedData.url);
        if (!basicCheck) {
          setSecurityError("Invalid URL");
        } else {
          setSecurityError(null);
        }
      } else {
        // 通常のアクセスの場合は完全な検証
        const securityCheck = validateBookmarkletSecurity(
          sharedData.url,
          sharedData.title,
          navigator.userAgent,
          document.referrer
        );

        if (!securityCheck.isValid) {
          setSecurityError(securityCheck.reason || "Security validation failed");
        } else {
          setSecurityError(null);
        }
      }
    }
  }, [sharedData.url, sharedData.title]);

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
      // メタデータから取得した情報を使用
      let urlMetadata = {
        title: sharedData.title || "",
        description: sharedData.text || "",
        faviconUrl: undefined as string | undefined,
      };

      if (metadata) {
        urlMetadata = {
          title: sharedData.title || metadata.title || t("defaultTitle"),
          description: sharedData.text || metadata.description || "",
          faviconUrl: metadata.faviconUrl,
        };
      }

      await createUrlAction({
        genreId: selectedGenreId,
        title: urlMetadata.title,
        url: sharedData.url,
        description: urlMetadata.description,
        faviconUrl: urlMetadata.faviconUrl,
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
            {tForm("fields.url")} <span className="text-red-500">*</span>
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
              placeholder={tForm("placeholders.url")}
            />
            {isValidating && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* タイトル入力フィールド */}
        <div className="space-y-2">
          <Typography variant="label" className="text-sm font-medium">
            {tForm("fields.title")}
          </Typography>
          <input
            type="text"
            value={metadata?.title || sharedData.title || ""}
            readOnly
            className="w-full px-4 py-3 border border-white/20 rounded-lg
              bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm
              text-white dark:text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
              transition-all duration-200"
            placeholder={tForm("placeholders.title")}
          />
        </div>

        {/* 説明入力フィールド */}
        <div className="space-y-2">
          <Typography variant="label" className="text-sm font-medium">
            {tForm("fields.description")}
          </Typography>
          <textarea
            value={metadata?.description || sharedData.text || ""}
            readOnly
            rows={3}
            className="w-full px-4 py-3 border border-white/20 rounded-lg
              bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm
              text-white dark:text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
              transition-all duration-200 resize-none"
            placeholder={tForm("placeholders.description")}
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
              bg-gray-800 dark:bg-gray-800
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
                bg-gray-800 dark:bg-gray-800
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
        <div className="w-full">
          <div className="flex space-x-3" style={{ justifyContent: "flex-end" }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(`/${locale}/dashboard`)}
              disabled={isLoading}
              className="min-w-[100px]"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={!selectedGenreId || isLoading || genresLoading || isValidating}
              className="min-w-[120px]"
            >
              {isLoading ? t("saving") : t("save")}
            </Button>
          </div>
        </div>
      </form>

      {/* セキュリティエラー表示 */}
      {securityError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
          <Typography variant="body" className="text-red-400 font-medium">
            {t("securityError")}
          </Typography>
          <Typography variant="body-sm" className="text-red-300 mt-2">
            {securityError}
          </Typography>
        </div>
      )}

      {/* URLプレビュー */}
      {!securityError && (
        <UrlPreview metadata={metadata} error={previewError} isLoading={isValidating} />
      )}
    </div>
  );
};
