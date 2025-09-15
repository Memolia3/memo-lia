"use client";

import { Button, Typography } from "@/components/ui";
import { UrlPreview } from "@/components/url";
import { useUrlMetadata } from "@/hooks";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { UrlFormData, UrlFormProps } from "./UrlForm.types";

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
  const [errors, setErrors] = useState<Partial<Record<keyof UrlFormData, string>>>({});

  // URLメタデータ取得フック
  const {
    metadata,
    isLoading: isValidating,
    error: previewError,
  } = useUrlMetadata(
    formData.url,
    { autoFetch: true, debounceMs: 800 } // 自動取得を有効にして、デバウンスを長めに設定
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        url: initialData.url || "",
        title: initialData.title || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  // メタデータが取得されたときに自動入力（タイトルと説明が空の場合のみ）
  useEffect(() => {
    if (metadata && formData.url && !formData.title && !formData.description) {
      setFormData(prev => ({
        ...prev,
        title: metadata.title || "",
        description: metadata.description || "",
      }));
    }
  }, [metadata, formData.url, formData.title, formData.description]);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, url }));
    setErrors(prev => ({ ...prev, url: undefined }));
    // メタデータの取得はuseUrlMetadataフックが自動で行う
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
            <Typography variant="caption" color="primary" className="mt-1 text-red-500">
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
            <Typography variant="caption" color="primary" className="mt-1 text-red-500">
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
              className="min-w-[100px]"
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
      <UrlPreview metadata={metadata} error={previewError} isLoading={isValidating} />
    </div>
  );
};
