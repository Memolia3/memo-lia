"use server";

import {
  getCategories as dbGetCategories,
  getCategoryById as dbGetCategoryById,
  getGenresByCategory as dbGetGenresByCategory,
  type CategoryData,
  type GenreData,
} from "@/lib/db";

// 型定義はデータベースアクセス層から再エクスポート
export type { CategoryData, GenreData } from "@/lib/db";

/**
 * ユーザーのカテゴリ一覧を取得
 */
export async function getCategories(userId: string): Promise<CategoryData[]> {
  return dbGetCategories(userId);
}

/**
 * カテゴリの詳細情報を取得
 */
export async function getCategoryById(
  categoryId: string,
  userId: string
): Promise<CategoryData | null> {
  return dbGetCategoryById(categoryId, userId);
}

/**
 * カテゴリ内のジャンル一覧を取得
 */
export async function getGenresByCategory(
  categoryId: string,
  userId: string
): Promise<GenreData[]> {
  return dbGetGenresByCategory(categoryId, userId);
}
