"use client";

import { Button, Typography } from "@/components/ui";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { UrlFormData, UrlFormProps } from "./UrlForm.types";

// URLメタデータの型定義
interface UrlMetadata {
  title?: string;
  description?: string;
  faviconUrl?: string;
}

export const UrlForm: React.FC<UrlFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  className,
}) => {
  const t = useTranslations("urlForm");
  const [formData, setFormData] = useState<UrlFormData>({
    url: initialData?.url || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
  });
  const [isValidating, setIsValidating] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof UrlFormData, string>>>({});
  const [metadata, setMetadata] = useState<UrlMetadata | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        url: initialData.url || "",
        title: initialData.title || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = async (url: string) => {
    setFormData(prev => ({ ...prev, url }));
    setErrors(prev => ({ ...prev, url: undefined }));
    setPreviewError(null);

    if (url && validateUrl(url)) {
      setIsValidating(true);
      try {
        const response = await fetch("/api/urls/metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        if (response.ok) {
          const fetchedMetadata = await response.json();
          setMetadata(fetchedMetadata);

          // タイトルと説明が空の場合のみ自動入力
          setFormData(prev => ({
            ...prev,
            title: prev.title || fetchedMetadata.title || "",
            description: prev.description || fetchedMetadata.description || "",
          }));
        } else {
          setPreviewError("URL情報の取得に失敗しました");
          setMetadata(null);
        }
      } catch {
        setPreviewError("URL情報の取得に失敗しました");
        setMetadata(null);
      } finally {
        setIsValidating(false);
      }
    } else {
      setMetadata(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof UrlFormData, string>> = {};

    if (!formData.url.trim()) {
      newErrors.url = t("errors.urlRequired");
    } else if (!validateUrl(formData.url)) {
      newErrors.url = t("errors.urlInvalid");
    }

    if (!formData.title?.trim()) {
      newErrors.title = t("errors.titleRequired");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      await onSubmit(formData);
    }
  };

  return (
    <div className={cn("max-w-2xl mx-auto w-full", className)}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL入力 */}
        <div className="space-y-2">
          <Typography variant="label" className="text-sm font-medium">
            {t("fields.url")} <span className="text-red-500">*</span>
          </Typography>
          <input
            type="url"
            id="url"
            value={formData.url}
            onChange={e => handleUrlChange(e.target.value)}
            placeholder={t("placeholders.url")}
            className={cn(
              "w-full px-4 py-3 border border-gray-300 rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "dark:border-gray-600 dark:bg-gray-700 dark:text-white",
              "transition-colors duration-200",
              errors.url && "border-red-500 focus:ring-red-500"
            )}
            disabled={isLoading}
          />
          {errors.url && (
            <Typography variant="caption" color="error" className="mt-1">
              {errors.url}
            </Typography>
          )}
          {isValidating && (
            <div className="flex items-center gap-2 mt-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <Typography variant="caption" color="muted">
                {t("messages.fetchingMetadata")}
              </Typography>
            </div>
          )}
        </div>

        {/* タイトル入力 */}
        <div className="space-y-2">
          <Typography variant="label" className="text-sm font-medium">
            {t("fields.title")} <span className="text-red-500">*</span>
          </Typography>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder={t("placeholders.title")}
            className={cn(
              "w-full px-4 py-3 border border-gray-300 rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "dark:border-gray-600 dark:bg-gray-700 dark:text-white",
              "transition-colors duration-200",
              errors.title && "border-red-500 focus:ring-red-500"
            )}
            disabled={isLoading}
          />
          {errors.title && (
            <Typography variant="caption" color="error" className="mt-1">
              {errors.title}
            </Typography>
          )}
        </div>

        {/* 説明入力 */}
        <div className="space-y-2">
          <Typography variant="label" className="text-sm font-medium">
            {t("fields.description")}
          </Typography>
          <textarea
            id="description"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder={t("placeholders.description")}
            rows={3}
            className={cn(
              "w-full px-4 py-3 border border-gray-300 rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "dark:border-gray-600 dark:bg-gray-700 dark:text-white",
              "transition-colors duration-200",
              "resize-vertical"
            )}
            disabled={isLoading}
          />
        </div>

        {/* 送信ボタン */}
        <div className="w-full">
          <div className="flex space-x-3" style={{ justifyContent: "flex-end" }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => window.history.back()}
              disabled={isLoading}
            >
              {t("buttons.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading || isValidating} className="min-w-[120px]">
              {isLoading ? t("buttons.saving") : t("buttons.save")}
            </Button>
          </div>
        </div>
      </form>

      {/* URLプレビュー */}
      {(metadata || previewError) && (
        <div className="mt-8">
          <Typography variant="label" className="text-sm font-medium mb-4 block">
            プレビュー
          </Typography>

          {previewError ? (
            <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <Typography variant="body2" color="error">
                {previewError}
              </Typography>
            </div>
          ) : metadata ? (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-start gap-4">
                {/* Favicon */}
                <div className="flex-shrink-0">
                  {metadata.faviconUrl ? (
                    <Image
                      src={metadata.faviconUrl}
                      alt="Favicon"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded"
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* コンテンツ */}
                <div className="flex-1 min-w-0">
                  <Typography variant="body1" weight="medium" className="line-clamp-2 mb-1">
                    {metadata.title || formData.title || "タイトルなし"}
                  </Typography>
                  <Typography variant="body2" color="muted" className="line-clamp-3 mb-2">
                    {metadata.description || formData.description || "説明なし"}
                  </Typography>
                  <Typography variant="caption" color="muted" className="break-all">
                    {formData.url}
                  </Typography>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
