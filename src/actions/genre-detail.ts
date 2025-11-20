"use server";

import { auth } from "@/auth";
import { getGenreDetailOptimized } from "@/lib/db/genre-detail-optimized";

/**
 * ジャンル詳細データを取得する最適化されたServer Action
 */
export async function getGenreDetailAction(
  categoryId: string,
  genreId: string,
  limit: number = 20
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("認証が必要です");
  }

  if (!genreId) {
    throw new Error("ジャンルIDが必要です");
  }

  if (!categoryId) {
    throw new Error("カテゴリIDが必要です");
  }

  // 単一クエリで全データ取得
  const data = await getGenreDetailOptimized(categoryId, genreId, userId, limit);

  if (!data) {
    return null;
  }

  return {
    category: data.category,
    genre: data.genre,
    urls: data.urls,
  };
}
