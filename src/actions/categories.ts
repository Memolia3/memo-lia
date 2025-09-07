"use server";

import {
  createCategory as dbCreateCategory,
  deleteCategory as dbDeleteCategory,
  getCategories as dbGetCategories,
  getCategoryById as dbGetCategoryById,
  getGenresByCategory as dbGetGenresByCategory,
  type CategoryData,
  type CreateCategoryData,
  type GenreData,
} from "@/lib/db";

// 型定義はデータベースアクセス層から再エクスポート
export type { CategoryData, CreateCategoryData, DeleteCategoryData, GenreData } from "@/lib/db";

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
