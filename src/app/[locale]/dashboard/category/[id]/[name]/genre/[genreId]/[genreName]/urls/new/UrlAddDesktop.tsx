"use client";

import { createUrlAction } from "@/actions/urls";
import { AppHeader } from "@/components/layout";
import { useNotification } from "@/components/notification";
import { ScrollArea, UserInfo } from "@/components/ui";
import { AdSense } from "@/features/google";
import { UrlForm, UrlFormData } from "@/features/urls";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CategoryData {
  id: string;
  name: string;
}

interface GenreData {
  id: string;
  name: string;
}

export interface UrlAddDesktopProps {
  category: CategoryData;
  genre: GenreData;
  locale: string;
  className?: string;
}

export default function UrlAddDesktop({ category, genre, locale, className }: UrlAddDesktopProps) {
  const t = useTranslations("urlForm");
  const router = useRouter();
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: UrlFormData) => {
    setIsLoading(true);
    try {
      // URLメタデータを取得
      let urlMetadata = {
        title: data.title,
        description: data.description,
        faviconUrl: undefined as string | undefined,
      };

      try {
        const metadataResponse = await fetch("/api/urls/metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: data.url }),
        });

        if (metadataResponse.ok) {
          const metadata = await metadataResponse.json();
          urlMetadata = {
            title: data.title || metadata.title || "",
            description: data.description || metadata.description || "",
            faviconUrl: metadata.faviconUrl,
          };
        }
      } catch {
        // メタデータ取得に失敗した場合は元のデータを使用
      }

      await createUrlAction({
        genreId: genre.id,
        title: urlMetadata.title!,
        url: data.url,
        description: urlMetadata.description,
        faviconUrl: urlMetadata.faviconUrl,
      });

      addNotification({
        type: "success",
        title: "URL作成完了",
        description: "URLが正常に作成されました。",
      });

      const encodedCategoryName = encodeURIComponent(category.name);
      const encodedGenreName = encodeURIComponent(genre.name);
      const basePath = `/${locale}/dashboard/category/${category.id}/${encodedCategoryName}`;
      const redirectPath = `${basePath}/genre/${genre.id}/${encodedGenreName}`;
      router.push(redirectPath);
    } catch (error) {
      addNotification({
        type: "error",
        title: "URL作成エラー",
        description: error instanceof Error ? error.message : "URLの作成に失敗しました。",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <AppHeader title={t("title")} userInfo={<UserInfo />} />

      <ScrollArea className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex items-center min-h-full">
          <UrlForm onSubmit={handleSubmit} isLoading={isLoading} className="w-full" />
        </div>
      </ScrollArea>

      {/* AdSense広告 - 画面の一番下 */}
      <div className="px-4 py-4 sm:px-6 sm:py-6 border-t border-gray-200 dark:border-gray-700">
        <AdSense adSlot="1234567890" adFormat="fluid" responsive={true} className="w-full" />
      </div>
    </div>
  );
}
