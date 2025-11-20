
import {
    COMMON_ERROR_MESSAGES,
    GENRE_ERROR_MESSAGES,
    URL_ERROR_MESSAGES,
} from "@/constants/error-messages";
import { executeTransactionWithErrorHandling } from "@/lib/db/transaction";
import { neon } from "@neondatabase/serverless";
import { revalidateTag } from "next/cache";

const sql = neon(process.env.DATABASE_URL!);

export interface CreateUrlData {
  userId: string;
  genreId: string;
  title: string;
  url: string;
  description?: string;
  faviconUrl?: string;
}

export interface UrlData {
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
}

// Note: SQL queries are now inlined using tagged template literals

export const validateUrlData = (data: CreateUrlData): void => {
  if (!data.userId?.trim()) {
    throw new Error(COMMON_ERROR_MESSAGES.USER_ID_NOT_PROVIDED);
  }

  if (!data.genreId?.trim()) {
    throw new Error(URL_ERROR_MESSAGES.INVALID_GENRE);
  }

  if (!data.title?.trim()) {
    throw new Error(URL_ERROR_MESSAGES.TITLE_REQUIRED);
  }

  if (data.title.length > 200) {
    throw new Error(URL_ERROR_MESSAGES.TITLE_TOO_LONG);
  }

  if (!data.url?.trim()) {
    throw new Error(URL_ERROR_MESSAGES.URL_REQUIRED);
  }

  try {
    new URL(data.url);
  } catch {
    throw new Error(URL_ERROR_MESSAGES.INVALID_URL);
  }

  if (data.description && data.description.length > 500) {
    throw new Error(COMMON_ERROR_MESSAGES.DESCRIPTION_TOO_LONG);
  }
};

export const createUrl = async (data: CreateUrlData): Promise<UrlData> => {
  validateUrlData(data);

  // 既知のエラーメッセージ
  const knownErrors = [
    ...Object.values(GENRE_ERROR_MESSAGES),
    ...Object.values(URL_ERROR_MESSAGES),
  ];

  // トランザクション実行
  const result = await executeTransactionWithErrorHandling(
    async sql => {
      // ジャンルからカテゴリIDを取得
      const genreResult = await sql`
        SELECT category_id FROM genres
        WHERE id = ${data.genreId} AND user_id = ${data.userId}
      `;

      if (!genreResult[0]) {
        throw new Error(GENRE_ERROR_MESSAGES.INVALID_GENRE);
      }

      const categoryId = genreResult[0].category_id as string;

      // 既存のURLを確認
      const existingUrlResult = await sql`
        SELECT * FROM urls
        WHERE user_id = ${data.userId} AND url = ${data.url.trim()}
      `;

      let urlId: string;
      let newUrl: Record<string, unknown>;

      if (existingUrlResult.length > 0) {
        // 既存のURLを使用
        newUrl = existingUrlResult[0] as Record<string, unknown>;
        urlId = newUrl.id as string;
      } else {
        // 新規URL作成
        const urlResult = await sql`
          INSERT INTO urls (
            user_id, title, url, description, favicon_url
          ) VALUES (
            ${data.userId}, ${data.title.trim()}, ${data.url.trim()},
            ${data.description?.trim() || null}, ${data.faviconUrl || null}
          ) RETURNING *
        `;

        if (!urlResult[0]) {
          throw new Error(COMMON_ERROR_MESSAGES.CREATE_FAILED);
        }
        newUrl = urlResult[0] as Record<string, unknown>;
        urlId = newUrl.id as string;
      }

      // URL-ジャンル関係の存在確認
      const existingRelation = await sql`
        SELECT 1 FROM url_categories
        WHERE url_id = ${urlId} AND genre_id = ${data.genreId} AND user_id = ${data.userId}
      `;

      if (existingRelation.length === 0) {
        // URL-ジャンル関係作成
        await sql`
          INSERT INTO url_categories (url_id, category_id, genre_id, user_id)
          VALUES (${urlId}, ${categoryId}, ${data.genreId}, ${data.userId})
        `;

        // ジャンルの更新日を更新
        await sql`
          UPDATE genres
          SET updated_at = now()
          WHERE id = ${data.genreId} AND user_id = ${data.userId}
        `;

        // カテゴリの更新日を更新
        await sql`
          UPDATE categories
          SET updated_at = now()
          WHERE id = ${categoryId} AND user_id = ${data.userId}
        `;
      }

      return newUrl;
    },
    COMMON_ERROR_MESSAGES.CREATE_FAILED,
    knownErrors
  );

  // キャッシュを無効化
  const genreResult = await sql`
    SELECT category_id FROM genres WHERE id = ${data.genreId}
  `;
  const categoryId = genreResult[0]?.category_id as string;

  revalidateTag(`genre-${data.genreId}`);
  revalidateTag(`category-${categoryId}`);
  revalidateTag(`user-${data.userId}`);
  revalidateTag(`genre-detail-${data.genreId}`);
  revalidateTag(`category-detail-${categoryId}`);

  return {
    id: result.id as string,
    userId: result.user_id as string,
    title: result.title as string,
    url: result.url as string,
    description: result.description as string | undefined,
    faviconUrl: result.favicon_url as string | undefined,
    isPublic: result.is_public as boolean,
    viewCount: result.view_count as number,
    createdAt: result.created_at as string,
    updatedAt: result.updated_at as string,
    lastAccessedAt: result.last_accessed_at as string | undefined,
  };
};

