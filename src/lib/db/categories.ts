import { CATEGORY_ERROR_MESSAGES, COMMON_ERROR_MESSAGES } from "@/constants/error-messages";
import { neon } from "@neondatabase/serverless";
import { revalidateTag, unstable_cache } from "next/cache";

// Note: ジャンル関連機能は src/lib/db/genres.ts に移動しました

const sql = neon(process.env.DATABASE_URL!);

/**
 * カテゴリデータの型定義
 */
export interface CategoryData {
  id: string;
  userId: string;
  parentId?: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  sortOrder: number;
  level: number;
  path?: string;
  isActive: boolean;
  isFolder: boolean;
  createdAt: string;
  updatedAt: string;
}

// Note: GenreData は src/lib/db/genres.ts に移動しました

/**
 * ユーザーのカテゴリ一覧を取得（内部実装）
 */
async function getCategoriesInternal(userId: string): Promise<CategoryData[]> {
  try {
    const result = await sql`
      SELECT
        id,
        user_id,
        parent_id,
        name,
        description,
        color,
        icon,
        sort_order,
        level,
        path,
        is_active,
        is_folder,
        created_at,
        updated_at
      FROM categories
      WHERE user_id = ${userId}
        AND is_active = true
        AND is_folder = true
      ORDER BY sort_order ASC, created_at ASC
      LIMIT 50
    `;
    return result.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      userId: row.user_id as string,
      parentId: row.parent_id as string | undefined,
      name: row.name as string,
      description: row.description as string | undefined,
      color: row.color as string | undefined,
      icon: row.icon as string | undefined,
      sortOrder: row.sort_order as number,
      level: row.level as number,
      path: row.path as string | undefined,
      isActive: row.is_active as boolean,
      isFolder: row.is_folder as boolean,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    }));
  } catch {
    throw new Error(COMMON_ERROR_MESSAGES.FETCH_FAILED);
  }
}

/**
 * ユーザーのカテゴリ一覧を取得（キャッシュ付き）
 * キャッシュ時間: 60秒
 */
export async function getCategories(userId: string): Promise<CategoryData[]> {
  return unstable_cache(async () => getCategoriesInternal(userId), [`categories-${userId}`], {
    revalidate: 60, // 60秒間キャッシュ
    tags: [`categories-${userId}`],
  })();
}

/**
 * カテゴリの詳細情報を取得
 */
