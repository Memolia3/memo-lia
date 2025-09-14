import { GENRE_ERROR_MESSAGES, URL_ERROR_MESSAGES } from "@/constants/error-messages";
import { neon } from "@neondatabase/serverless";

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
    throw new Error(URL_ERROR_MESSAGES.USER_ID_NOT_PROVIDED);
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
    throw new Error(URL_ERROR_MESSAGES.DESCRIPTION_TOO_LONG);
  }
};

export const createUrl = async (data: CreateUrlData): Promise<UrlData> => {
  try {
    validateUrlData(data);

    // URL作成
    const urlResult = await sql`
      INSERT INTO urls (
        user_id, title, url, description, favicon_url
      ) VALUES (
        ${data.userId}, ${data.title.trim()}, ${data.url.trim()},
        ${data.description?.trim() || null}, ${data.faviconUrl || null}
      ) RETURNING *
    `;

    if (!urlResult[0]) {
      throw new Error("URLの作成に失敗しました");
    }

    const newUrl = urlResult[0] as Record<string, unknown>;

    // ジャンルからカテゴリIDを取得
    const genreResult = await sql`
      SELECT category_id FROM genres
      WHERE id = ${data.genreId} AND user_id = ${data.userId}
    `;

    if (!genreResult[0]) {
      throw new Error(GENRE_ERROR_MESSAGES.INVALID_GENRE);
    }

    // URL-ジャンル関係作成
    await sql`
      INSERT INTO url_categories (url_id, category_id, genre_id, user_id)
      VALUES (${newUrl.id}, ${genreResult[0].category_id}, ${data.genreId}, ${data.userId})
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
      WHERE id = ${genreResult[0].category_id} AND user_id = ${data.userId}
    `;

    const result = newUrl;

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
  } catch (error: unknown) {
    // PostgreSQL unique constraint violation
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      "constraint" in error &&
      error.code === "23505" &&
      error.constraint === "idx_urls_user_url"
    ) {
      throw new Error(URL_ERROR_MESSAGES.URL_ALREADY_EXISTS);
    }

    // その他のエラーの場合、エラーメッセージをチェック
    if (error instanceof Error) {
      // 既知のエラーメッセージの場合はそのまま投げ直し
      if (
        (Object.values(GENRE_ERROR_MESSAGES) as string[]).includes(error.message) ||
        (Object.values(URL_ERROR_MESSAGES) as string[]).includes(error.message)
      ) {
        throw error;
      }
    }

    // 予期しないエラーの場合は汎用エラー
    throw new Error(URL_ERROR_MESSAGES.CREATE_FAILED);
  }
};

export const getUrlsByGenre = async (genreId: string, userId: string): Promise<UrlData[]> => {
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
    `;

    return result.map((row: Record<string, unknown>) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      url: row.url,
      description: row.description,
      faviconUrl: row.favicon_url,
      isPublic: row.is_public,
      viewCount: row.view_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastAccessedAt: row.last_accessed_at,
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
    `;

    if (result.count === 0) {
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
  } catch (error) {
    throw error;
  }
};