export const getUrlsByGenre = async (
  genreId: string,
  userId: string,
  offset: number = 0,
  limit: number = 20
): Promise<UrlData[]> => {
  try {
    const result = await sql`
      SELECT
        u.id,
        u.user_id,
        u.title,
        u.url,
        u.description,
        u.favicon_url,
        u.is_public,
        u.view_count,
        u.created_at,
        u.updated_at,
        u.last_accessed_at
      FROM urls u
      INNER JOIN url_categories uc ON u.id = uc.url_id
      WHERE uc.genre_id = ${genreId} AND uc.user_id = ${userId}
      ORDER BY u.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return result.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      userId: row.user_id as string,
      title: row.title as string,
      url: row.url as string,
      description: row.description as string | undefined,
      faviconUrl: row.favicon_url as string | undefined,
      isPublic: row.is_public as boolean,
      viewCount: row.view_count as number,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
      lastAccessedAt: row.last_accessed_at as string | undefined,
    }));
  } catch {
    throw new Error("URLの取得に失敗しました");
  }
};

export const deleteUrl = async (urlId: string, userId: string): Promise<void> => {
  try {
    // 削除前にジャンルとカテゴリIDを取得
    const urlCategoryResult = await sql`
      SELECT genre_id, category_id FROM url_categories
      WHERE url_id = ${urlId} AND user_id = ${userId}
    `;

    if (urlCategoryResult.length === 0) {
      throw new Error("URL_NOT_FOUND");
    }

    const { genre_id, category_id } = urlCategoryResult[0] as Record<string, unknown>;

    // URLを削除（CASCADE設定によりurl_categoriesも自動削除される）
    const result = await sql`
      DELETE FROM urls
      WHERE id = ${urlId} AND user_id = ${userId}
      RETURNING id
    `;

    // 削除された行数をチェック
    if (!result || result.length === 0) {
      throw new Error("URL_NOT_FOUND");
    }

    // ジャンルの更新日を更新
    await sql`
      UPDATE genres
      SET updated_at = now()
      WHERE id = ${genre_id} AND user_id = ${userId}
    `;

    // カテゴリの更新日を更新
    await sql`
      UPDATE categories
      SET updated_at = now()
      WHERE id = ${category_id} AND user_id = ${userId}
    `;

    // キャッシュを無効化
    revalidateTag(`genre-${genre_id}`);
    revalidateTag(`category-${category_id}`);
    revalidateTag(`user-${userId}`);
    revalidateTag(`genre-detail-${genre_id}`);
    revalidateTag(`category-detail-${category_id}`);
  } catch (error) {
    throw error;
  }
};
