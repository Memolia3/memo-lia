import { COMMON_ERROR_MESSAGES, GENRE_ERROR_MESSAGES } from "@/constants/error-messages";
import { executeTransactionWithErrorHandling } from "@/lib/db/transaction";
import { Genre } from "@/types/database";
import { neon } from "@neondatabase/serverless";
import { revalidateTag } from "next/cache";

const sql = neon(process.env.DATABASE_URL!);

/**
 * ジャンルデータの型定義
 */
export interface GenreData {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * ジャンル作成の入力データ型
 */
export interface CreateGenreData {
  categoryId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

/**
 * ジャンル削除時の影響統計
 */
export interface GenreDeletionStats {
  genreName: string;
  urlCount: number;
  urlTitles: string[];
}

/**
 * カテゴリ内のジャンル一覧を取得
 */
export async function getGenresByCategory(
  categoryId: string,
  userId: string
): Promise<GenreData[]> {
  try {
    const result = await sql`
      SELECT
        g.id,
        g.user_id,
        g.category_id,
        g.name,
        g.description,
        g.color,
        g.icon,
        g.sort_order,
        g.is_active,
        g.created_at,
        g.updated_at
      FROM genres g
      WHERE g.category_id = ${categoryId}
        AND g.user_id = ${userId}
        AND g.is_active = true
      ORDER BY g.sort_order ASC, g.created_at ASC
    `;

    return result.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      userId: row.user_id as string,
      categoryId: row.category_id as string,
      name: row.name as string,
      description: row.description as string | undefined,
      color: row.color as string | undefined,
      icon: row.icon as string | undefined,
      sortOrder: row.sort_order as number,
      isActive: row.is_active as boolean,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    }));
  } catch {
    throw new Error(COMMON_ERROR_MESSAGES.FETCH_FAILED);
  }
}

/**
 * ジャンルをIDで取得
 */
export const getGenreById = async (genreId: string, userId: string): Promise<Genre | null> => {
  try {
    const result = await sql`
      SELECT
        g.id,
        g.user_id,
        g.category_id,
        g.name,
        g.description,
        g.color,
        g.icon,
        g.sort_order,
        g.is_active,
        g.created_at,
        g.updated_at,
        c.name as category_name
      FROM genres g
      INNER JOIN categories c ON g.category_id = c.id
      WHERE g.id = ${genreId} AND g.user_id = ${userId} AND g.is_active = true
    `;

    if (result.length === 0) {
      return null;
    }

    const row = result[0] as Record<string, unknown>;
    return {
      id: row.id as string,
      user_id: row.user_id as string,
      category_id: row.category_id as string,
      name: row.name as string,
      description: row.description as string | undefined,
      color: row.color as string | undefined,
      icon: row.icon as string | undefined,
      sort_order: row.sort_order as number,
      is_active: row.is_active as boolean,
      created_at: row.created_at as Date,
      updated_at: row.updated_at as Date,
    };
  } catch {
    throw new Error(COMMON_ERROR_MESSAGES.FETCH_FAILED);
  }
};

/**
 * ジャンルのソート順を取得
 */
async function getNextGenreSortOrder(userId: string, categoryId: string): Promise<number> {
  try {
    const result = await sql`
      SELECT COALESCE(MAX(sort_order), 0) + 1 as next_sort_order
      FROM genres
      WHERE user_id = ${userId} AND category_id = ${categoryId} AND is_active = true
    `;
    return result[0]?.next_sort_order || 1;
  } catch {
    throw new Error(COMMON_ERROR_MESSAGES.SORT_ORDER_FAILED);
  }
}

/**
 * ジャンル名の重複チェック（カテゴリ内で）
 */
async function checkGenreNameExists(
  userId: string,
  categoryId: string,
  name: string
): Promise<boolean> {
  try {
    const result = await sql`
      SELECT COUNT(*) as count
      FROM genres
      WHERE user_id = ${userId}
        AND category_id = ${categoryId}
        AND name = ${name.trim()}
        AND is_active = true
    `;
    return (result[0]?.count || 0) > 0;
  } catch {
    throw new Error(COMMON_ERROR_MESSAGES.DUPLICATE_CHECK_FAILED);
  }
}

/**
 * ジャンル作成のバリデーション
 */
function validateGenreData(data: CreateGenreData): void {
  if (!data.name || data.name.trim().length === 0) {
    throw new Error(COMMON_ERROR_MESSAGES.NAME_REQUIRED);
  }

  if (data.name.length > 50) {
    throw new Error(COMMON_ERROR_MESSAGES.NAME_TOO_LONG);
  }

  if (data.description && data.description.length > 200) {
    throw new Error(COMMON_ERROR_MESSAGES.DESCRIPTION_TOO_LONG);
  }

  if (data.color && !/^#[0-9A-Fa-f]{6}$/.test(data.color)) {
    throw new Error(COMMON_ERROR_MESSAGES.INVALID_COLOR_CODE);
  }
}

/**
 * 新しいジャンルを作成
 */
