"use server";

import { GENRE_ERROR_MESSAGES } from "@/constants/error-messages";
import {
  createCategory as dbCreateCategory,
  deleteCategory as dbDeleteCategory,
  getCategories as dbGetCategories,
  getCategoryById as dbGetCategoryById,
  getCategoryDeletionStats as dbGetCategoryDeletionStats,
  type CategoryData,
  type CategoryDeletionStats,
  type CreateCategoryData,
} from "@/lib/db";

import {
  createGenre as dbCreateGenre,
  deleteGenre as dbDeleteGenre,
  getGenreById as dbGetGenreById,
  getGenreDeletionStats as dbGetGenreDeletionStats,
  getGenresByCategory as dbGetGenresByCategory,
  type CreateGenreData,
  type GenreData,
  type GenreDeletionStats,
} from "@/lib/db/genres";

// 型定義はデータベースアクセス層から再エクスポート
export type { CategoryData, CategoryDeletionStats, CreateCategoryData } from "@/lib/db";

export type { CreateGenreData, GenreData, GenreDeletionStats } from "@/lib/db/genres";

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

/**
 * 新しいカテゴリを作成（Server Action）
 */
export async function createCategory(
  userId: string,
  categoryData: CreateCategoryData
): Promise<CategoryData> {
  try {
    // セッション検証（必要に応じて）
    if (!userId) {
      throw new Error("ユーザーIDが指定されていません");
    }

    // UUID形式の検証
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      throw new Error("無効なユーザーIDです");
    }

    // データベース層の関数を呼び出し
    const result = await dbCreateCategory(userId, categoryData);

    return result;
  } catch (error) {
    // エラーを再スロー（クライアントに適切なメッセージを提供）
    throw error;
  }
}

/**
 * カテゴリ削除時の影響を取得
 * @param categoryId カテゴリID
 * @returns 削除影響の統計情報
 */
export async function getCategoryDeletionStats(
  categoryId: string
): Promise<CategoryDeletionStats | null> {
  try {
    // セッションからユーザーIDを取得
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("認証が必要です");
    }

    const userId = session.user.id;

    // バリデーション
    if (!categoryId) {
      throw new Error("カテゴリIDは必須です");
    }

    // データベース層の関数を呼び出し
    const result = await dbGetCategoryDeletionStats(categoryId, userId);

    return result;
  } catch (error) {
    // エラーを再スロー（クライアントに適切なメッセージを提供）
    throw error;
  }
}

/**
 * カテゴリを削除
 * @param categoryId 削除するカテゴリのID
 * @returns 削除されたカテゴリのID
 */
export async function deleteCategory(categoryId: string): Promise<string> {
  try {
    // セッションからユーザーIDを取得
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("認証が必要です");
    }

    const userId = session.user.id;

    // バリデーション
    if (!categoryId) {
      throw new Error("カテゴリIDは必須です");
    }

    // データベース層の関数を呼び出し
    const result = await dbDeleteCategory({ categoryId, userId });

    return result;
  } catch (error) {
    // エラーを再スロー（クライアントに適切なメッセージを提供）
    throw error;
  }
}

/**
 * 新しいジャンルを作成（Server Action）
 */
export async function createGenre(userId: string, genreData: CreateGenreData): Promise<GenreData> {
  try {
    // セッション検証（必要に応じて）
    if (!userId) {
      throw new Error(GENRE_ERROR_MESSAGES.USER_ID_NOT_PROVIDED);
    }

    // UUID形式の検証
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      throw new Error(GENRE_ERROR_MESSAGES.INVALID_USER_ID);
    }

    if (!uuidRegex.test(genreData.categoryId)) {
      throw new Error(GENRE_ERROR_MESSAGES.INVALID_CATEGORY);
    }

    // データベース層の関数を呼び出し
    const result = await dbCreateGenre(userId, genreData);

    return result;
  } catch (error) {
    // エラーを再スロー（クライアントに適切なメッセージを提供）
    throw error;
  }
}

/**
 * ジャンル削除時の影響を取得
 * @param genreId ジャンルID
 * @returns 削除影響の統計情報
 */
export async function getGenreDeletionStats(genreId: string): Promise<GenreDeletionStats | null> {
  try {
    // セッションからユーザーIDを取得
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("認証が必要です");
    }

    const userId = session.user.id;

    // バリデーション
    if (!genreId) {
      throw new Error("ジャンルIDは必須です");
    }

    // データベース層の関数を呼び出し
    const result = await dbGetGenreDeletionStats(genreId, userId);

    return result;
  } catch (error) {
    // エラーを再スロー（クライアントに適切なメッセージを提供）
    throw error;
  }
}

/**
 * ジャンルを削除（Server Action）
 */
export async function deleteGenre(genreId: string, userId: string): Promise<string> {
  try {
    // セッション検証（必要に応じて）
    if (!userId) {
      throw new Error("ユーザーIDが指定されていません");
    }

    // UUID形式の検証
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      throw new Error("無効なユーザーIDです");
    }

    if (!uuidRegex.test(genreId)) {
      throw new Error("無効なジャンルIDです");
    }

    // データベース層の関数を呼び出し
    const result = await dbDeleteGenre(genreId, userId);

    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * ジャンルをIDで取得
 */
export async function getGenreById(genreId: string, userId: string) {
  if (!userId) {
    throw new Error(GENRE_ERROR_MESSAGES.USER_ID_NOT_PROVIDED);
  }

  if (!genreId) {
    throw new Error(GENRE_ERROR_MESSAGES.INVALID_CATEGORY);
  }

  try {
    return await dbGetGenreById(genreId, userId);
  } catch (error) {
    throw error;
  }
}
