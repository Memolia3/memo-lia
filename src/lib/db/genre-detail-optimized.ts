import { sql } from "@/lib/neon";

/**
 * ジャンル詳細ページ用の最適化されたデータ取得
 * カテゴリ、ジャンル、URL一覧を単一クエリで取得
 */
export interface GenreDetailData {
  category: {
    id: string;
    name: string;
    userId: string;
  };
  genre: {
    id: string;
    name: string;
    categoryId: string;
    userId: string;
  };
  urls: Array<{
    id: string;
    userId: string;
    title: string;
    url: string;
    description?: string;
    faviconUrl?: string;
    isPublic: boolean;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
    lastAccessedAt?: string;
  }>;
}

export async function getGenreDetailOptimized(
  categoryId: string,
  genreId: string,
  userId: string,
  limit: number = 20
): Promise<GenreDetailData | null> {
  try {
    // 単一のJOINクエリで全データを取得
    const result = await sql`
      WITH genre_data AS (
        SELECT
          c.id as category_id,
          c.name as category_name,
          c.user_id as category_user_id,
          g.id as genre_id,
          g.name as genre_name,
          g.category_id as genre_category_id,
          g.user_id as genre_user_id
        FROM categories c
        INNER JOIN genres g ON g.category_id = c.id
        WHERE c.id = ${categoryId}
          AND g.id = ${genreId}
          AND c.user_id = ${userId}
          AND g.user_id = ${userId}
      )
      SELECT
        gd.category_id,
        gd.category_name,
        gd.category_user_id,
        gd.genre_id,
        gd.genre_name,
        gd.genre_category_id,
        gd.genre_user_id,
        u.id as url_id,
        u.user_id as url_user_id,
        u.title as url_title,
        u.url as url_url,
        u.description as url_description,
        u.favicon_url as url_favicon_url,
        u.is_public as url_is_public,
        u.view_count as url_view_count,
        u.created_at as url_created_at,
        u.updated_at as url_updated_at,
        u.last_accessed_at as url_last_accessed_at
      FROM genre_data gd
      LEFT JOIN url_categories uc ON uc.genre_id = gd.genre_id AND uc.user_id = ${userId}
      LEFT JOIN urls u ON u.id = uc.url_id
      ORDER BY u.created_at DESC NULLS LAST
      LIMIT ${limit}
    `;

    if (result.length === 0) {
      return null;
    }

    const firstRow = result[0] as Record<string, unknown>;

    // カテゴリとジャンルのデータを抽出
    const category = {
      id: firstRow.category_id as string,
      name: firstRow.category_name as string,
      userId: firstRow.category_user_id as string,
    };

    const genre = {
      id: firstRow.genre_id as string,
      name: firstRow.genre_name as string,
      categoryId: firstRow.genre_category_id as string,
      userId: firstRow.genre_user_id as string,
    };

    // URLデータを抽出（url_idがnullの場合は空配列）
    const urls = result
      .filter((row: Record<string, unknown>) => row.url_id !== null)
      .map((row: Record<string, unknown>) => ({
        id: row.url_id as string,
        userId: row.url_user_id as string,
        title: row.url_title as string,
        url: row.url_url as string,
        description: row.url_description as string | undefined,
        faviconUrl: row.url_favicon_url as string | undefined,
        isPublic: row.url_is_public as boolean,
        viewCount: row.url_view_count as number,
        createdAt: row.url_created_at as string,
        updatedAt: row.url_updated_at as string,
        lastAccessedAt: row.url_last_accessed_at as string | undefined,
      }));

    return {
      category,
      genre,
      urls,
    };
  } catch {
    throw new Error("ジャンル詳細の取得に失敗しました");
  }
}
