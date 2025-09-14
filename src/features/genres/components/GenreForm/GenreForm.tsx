"use client";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { GenreFormData, GenreFormErrors, GenreFormProps } from "./GenreForm.types";

/**
 * ジャンル作成フォームコンポーネント
 */
export const GenreForm: React.FC<GenreFormProps> = ({
  categoryId,
  onSubmit,
  isLoading = false,
  className,
}) => {
  const t = useTranslations("genreForm");
  const [formData, setFormData] = useState<GenreFormData>({
    name: "",
    description: "",
    color: "#3B82F6", // デフォルトの青色
  });
  const [errors, setErrors] = useState<GenreFormErrors>({});

  // バリデーション
  const validateForm = (): boolean => {
    const newErrors: GenreFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("errors.nameRequired");
    } else if (formData.name.length > 50) {
      newErrors.name = t("errors.nameTooLong");
    }

    if (formData.description.length > 200) {
      newErrors.description = t("errors.descriptionTooLong");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit({
        categoryId,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
      });
    } catch {}
  };

  return (
    <div className={cn("max-w-2xl mx-auto w-full", className)}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ジャンル名 */}
        <div className="space-y-2">
          <Typography variant="label" className="text-sm font-medium">
            {t("fields.name")} <span className="text-red-500">*</span>
          </Typography>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={cn(
              "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "dark:border-gray-600 dark:bg-gray-700 dark:text-white",
              errors.name && "border-red-500 focus:ring-red-500"
            )}
            placeholder={t("placeholders.name")}
            disabled={isLoading}
          />
          {errors.name && (
            <Typography variant="caption" className="text-red-500">
              {errors.name}
            </Typography>
          )}
        </div>

        {/* 説明 */}
        <div className="space-y-2">
          <Typography variant="label" className="text-sm font-medium">
            {t("fields.description")}
          </Typography>
          <textarea
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className={cn(
              "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none",
              "dark:border-gray-600 dark:bg-gray-700 dark:text-white",
              errors.description && "border-red-500 focus:ring-red-500"
            )}
            placeholder={t("placeholders.description")}
            rows={3}
            disabled={isLoading}
          />
          {errors.description && (
            <Typography variant="caption" className="text-red-500">
              {errors.description}
            </Typography>
          )}
        </div>

        {/* 色選択 */}
        <div className="space-y-2">
          <Typography variant="label" className="text-sm font-medium">
            {t("fields.color")}
          </Typography>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={formData.color}
              onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
              className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
              disabled={isLoading}
            />
            <input
              type="text"
              value={formData.color}
              onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="#3B82F6"
              disabled={isLoading}
            />
          </div>
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
            <Button type="submit" disabled={isLoading} className="min-w-[120px]">
              {isLoading ? t("buttons.creating") : t("buttons.create")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
