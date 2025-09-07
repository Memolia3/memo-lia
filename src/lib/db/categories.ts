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
