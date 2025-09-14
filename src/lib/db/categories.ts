import { neon } from "@neondatabase/serverless";

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
 * ユーザーのカテゴリ一覧を取得
 */
export async function getCategories(userId: string): Promise<CategoryData[]> {
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
    throw new Error("カテゴリの取得に失敗しました");
  }
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
    throw new Error("カテゴリの取得に失敗しました");
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
    throw new Error("カテゴリ名は必須です");
  }

  if (data.name.length > 100) {
    throw new Error("カテゴリ名は100文字以内で入力してください");
  }

  if (data.description && data.description.length > 500) {
    throw new Error("説明は500文字以内で入力してください");
  }

  if (data.color && !/^#[0-9A-Fa-f]{6}$/.test(data.color)) {
    throw new Error("色は有効なHEXカラーコード（#RRGGBB）で入力してください");
  }

  if (data.icon && data.icon.length > 50) {
    throw new Error("アイコン名は50文字以内で入力してください");
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
    throw new Error("カテゴリ名の重複チェックに失敗しました");
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
    throw new Error("ソート順の取得に失敗しました");
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
    throw new Error("このカテゴリ名は既に使用されています");
  }

  // 3. トランザクション内でカテゴリを作成
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
      throw new Error("カテゴリの作成に失敗しました");
    }

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
    throw new Error("カテゴリの作成に失敗しました");
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
    throw new Error("削除影響の取得に失敗しました");
  }
}

// Note: CreateGenreData は src/lib/db/genres.ts に移動しました

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
      throw new Error("カテゴリIDとユーザーIDは必須です");
    }

    // UUID形式の検証
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(categoryId)) {
      throw new Error("無効なカテゴリID形式です");
    }

    if (!uuidRegex.test(userId)) {
      throw new Error("無効なユーザーID形式です");
    }

    // カテゴリの存在確認
    const existingCategory = await getCategoryById(categoryId, userId);
    if (!existingCategory) {
      throw new Error("カテゴリが見つかりません");
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

    return categoryId;
  } catch {
    throw new Error("カテゴリの削除に失敗しました");
  }
}
