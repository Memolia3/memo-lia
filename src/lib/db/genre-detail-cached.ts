import { GenreDetailData, getGenreDetailOptimized } from "@/lib/db/genre-detail-optimized";
import { unstable_cache } from "next/cache";

/**
 * キャッシュ付きジャンル詳細データ取得
 * 60秒間キャッシュし、ジャンル更新時に無効化
 */
export const getCachedGenreDetail = (
  categoryId: string,
  genreId: string,
  userId: string,
  limit: number = 20
): Promise<GenreDetailData | null> => {
  return unstable_cache(
    async () => getGenreDetailOptimized(categoryId, genreId, userId, limit),
    [`genre-detail-${genreId}`],
    {
      revalidate: 60,
      tags: [`genre-${genreId}`, `category-${categoryId}`, `user-${userId}`],
    }
  )();
};
