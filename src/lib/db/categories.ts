import { neon } from "@neondatabase/serverless";

/**
 * ユーザーのカテゴリ一覧を取得するクエリ（フォルダのみ）
 */
const GET_USER_CATEGORIES = `
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
  WHERE user_id = $1
    AND is_active = true
    AND is_folder = true
  ORDER BY sort_order ASC, created_at ASC
`;

/**
 * カテゴリの詳細情報を取得するクエリ
 */
const GET_CATEGORY_BY_ID = `
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
  WHERE id = $1 AND user_id = $2 AND is_active = true
`;

/**
 * カテゴリ内のジャンル一覧を取得するクエリ
 */
const GET_GENRES_BY_CATEGORY = `
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
  WHERE g.category_id = $1
    AND g.user_id = $2
    AND g.is_active = true
  ORDER BY g.sort_order ASC, g.created_at ASC
`;

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
 * ユーザーのカテゴリ一覧を取得
 */
export async function getCategories(userId: string): Promise<CategoryData[]> {
  try {
    const result = await sql.query(GET_USER_CATEGORIES, [userId]);
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
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching categories:", error);
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
    const result = await sql.query(GET_CATEGORY_BY_ID, [categoryId, userId]);
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
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching category:", error);
    throw new Error("カテゴリの取得に失敗しました");
  }
}

/**
 * カテゴリ内のジャンル一覧を取得
 */
export async function getGenresByCategory(
  categoryId: string,
  userId: string
): Promise<GenreData[]> {
  try {
    const result = await sql.query(GET_GENRES_BY_CATEGORY, [categoryId, userId]);
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
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching genres:", error);
    throw new Error("ジャンルの取得に失敗しました");
  }
}

/**
 * カテゴリ作成のクエリ
 */
const CREATE_CATEGORY = `
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
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
  )
  RETURNING *
`;

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
    const result = await sql.query(
      "SELECT id FROM categories WHERE user_id = $1 AND name = $2 AND parent_id = $3 AND is_active = true",
      [userId, name.trim(), parentId]
    );
    return result.length > 0;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error checking category name:", error);
    throw new Error("カテゴリ名の重複チェックに失敗しました");
  }
}

/**
 * 次のsort_orderを取得
 */
async function getNextSortOrder(userId: string, parentId: string | null = null): Promise<number> {
  try {
    const result = await sql.query(
      "SELECT COALESCE(MAX(sort_order), 0) as max_order FROM categories WHERE user_id = $1 AND parent_id = $2 AND is_folder = true",
      [userId, parentId]
    );
    return (result[0] as { max_order: number }).max_order + 1;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting next sort order:", error);
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

    const result = await sql.query(CREATE_CATEGORY, [
      categoryId,
      userId,
      parentId,
      categoryData.name.trim(),
      categoryData.description?.trim() || null,
      categoryData.color || null,
      categoryData.icon || null,
      sortOrder,
      0, // level (トップレベル)
      `/${categoryId}`, // path (スラッシュで始まる形式)
      true, // is_active
      true, // is_folder
    ]);

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
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating category:", error);

    // より具体的なエラーメッセージを提供
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("カテゴリの作成に失敗しました");
  }
}

/**
 * カテゴリ削除用のSQLクエリ
 */
const DELETE_CATEGORY = `
  DELETE FROM categories
  WHERE id = $1 AND user_id = $2
`;

/**
 * カテゴリ削除のデータ型
 */
export interface DeleteCategoryData {
  categoryId: string;
  userId: string;
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

    // カテゴリを削除
    await sql.query(DELETE_CATEGORY, [categoryId, userId]);

    return categoryId;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting category:", error);

    // より具体的なエラーメッセージを提供
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("カテゴリの削除に失敗しました");
  }
}