export async function createGenre(userId: string, genreData: CreateGenreData): Promise<GenreData> {
  // 1. 入力データのバリデーション
  validateGenreData(genreData);

  // 2. ジャンル名の重複チェック（カテゴリ内で）
  const nameExists = await checkGenreNameExists(userId, genreData.categoryId, genreData.name);
  if (nameExists) {
    throw new Error(GENRE_ERROR_MESSAGES.NAME_ALREADY_EXISTS);
  }

  // 3. トランザクション内でジャンルを作成とカテゴリの更新日を更新
  const genreId = crypto.randomUUID();
  const sortOrder = await getNextGenreSortOrder(userId, genreData.categoryId);

  // トランザクション実行
  const result = await executeTransactionWithErrorHandling(
    async sql => {
      // ジャンルを作成
      const genreResult = await sql`
        INSERT INTO genres (
          id,
          user_id,
          category_id,
          name,
          description,
          color,
          icon,
          sort_order,
          is_active
        ) VALUES (
          ${genreId},
          ${userId},
          ${genreData.categoryId},
          ${genreData.name.trim()},
          ${genreData.description?.trim() || null},
          ${genreData.color || null},
          ${genreData.icon || null},
          ${sortOrder},
          ${true}
        )
        RETURNING *
      `;

      if (genreResult.length === 0) {
        throw new Error(COMMON_ERROR_MESSAGES.CREATE_FAILED);
      }

      // カテゴリの更新日を更新
      await sql`
        UPDATE categories
        SET updated_at = now()
        WHERE id = ${genreData.categoryId} AND user_id = ${userId}
      `;

      return genreResult[0] as Record<string, unknown>;
    },
    COMMON_ERROR_MESSAGES.CREATE_FAILED,
    Object.values(GENRE_ERROR_MESSAGES)
  );

  // キャッシュを無効化
  revalidateTag(`category-${genreData.categoryId}`);
  revalidateTag(`user-${userId}`);
  revalidateTag(`category-detail-${genreData.categoryId}`);

  return {
    id: result.id as string,
    userId: result.user_id as string,
    categoryId: result.category_id as string,
    name: result.name as string,
    description: result.description as string | undefined,
    color: result.color as string | undefined,
    icon: result.icon as string | undefined,
    sortOrder: result.sort_order as number,
    isActive: result.is_active as boolean,
    createdAt: result.created_at as string,
    updatedAt: result.updated_at as string,
  };
}

/**
 * ジャンル削除時の影響を事前に取得
 * @param genreId ジャンルID
 * @param userId ユーザーID
 * @returns 削除影響の統計情報
 */
export async function getGenreDeletionStats(
  genreId: string,
  userId: string
): Promise<GenreDeletionStats | null> {
  try {
    // ジャンル情報を取得
    const genre = await getGenreById(genreId, userId);
    if (!genre) {
      return null;
    }

    // 関連URLの詳細情報を取得
    const urlResult = await sql`
      SELECT DISTINCT u.title
      FROM urls u
      INNER JOIN url_categories uc ON u.id = uc.url_id
      WHERE uc.genre_id = ${genreId} AND uc.user_id = ${userId}
      ORDER BY u.title
    `;

    const urlCount = urlResult.length;
    const urlTitles = urlResult.map(row => row.title as string);

    return {
      genreName: genre.name,
      urlCount,
      urlTitles,
    };
  } catch {
    throw new Error(COMMON_ERROR_MESSAGES.DELETION_STATS_FAILED);
  }
}

/**
 * ジャンルを削除する
 */
export async function deleteGenre(genreId: string, userId: string): Promise<string> {
  try {
    // バリデーション
    if (!genreId || !userId) {
      throw new Error(COMMON_ERROR_MESSAGES.ID_REQUIRED);
    }

    // UUID形式の検証
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(genreId)) {
      throw new Error(GENRE_ERROR_MESSAGES.INVALID_GENRE_ID_FORMAT);
    }

    if (!uuidRegex.test(userId)) {
      throw new Error(COMMON_ERROR_MESSAGES.INVALID_USER_ID_FORMAT);
    }

    // 関連するURLを削除（ジャンルに紐づくURLレコード自体を削除）
    await sql`
      DELETE FROM urls
      WHERE id IN (
        SELECT DISTINCT uc.url_id
        FROM url_categories uc
        WHERE uc.genre_id = ${genreId} AND uc.user_id = ${userId}
      )
    `;

    // ジャンルを削除（CASCADE設定により関連するurl_categoriesも自動削除される）
    const result = await sql`
      DELETE FROM genres
      WHERE id = ${genreId} AND user_id = ${userId}
      RETURNING id
    `;

    if (result.length === 0) {
      throw new Error(GENRE_ERROR_MESSAGES.GENRE_NOT_FOUND);
    }

    // キャッシュを無効化
    const genre = await getGenreById(genreId, userId);
    if (genre) {
      revalidateTag(`category-${genre.category_id}`);
      revalidateTag(`user-${userId}`);
      revalidateTag(`category-detail-${genre.category_id}`);
      revalidateTag(`genre-${genreId}`);
    }

    return genreId;
  } catch {
    throw new Error(COMMON_ERROR_MESSAGES.DELETE_FAILED);
  }
}
