import { CategoryDetailData, getCategoryDetailOptimized } from "@/lib/db/category-detail-optimized";
import { unstable_cache } from "next/cache";

/**
 * キャッシュ付きカテゴリ詳細データ取得
 * 60秒間キャッシュし、カテゴリ更新時に無効化
 */
export const getCachedCategoryDetail = (
  categoryId: string,
  userId: string
): Promise<CategoryDetailData | null> => {
  return unstable_cache(
    async () => getCategoryDetailOptimized(categoryId, userId),
    [`category-detail-${categoryId}`],
    {
      revalidate: 60,
      tags: [`category-${categoryId}`, `user-${userId}`],
    }
  )();
};
