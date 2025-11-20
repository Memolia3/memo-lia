import { sql } from "@/lib/neon";

/**
 * カテゴリ詳細ページ用の最適化されたデータ取得
 * カテゴリとジャンル一覧を単一クエリで取得
 */
export interface CategoryDetailData {
  category: {
    id: string;
    name: string;
    description?: string;
    color?: string;
    userId: string;
    sortOrder: number;
    level: number;
    isActive: boolean;
    isFolder: boolean;
    createdAt: string;
    updatedAt: string;
  };
  genres: Array<{
    id: string;
    name: string;
    description?: string;
    color?: string;
    categoryId: string;
    userId: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
}

export async function getCategoryDetailOptimized(
  categoryId: string,
  userId: string
): Promise<CategoryDetailData | null> {
  try {
    // 単一のJOINクエリでカテゴリとジャンルを取得
    const result = await sql`
      SELECT
        c.id as category_id,
        c.name as category_name,
        c.description as category_description,
        c.color as category_color,
        c.user_id as category_user_id,
        c.sort_order as category_sort_order,
        c.level as category_level,
        c.is_active as category_is_active,
        c.is_folder as category_is_folder,
        c.created_at as category_created_at,
        c.updated_at as category_updated_at,
        g.id as genre_id,
        g.name as genre_name,
        g.description as genre_description,
        g.color as genre_color,
        g.category_id as genre_category_id,
        g.user_id as genre_user_id,
        g.sort_order as genre_sort_order,
        g.is_active as genre_is_active,
        g.created_at as genre_created_at,
        g.updated_at as genre_updated_at
      FROM categories c
      LEFT JOIN genres g ON g.category_id = c.id AND g.user_id = ${userId}
      WHERE c.id = ${categoryId}
        AND c.user_id = ${userId}
      ORDER BY g.sort_order ASC, g.created_at DESC
    `;

    if (result.length === 0) {
      return null;
    }

    const firstRow = result[0] as Record<string, unknown>;

    // カテゴリデータを抽出
    const category = {
      id: firstRow.category_id as string,
      name: firstRow.category_name as string,
      description: firstRow.category_description as string | undefined,
      color: firstRow.category_color as string | undefined,
      userId: firstRow.category_user_id as string,
      sortOrder: firstRow.category_sort_order as number,
      level: firstRow.category_level as number,
      isActive: firstRow.category_is_active as boolean,
      isFolder: firstRow.category_is_folder as boolean,
      createdAt: firstRow.category_created_at as string,
      updatedAt: firstRow.category_updated_at as string,
    };

    // ジャンルデータを抽出（genre_idがnullの場合は空配列）
    const genres = result
      .filter((row: Record<string, unknown>) => row.genre_id !== null)
      .map((row: Record<string, unknown>) => ({
        id: row.genre_id as string,
        name: row.genre_name as string,
        description: row.genre_description as string | undefined,
        color: row.genre_color as string | undefined,
        categoryId: row.genre_category_id as string,
        userId: row.genre_user_id as string,
        sortOrder: row.genre_sort_order as number,
        isActive: row.genre_is_active as boolean,
        createdAt: row.genre_created_at as string,
        updatedAt: row.genre_updated_at as string,
      }));

    return {
      category,
      genres,
    };
  } catch {
    throw new Error("カテゴリ詳細の取得に失敗しました");
  }
}