export async function getCategoryById(
  categoryId: string,
  userId: string
): Promise<CategoryData | null> {
  try {
    const result = await sql`
      SELECT
        id,
        user_id,
        parent_id,
        name,
        description,
        color,
        icon,
        sort_order,
        level,
        path,
        is_active,
        is_folder,
        created_at,
        updated_at
      FROM categories
      WHERE id = ${categoryId} AND user_id = ${userId} AND is_active = true
    `;
    if (result.length === 0) return null;

    const row = result[0] as Record<string, unknown>;
    return {
      id: row.id as string,
      userId: row.user_id as string,
      parentId: row.parent_id as string | undefined,
      name: row.name as string,
      description: row.description as string | undefined,
      color: row.color as string | undefined,
      icon: row.icon as string | undefined,
      sortOrder: row.sort_order as number,
      level: row.level as number,
      path: row.path as string | undefined,
      isActive: row.is_active as boolean,
      isFolder: row.is_folder as boolean,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  } catch {
    throw new Error(COMMON_ERROR_MESSAGES.FETCH_FAILED);
  }
}

// Note: getGenresByCategory は src/lib/db/genres.ts に移動しました

/**
 * カテゴリ作成の入力データ型
 */
export interface CreateCategoryData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

/**
 * カテゴリ作成のバリデーション
 */
function validateCategoryData(data: CreateCategoryData): void {
  if (!data.name || data.name.trim().length === 0) {
    throw new Error(COMMON_ERROR_MESSAGES.NAME_REQUIRED);
  }

  if (data.name.length > 100) {
    throw new Error(COMMON_ERROR_MESSAGES.NAME_TOO_LONG);
  }

  if (data.description && data.description.length > 500) {
    throw new Error(COMMON_ERROR_MESSAGES.DESCRIPTION_TOO_LONG);
  }

  if (data.color && !/^#[0-9A-Fa-f]{6}$/.test(data.color)) {
    throw new Error(COMMON_ERROR_MESSAGES.INVALID_COLOR_CODE);
  }

  if (data.icon && data.icon.length > 50) {
    throw new Error(CATEGORY_ERROR_MESSAGES.ICON_TOO_LONG);
  }
}

/**
 * カテゴリ名の重複チェック
 */
async function checkCategoryNameExists(
  userId: string,
  name: string,
  parentId: string | null = null
): Promise<boolean> {
  try {
    const result = await sql`
      SELECT id FROM categories
      WHERE user_id = ${userId}
        AND name = ${name.trim()}
        AND parent_id = ${parentId}
        AND is_active = true
    `;
    return result.length > 0;
  } catch {
    throw new Error(COMMON_ERROR_MESSAGES.DUPLICATE_CHECK_FAILED);
  }
}

/**
 * 次のsort_orderを取得
 */
async function getNextSortOrder(userId: string, parentId: string | null = null): Promise<number> {
  try {
    const result = await sql`
      SELECT COALESCE(MAX(sort_order), 0) as max_order
      FROM categories
      WHERE user_id = ${userId}
        AND parent_id = ${parentId}
        AND is_folder = true
    `;
    return (result[0] as { max_order: number }).max_order + 1;
  } catch {
    throw new Error(COMMON_ERROR_MESSAGES.SORT_ORDER_FAILED);
  }
}

/**
 * 新しいカテゴリを作成（ベストプラクティス版）
 */
export async function createCategory(
  userId: string,
  categoryData: CreateCategoryData
): Promise<CategoryData> {
  // 1. 入力データのバリデーション
  validateCategoryData(categoryData);

  // 2. カテゴリ名の重複チェック
  const nameExists = await checkCategoryNameExists(userId, categoryData.name);
  if (nameExists) {
    throw new Error(CATEGORY_ERROR_MESSAGES.NAME_ALREADY_EXISTS);
  }

  // 3. カテゴリを作成
  try {
    const categoryId = crypto.randomUUID();
    const parentId = null; // トップレベルカテゴリ
    const sortOrder = await getNextSortOrder(userId, parentId);

    const result = await sql`
      INSERT INTO categories (
        id,
        user_id,
        parent_id,
        name,
        description,
        color,
        icon,
        sort_order,
        level,
        path,
        is_active,
        is_folder
      ) VALUES (
        ${categoryId},
        ${userId},
        ${parentId},
        ${categoryData.name.trim()},
        ${categoryData.description?.trim() || null},
        ${categoryData.color || null},
        ${categoryData.icon || null},
        ${sortOrder},
        ${0},
        ${`/${categoryId}`},
        ${true},
        ${true}
      )
      RETURNING *
    `;

    if (result.length === 0) {
      throw new Error(COMMON_ERROR_MESSAGES.CREATE_FAILED);
    }

    const row = result[0] as Record<string, unknown>;

    // カテゴリ作成後、キャッシュを無効化
    revalidateTag(`categories-${userId}`);

    return {
      id: row.id as string,
      userId: row.user_id as string,
      parentId: row.parent_id as string | undefined,
      name: row.name as string,
      description: row.description as string | undefined,
      color: row.color as string | undefined,
      icon: row.icon as string | undefined,
      sortOrder: row.sort_order as number,
      level: row.level as number,
      path: row.path as string | undefined,
      isActive: row.is_active as boolean,
      isFolder: row.is_folder as boolean,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  } catch (error: unknown) {
    // PostgreSQL unique constraint violation
    if (error && typeof error === "object" && "code" in error && error.code === "23505") {
      throw new Error(CATEGORY_ERROR_MESSAGES.NAME_ALREADY_EXISTS);
    }

    // その他のエラーの場合は汎用エラー
    throw new Error(COMMON_ERROR_MESSAGES.CREATE_FAILED);
  }
}

/**
 * カテゴリ削除のデータ型
 */
export interface DeleteCategoryData {
  categoryId: string;
  userId: string;
}

/**
 * カテゴリ削除時の影響統計
 */
export interface CategoryDeletionStats {
  categoryName: string;
  genreCount: number;
  urlCount: number;
  genreNames: string[];
  urlTitles: string[];
}

/**
 * カテゴリ削除時の影響を事前に取得
 * @param categoryId カテゴリID
 * @param userId ユーザーID
 * @returns 削除影響の統計情報
 */
export async function getCategoryDeletionStats(
  categoryId: string,
  userId: string
): Promise<CategoryDeletionStats | null> {
  try {
    // カテゴリ情報を取得
    const category = await getCategoryById(categoryId, userId);
    if (!category) {
      return null;
    }

    // 関連ジャンル数とジャンル名を取得
    const genreResult = await sql`
      SELECT id, name FROM genres
      WHERE category_id = ${categoryId} AND user_id = ${userId} AND is_active = true
    `;

    const genreNames = genreResult.map(row => row.name as string);

    // 関連URLの詳細情報を取得
    const urlResult = await sql`
      SELECT DISTINCT u.title
      FROM urls u
      INNER JOIN url_categories uc ON u.id = uc.url_id
      WHERE uc.category_id = ${categoryId} AND uc.user_id = ${userId}
      ORDER BY u.title
    `;

    const urlCount = urlResult.length;
    const urlTitles = urlResult.map(row => row.title as string);

    return {
      categoryName: category.name,
      genreCount: genreResult.length,
      urlCount,
      genreNames,
      urlTitles,
    };
  } catch {
    throw new Error(COMMON_ERROR_MESSAGES.DELETION_STATS_FAILED);
  }
}

/**
 * カテゴリを削除する
 * @param data 削除データ
 * @returns 削除されたカテゴリのID
 */
export async function deleteCategory(data: DeleteCategoryData): Promise<string> {
  try {
    const { categoryId, userId } = data;

    // バリデーション
    if (!categoryId || !userId) {
      throw new Error(COMMON_ERROR_MESSAGES.ID_REQUIRED);
    }

    // UUID形式の検証
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(categoryId)) {
      throw new Error(CATEGORY_ERROR_MESSAGES.INVALID_CATEGORY_ID_FORMAT);
    }

    if (!uuidRegex.test(userId)) {
      throw new Error(COMMON_ERROR_MESSAGES.INVALID_USER_ID_FORMAT);
    }

    // カテゴリの存在確認
    const existingCategory = await getCategoryById(categoryId, userId);
    if (!existingCategory) {
      throw new Error(CATEGORY_ERROR_MESSAGES.CATEGORY_NOT_FOUND);
    }

    // 関連するURLを削除（カテゴリに紐づくURLレコード自体を削除）
    await sql`
      DELETE FROM urls
      WHERE id IN (
        SELECT DISTINCT uc.url_id
        FROM url_categories uc
        WHERE uc.category_id = ${categoryId} AND uc.user_id = ${userId}
      )
    `;

    // カテゴリを削除（CASCADE設定により関連するジャンルとurl_categoriesも自動削除される）
    await sql`
      DELETE FROM categories
      WHERE id = ${categoryId} AND user_id = ${userId}
    `;

    // カテゴリ削除後、キャッシュを無効化
    revalidateTag(`categories-${userId}`);

    return categoryId;
  } catch {
    throw new Error(COMMON_ERROR_MESSAGES.DELETE_FAILED);
  }
}
