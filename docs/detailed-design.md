# MemoLia 詳細設計書

## 目次

1. [概要](#1-概要)
2. [サーバーアクション設計](#2-サーバーアクション設計)
   - 2.1 [URL管理アクション](#21-url管理アクション)
   - 2.2 [カテゴリ管理アクション](#22-カテゴリ管理アクション)
   - 2.3 [ジャンル管理アクション](#23-ジャンル管理アクション)
   - 2.4 [認証アクション](#24-認証アクション)
3. [データベースアクセス層設計](#3-データベースアクセス層設計)
   - 3.1 [URLデータアクセス](#31-urlデータアクセス)
   - 3.2 [カテゴリデータアクセス](#32-カテゴリデータアクセス)
   - 3.3 [ジャンルデータアクセス](#33-ジャンルデータアクセス)
   - 3.4 [トランザクション処理](#34-トランザクション処理)
4. [API設計](#4-api設計)
   - 4.1 [URLメタデータ取得API](#41-urlメタデータ取得api)
5. [コンポーネント設計](#5-コンポーネント設計)
   - 5.1 [フォームコンポーネント](#51-フォームコンポーネント)
   - 5.2 [UIコンポーネント](#52-uiコンポーネント)
   - 5.3 [機能コンポーネント](#53-機能コンポーネント)
6. [エラーハンドリング設計](#6-エラーハンドリング設計)
   - 6.1 [エラー分類](#61-エラー分類)
   - 6.2 [エラー処理フロー](#62-エラー処理フロー)
   - 6.3 [エラーメッセージ管理](#63-エラーメッセージ管理)
7. [バリデーション設計](#7-バリデーション設計)
   - 7.1 [入力値バリデーション](#71-入力値バリデーション)
   - 7.2 [データ整合性チェック](#72-データ整合性チェック)
8. [キャッシュ設計](#8-キャッシュ設計)
   - 8.1 [キャッシュタグ設計](#81-キャッシュタグ設計)
   - 8.2 [キャッシュ無効化戦略](#82-キャッシュ無効化戦略)
9. [変更履歴](#9-変更履歴)

## 1. 概要

本設計書は、MemoLiaアプリケーションの詳細設計を記載する。実装レベルの詳細を記述し、開発者が実際のコードを理解し、実装・保守できるよう配慮している。

## 2. サーバーアクション設計

### 2.1 URL管理アクション

#### createUrlAction

URLを登録するサーバーアクション。

**ファイル**: `src/actions/urls.ts`

**関数シグネチャ**

```typescript
export async function createUrlAction(
  data: Omit<CreateUrlData, "userId">
): Promise<CreateUrlResult>;
```

**入力パラメータ**

- `data.genreId`: string - ジャンルID（必須）
- `data.title`: string - URLタイトル（必須）
- `data.url`: string - URL（必須）
- `data.description`: string | undefined - 説明（オプション）
- `data.faviconUrl`: string | undefined - ファビコンURL（オプション）

**戻り値**

```typescript
type CreateUrlResult =
  | { success: true; data: UrlData }
  | { success: false; error: string };
```

**処理フロー**

1. セッション認証チェック
   - `auth()`でセッションを取得
   - セッションが存在しない場合、エラーを返却
2. 入力値バリデーション
   - `genreId`が存在するかチェック
   - 存在しない場合、エラーメッセージを返却
3. データベース層の呼び出し
   - `createUrl()`関数を呼び出し
   - `userId`をセッションから取得して渡す
4. エラーハンドリング
   - エラーが発生した場合、エラーメッセージを返却
   - 成功した場合、作成されたURLデータを返却

**エラーパターン**

- 認証エラー: `t("authRequired")`
- ジャンルID未指定: `t("genreIdRequired")`
- データベースエラー: エラーメッセージをそのまま返却

#### getUrlsByGenreAction

ジャンルに紐づくURL一覧を取得するサーバーアクション。

**ファイル**: `src/actions/urls.ts`

**関数シグネチャ**

```typescript
export async function getUrlsByGenreAction(
  genreId: string,
  page: number = 1,
  limit: number = 20
): Promise<UrlData[]>;
```

**入力パラメータ**

- `genreId`: string - ジャンルID（必須）
- `page`: number - ページ番号（デフォルト: 1）
- `limit`: number - 1ページあたりの件数（デフォルト: 20）

**戻り値**

- `UrlData[]` - URLデータの配列

**処理フロー**

1. セッション認証チェック
2. 入力値バリデーション
   - `genreId`が存在するかチェック
3. オフセット計算
   - `offset = (page - 1) * limit`
4. データベース層の呼び出し
   - `getUrlsByGenre()`関数を呼び出し
5. 結果の返却

**エラーパターン**

- 認証エラー: `Error(t("authRequired"))`をthrow
- ジャンルID未指定: `Error(t("genreIdRequired"))`をthrow

#### deleteUrlAction

URLを削除するサーバーアクション。

**ファイル**: `src/actions/urls.ts`

**関数シグネチャ**

```typescript
export async function deleteUrlAction(urlId: string): Promise<void>;
```

**入力パラメータ**

- `urlId`: string - 削除するURLのID（必須）

**処理フロー**

1. セッション認証チェック
2. 入力値バリデーション
   - `urlId`が存在するかチェック
3. データベース層の呼び出し
   - `deleteUrl()`関数を呼び出し
   - `userId`をセッションから取得して渡す

**エラーパターン**

- 認証エラー: `Error(t("authRequired"))`をthrow
- URL ID未指定: `Error(t("urlIdRequired"))`をthrow

### 2.2 カテゴリ管理アクション

#### createCategory

カテゴリを作成するサーバーアクション。

**ファイル**: `src/actions/categories.ts`

**関数シグネチャ**

```typescript
export async function createCategory(
  userId: string,
  categoryData: CreateCategoryData
): Promise<CategoryData>;
```

**入力パラメータ**

- `userId`: string - ユーザーID（必須）
- `categoryData.name`: string - カテゴリ名（必須）
- `categoryData.description`: string | undefined - 説明（オプション）
- `categoryData.color`: string | undefined - 色コード（オプション）
- `categoryData.icon`: string | undefined - アイコン名（オプション）

**戻り値**

- `CategoryData` - 作成されたカテゴリデータ

**処理フロー**

1. 入力値バリデーション
   - `userId`が存在するかチェック
   - UUID形式の検証
2. データベース層の呼び出し
   - `dbCreateCategory()`関数を呼び出し
3. エラーハンドリング
   - エラーを再スロー

**エラーパターン**

- ユーザーID未指定: `Error(t("userIdNotSpecified"))`
- 無効なユーザーID形式: `Error(t("invalidUserId"))`

#### getCategories

ユーザーのカテゴリ一覧を取得するサーバーアクション。

**ファイル**: `src/actions/categories.ts`

**関数シグネチャ**

```typescript
export async function getCategories(userId: string): Promise<CategoryData[]>;
```

**入力パラメータ**

- `userId`: string - ユーザーID（必須）

**戻り値**

- `CategoryData[]` - カテゴリデータの配列

**処理フロー**

1. データベース層の呼び出し
   - `dbGetCategories()`関数を呼び出し
2. 結果の返却

#### deleteCategory

カテゴリを削除するサーバーアクション。

**ファイル**: `src/actions/categories.ts`

**関数シグネチャ**

```typescript
export async function deleteCategory(categoryId: string): Promise<string>;
```

**入力パラメータ**

- `categoryId`: string - 削除するカテゴリのID（必須）

**戻り値**

- `string` - 削除されたカテゴリのID

**処理フロー**

1. セッション認証チェック
2. 入力値バリデーション
   - `categoryId`が存在するかチェック
3. データベース層の呼び出し
   - `dbDeleteCategory()`関数を呼び出し
   - `userId`をセッションから取得して渡す

**エラーパターン**

- 認証エラー: `Error(t("authRequired"))`
- カテゴリID未指定: `Error(t("categoryIdRequired"))`

### 2.3 ジャンル管理アクション

#### createGenre

ジャンルを作成するサーバーアクション。

**ファイル**: `src/actions/categories.ts`

**関数シグネチャ**

```typescript
export async function createGenre(
  userId: string,
  genreData: CreateGenreData
): Promise<GenreData>;
```

**入力パラメータ**

- `userId`: string - ユーザーID（必須）
- `genreData.categoryId`: string - カテゴリID（必須）
- `genreData.name`: string - ジャンル名（必須）
- `genreData.description`: string | undefined - 説明（オプション）
- `genreData.color`: string | undefined - 色コード（オプション）
- `genreData.icon`: string | undefined - アイコン名（オプション）

**戻り値**

- `GenreData` - 作成されたジャンルデータ

**処理フロー**

1. 入力値バリデーション
   - `userId`が存在するかチェック
   - UUID形式の検証（`userId`と`categoryId`）
2. データベース層の呼び出し
   - `dbCreateGenre()`関数を呼び出し
3. エラーハンドリング
   - エラーを再スロー

**エラーパターン**

- ユーザーID未指定: `Error(COMMON_ERROR_MESSAGES.USER_ID_NOT_PROVIDED)`
- 無効なユーザーID形式: `Error(COMMON_ERROR_MESSAGES.INVALID_USER_ID)`
- 無効なカテゴリID形式: `Error(GENRE_ERROR_MESSAGES.INVALID_CATEGORY)`

#### deleteGenre

ジャンルを削除するサーバーアクション。

**ファイル**: `src/actions/categories.ts`

**関数シグネチャ**

```typescript
export async function deleteGenre(
  genreId: string,
  userId: string
): Promise<string>;
```

**入力パラメータ**

- `genreId`: string - 削除するジャンルのID（必須）
- `userId`: string - ユーザーID（必須）

**戻り値**

- `string` - 削除されたジャンルのID

**処理フロー**

1. 入力値バリデーション
   - `genreId`と`userId`が存在するかチェック
   - UUID形式の検証
2. データベース層の呼び出し
   - `dbDeleteGenre()`関数を呼び出し

**エラーパターン**

- ユーザーID未指定: `Error(COMMON_ERROR_MESSAGES.USER_ID_NOT_PROVIDED)`
- 無効なユーザーID形式: `Error(COMMON_ERROR_MESSAGES.INVALID_USER_ID)`
- 無効なジャンルID形式: `Error(GENRE_ERROR_MESSAGES.INVALID_GENRE_ID_FORMAT)`

### 2.4 認証アクション

認証関連のアクションはNextAuth.jsが管理するため、サーバーアクションとして直接実装されていない。認証フローは`src/auth.ts`で定義されている。

## 3. データベースアクセス層設計

### 3.1 URLデータアクセス

#### createUrl

URLを作成するデータベースアクセス関数。

**ファイル**: `src/lib/db/urls.ts`

**関数シグネチャ**

```typescript
export const createUrl = async (data: CreateUrlData): Promise<UrlData>
```

**入力パラメータ**

- `data.userId`: string - ユーザーID（必須）
- `data.genreId`: string - ジャンルID（必須）
- `data.title`: string - URLタイトル（必須、1文字以上、200文字以内）
- `data.url`: string - URL（必須、有効なURL形式）
- `data.description`: string | undefined - 説明（オプション、500文字以内）
- `data.faviconUrl`: string | undefined - ファビコンURL（オプション）

**戻り値**

- `UrlData` - 作成されたURLデータ

**処理フロー**

1. 入力値バリデーション
   - `validateUrlData()`関数でバリデーション
2. トランザクション開始
   - `executeTransactionWithErrorHandling()`を使用
3. ジャンルからカテゴリIDを取得
   ```sql
   SELECT category_id FROM genres
   WHERE id = ${data.genreId} AND user_id = ${data.userId}
   ```
4. 既存URLの確認
   ```sql
   SELECT * FROM urls
   WHERE user_id = ${data.userId} AND url = ${data.url.trim()}
   ```
5. URLの作成または取得
   - 既存URLが存在する場合、そのIDを使用
   - 存在しない場合、新規作成
6. URL-ジャンル関係の作成
   - 既存の関係が存在しない場合のみ作成
   ```sql
   INSERT INTO url_categories (url_id, category_id, genre_id, user_id)
   VALUES (${urlId}, ${categoryId}, ${data.genreId}, ${data.userId})
   ```
7. ジャンル・カテゴリの更新日時を更新
8. キャッシュの無効化
   - `revalidateTag()`で以下のタグを無効化
     - `genre-${data.genreId}`
     - `category-${categoryId}`
     - `user-${data.userId}`
     - `genre-detail-${data.genreId}`
     - `category-detail-${categoryId}`

**エラーパターン**

- バリデーションエラー: `validateUrlData()`で検出
- 無効なジャンル: `GENRE_ERROR_MESSAGES.INVALID_GENRE`
- 作成失敗: `COMMON_ERROR_MESSAGES.CREATE_FAILED`

#### getUrlsByGenre

ジャンルに紐づくURL一覧を取得するデータベースアクセス関数。

**ファイル**: `src/lib/db/urls.ts`

**関数シグネチャ**

```typescript
export const getUrlsByGenre = async (
  genreId: string,
  userId: string,
  offset: number = 0,
  limit: number = 20
): Promise<UrlData[]>
```

**SQLクエリ**

```sql
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
```

**処理フロー**

1. SQLクエリの実行
2. 結果のマッピング
   - データベースのカラム名をキャメルケースに変換
3. 結果の返却

**エラーパターン**

- 取得失敗: `Error("URLの取得に失敗しました")`

#### deleteUrl

URLを削除するデータベースアクセス関数。

**ファイル**: `src/lib/db/urls.ts`

**関数シグネチャ**

```typescript
export const deleteUrl = async (urlId: string, userId: string): Promise<void>
```

**処理フロー**

1. 削除前にジャンルとカテゴリIDを取得
   ```sql
   SELECT genre_id, category_id FROM url_categories
   WHERE url_id = ${urlId} AND user_id = ${userId}
   ```
2. URLの削除
   ```sql
   DELETE FROM urls
   WHERE id = ${urlId} AND user_id = ${userId}
   RETURNING id
   ```

   - CASCADE設定により`url_categories`も自動削除される
3. ジャンル・カテゴリの更新日時を更新
4. キャッシュの無効化

**エラーパターン**

- URL未検出: `Error("URL_NOT_FOUND")`

### 3.2 カテゴリデータアクセス

#### createCategory

カテゴリを作成するデータベースアクセス関数。

**ファイル**: `src/lib/db/categories.ts`

**関数シグネチャ**

```typescript
export async function createCategory(
  userId: string,
  categoryData: CreateCategoryData
): Promise<CategoryData>;
```

**処理フロー**

1. 入力値バリデーション
   - `validateCategoryData()`関数でバリデーション
2. カテゴリ名の重複チェック
   - `checkCategoryNameExists()`関数でチェック
3. 次のsort_orderを取得
   - `getNextSortOrder()`関数で取得
4. カテゴリの作成
   ```sql
   INSERT INTO categories (
     id, user_id, parent_id, name, description, color, icon,
     sort_order, level, path, is_active, is_folder
   ) VALUES (
     ${categoryId}, ${userId}, ${null}, ${name}, ${description},
     ${color}, ${icon}, ${sortOrder}, ${0}, ${path}, ${true}, ${true}
   )
   RETURNING *
   ```
5. キャッシュの無効化
   - `revalidateTag(`categories-${userId}`)`

**エラーパターン**

- バリデーションエラー: `validateCategoryData()`で検出
- 名前重複: `CATEGORY_ERROR_MESSAGES.NAME_ALREADY_EXISTS`
- 作成失敗: `COMMON_ERROR_MESSAGES.CREATE_FAILED`

#### getCategories

ユーザーのカテゴリ一覧を取得するデータベースアクセス関数。

**ファイル**: `src/lib/db/categories.ts`

**関数シグネチャ**

```typescript
export async function getCategories(userId: string): Promise<CategoryData[]>;
```

**処理フロー**

1. キャッシュ付き関数の呼び出し
   - `unstable_cache()`を使用して60秒間キャッシュ
2. 内部関数の実行
   ```sql
   SELECT * FROM categories
   WHERE user_id = ${userId}
     AND is_active = true
     AND is_folder = true
   ORDER BY sort_order ASC, created_at ASC
   LIMIT 50
   ```

**キャッシュ設定**

- キャッシュキー: `categories-${userId}`
- 再検証時間: 60秒
- タグ: `categories-${userId}`

#### deleteCategory

カテゴリを削除するデータベースアクセス関数。

**ファイル**: `src/lib/db/categories.ts`

**関数シグネチャ**

```typescript
export async function deleteCategory(data: DeleteCategoryData): Promise<string>;
```

**処理フロー**

1. 入力値バリデーション
   - UUID形式の検証
2. カテゴリの存在確認
   - `getCategoryById()`で確認
3. 関連するURLの削除
   ```sql
   DELETE FROM urls
   WHERE id IN (
     SELECT DISTINCT uc.url_id
     FROM url_categories uc
     WHERE uc.category_id = ${categoryId} AND uc.user_id = ${userId}
   )
   ```
4. カテゴリの削除
   ```sql
   DELETE FROM categories
   WHERE id = ${categoryId} AND user_id = ${userId}
   ```

   - CASCADE設定により関連するジャンルと`url_categories`も自動削除される
5. キャッシュの無効化

**エラーパターン**

- ID未指定: `Error(COMMON_ERROR_MESSAGES.ID_REQUIRED)`
- 無効なID形式: `Error(CATEGORY_ERROR_MESSAGES.INVALID_CATEGORY_ID_FORMAT)`
- カテゴリ未検出: `Error(CATEGORY_ERROR_MESSAGES.CATEGORY_NOT_FOUND)`
- 削除失敗: `Error(COMMON_ERROR_MESSAGES.DELETE_FAILED)`

### 3.3 ジャンルデータアクセス

#### createGenre

ジャンルを作成するデータベースアクセス関数。

**ファイル**: `src/lib/db/genres.ts`

**関数シグネチャ**

```typescript
export async function createGenre(
  userId: string,
  genreData: CreateGenreData
): Promise<GenreData>;
```

**処理フロー**

1. 入力値バリデーション
   - `validateGenreData()`関数でバリデーション
2. ジャンル名の重複チェック（カテゴリ内で）
   - `checkGenreNameExists()`関数でチェック
3. トランザクション内で実行
   - `executeTransactionWithErrorHandling()`を使用
4. ジャンルの作成
   ```sql
   INSERT INTO genres (
     id, user_id, category_id, name, description, color, icon,
     sort_order, is_active
   ) VALUES (
     ${genreId}, ${userId}, ${categoryId}, ${name}, ${description},
     ${color}, ${icon}, ${sortOrder}, ${true}
   )
   RETURNING *
   ```
5. カテゴリの更新日時を更新
   ```sql
   UPDATE categories
   SET updated_at = now()
   WHERE id = ${categoryId} AND user_id = ${userId}
   ```
6. キャッシュの無効化

**エラーパターン**

- バリデーションエラー: `validateGenreData()`で検出
- 名前重複: `GENRE_ERROR_MESSAGES.NAME_ALREADY_EXISTS`
- 作成失敗: `COMMON_ERROR_MESSAGES.CREATE_FAILED`

#### deleteGenre

ジャンルを削除するデータベースアクセス関数。

**ファイル**: `src/lib/db/genres.ts`

**関数シグネチャ**

```typescript
export async function deleteGenre(
  genreId: string,
  userId: string
): Promise<string>;
```

**処理フロー**

1. 入力値バリデーション
   - UUID形式の検証
2. 関連するURLの削除
   ```sql
   DELETE FROM urls
   WHERE id IN (
     SELECT DISTINCT uc.url_id
     FROM url_categories uc
     WHERE uc.genre_id = ${genreId} AND uc.user_id = ${userId}
   )
   ```
3. ジャンルの削除
   ```sql
   DELETE FROM genres
   WHERE id = ${genreId} AND user_id = ${userId}
   RETURNING id
   ```

   - CASCADE設定により関連する`url_categories`も自動削除される
4. キャッシュの無効化

**エラーパターン**

- ID未指定: `Error(COMMON_ERROR_MESSAGES.ID_REQUIRED)`
- 無効なID形式: `Error(GENRE_ERROR_MESSAGES.INVALID_GENRE_ID_FORMAT)`
- ジャンル未検出: `Error(GENRE_ERROR_MESSAGES.GENRE_NOT_FOUND)`
- 削除失敗: `Error(COMMON_ERROR_MESSAGES.DELETE_FAILED)`

### 3.4 トランザクション処理

#### executeTransactionWithErrorHandling

エラーハンドリング付きトランザクション実行関数。

**ファイル**: `src/lib/db/transaction.ts`

**関数シグネチャ**

```typescript
export async function executeTransactionWithErrorHandling<T>(
  operation: (tx: typeof sql) => Promise<T>,
  errorMessage: string,
  knownErrors: string[] = []
): Promise<T>;
```

**処理フロー**

1. トランザクションの実行
   - `executeTransaction()`を呼び出し
2. エラーハンドリング
   - 既知のエラーメッセージの場合はそのまま再スロー
   - PostgreSQLのユニーク制約違反（23505）の場合は専用エラーをスロー
   - その他のエラーの場合は汎用エラーメッセージをスロー

**エラーコードマッピング**

- `23505`: `DATABASE_ERROR_MESSAGES.DUPLICATE_DATA_DETECTED`
- `23503`: `DATABASE_ERROR_MESSAGES.REFERENCE_INTEGRITY_ERROR`
- `23502`: `DATABASE_ERROR_MESSAGES.REQUIRED_FIELD_MISSING`
- `23514`: `DATABASE_ERROR_MESSAGES.DATA_CONSTRAINT_VIOLATION`

## 4. API設計

### 4.1 URLメタデータ取得API

#### POST /api/urls/metadata

URLのメタデータ（タイトル、説明、ファビコン）を取得するAPI。

**ファイル**: `src/app/api/urls/metadata/route.ts`

**リクエスト**

```typescript
{
  url: string;
}
```

**レスポンス**

```typescript
{
  title?: string;
  description?: string;
  faviconUrl?: string;
  url: string;
}
```

**処理フロー**

1. レート制限チェック
   - IPアドレスベースで1分間に20リクエストまで
2. 認証チェック
   - セッションが存在するか確認
3. URLの妥当性チェック
   - `isValidUrl()`で検証
   - `hasDangerousProtocol()`で危険なプロトコルをチェック
4. キャッシュチェック
   - メモリキャッシュから取得を試みる
   - 10分以内のキャッシュがあれば返却
5. HTMLの取得
   - `fetch()`でURLのHTMLを取得
   - タイムアウト: 5秒
6. メタデータの抽出
   - `<title>`タグからタイトルを抽出
   - Open Graphの`og:title`を優先
   - `<meta name="description">`から説明を抽出
   - Open Graphの`og:description`を優先
   - `<link rel="icon">`からファビコンURLを抽出
7. HTMLサニタイズ
   - `sanitizeHtml()`でXSS対策
8. キャッシュへの保存
   - メモリキャッシュに保存（最大1000件）
9. 結果の返却

**エラーレスポンス**

- 400: 不正なURL形式、危険なプロトコル検出
- 401: 未認証
- 429: レート制限超過
- 500: サーバーエラー

**キャッシュ設定**

- メモリキャッシュ: 10分間
- HTTPキャッシュ:
  `Cache-Control: public, s-maxage=600, stale-while-revalidate=3600`

## 5. コンポーネント設計

### 5.1 フォームコンポーネント

#### UrlForm

URL登録フォームコンポーネント。

**ファイル**: `src/features/urls/components/UrlForm/UrlForm.tsx`

**Props**

```typescript
interface UrlFormProps {
  initialData?: {
    url?: string;
    title?: string;
    description?: string;
  };
  onSubmit: (data: UrlFormData) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}
```

**状態管理**

- `formData`: フォームの入力値
- `errors`: バリデーションエラー
- `metadata`: URLメタデータ（`useUrlMetadata`フックから取得）

**処理フロー**

1. URL入力時の処理
   - `handleUrlChange()`でURLを更新
   - `useUrlMetadata`フックが自動的にメタデータを取得
2. メタデータ取得時の自動入力
   - タイトルと説明が空の場合のみ自動入力
3. フォーム送信時の処理
   - `validateUrl()`でURL形式を検証
   - バリデーションエラーがあれば表示
   - エラーがなければ`onSubmit`を呼び出し

**バリデーション**

- URL: 必須、有効なURL形式
- タイトル: 必須

#### CategoryForm

カテゴリ作成フォームコンポーネント。

**ファイル**: `src/features/categories/components/CategoryForm/CategoryForm.tsx`

**Props**

```typescript
interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}
```

**状態管理**

- `formData`: フォームの入力値
- `errors`: バリデーションエラー

**バリデーション**

- 名前: 必須、50文字以内
- 説明: 200文字以内
- 色: #RRGGBB形式（オプション）

#### GenreForm

ジャンル作成フォームコンポーネント。

**ファイル**: `src/features/genres/components/GenreForm/GenreForm.tsx`

**Props**

```typescript
interface GenreFormProps {
  categoryId: string;
  onSubmit: (data: GenreFormData) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}
```

**状態管理**

- `formData`: フォームの入力値
- `errors`: バリデーションエラー

**バリデーション**

- 名前: 必須、50文字以内
- 説明: 200文字以内
- 色: #RRGGBB形式（オプション）

### 5.2 UIコンポーネント

#### Button

ボタンコンポーネント。

**ファイル**: `src/components/ui/Button/Button.tsx`

**Props**

```typescript
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}
```

#### Typography

テキストコンポーネント。

**ファイル**: `src/components/ui/Typography/Typography.tsx`

**Props**

```typescript
interface TypographyProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "label";
  variant?:
    | "display"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "body"
    | "caption"
    | "label";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "primary" | "secondary" | "muted" | "accent" | "error";
  align?: "left" | "center" | "right";
  children: React.ReactNode;
  className?: string;
}
```

#### Loading

ローディングコンポーネント。

**ファイル**: `src/components/ui/Loading/Loading.tsx`

**Props**

```typescript
interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse";
  className?: string;
}
```

### 5.3 機能コンポーネント

#### AuthGuard

認証ガードコンポーネント。

**ファイル**: `src/components/ui/AuthGuard/AuthGuard.tsx`

**機能**

- 認証が必要なページで使用
- 未認証ユーザーを認証ページにリダイレクト

#### UrlPreview

URLプレビューコンポーネント。

**ファイル**: `src/components/url/UrlPreview/UrlPreview.tsx`

**機能**

- URLのメタデータを表示
- ファビコン、タイトル、説明を表示

## 6. エラーハンドリング設計

### 6.1 エラー分類

エラーは以下の種類に分類される。

- `network`: ネットワークエラー
- `validation`: バリデーションエラー
- `authentication`: 認証エラー
- `authorization`: 認可エラー
- `server`: サーバーエラー
- `client`: クライアントエラー
- `timeout`: タイムアウトエラー
- `unknown`: 不明なエラー

### 6.2 エラー処理フロー

1. エラーの発生
2. エラーの解析
   - `parseError()`関数でエラーの種類を判定
3. エラー詳細の生成
   - `ErrorDetails`オブジェクトを作成
4. 通知設定の生成
   - `createErrorNotificationConfig()`で通知設定を作成
5. ユーザーへの通知
   - 通知システムに通知設定を渡す

### 6.3 エラーメッセージ管理

エラーメッセージは`src/constants/error-messages.ts`で一元管理されている。

**エラーメッセージ定数**

- `COMMON_ERROR_MESSAGES`: 共通エラーメッセージ
- `GENRE_ERROR_MESSAGES`: ジャンル関連エラーメッセージ
- `CATEGORY_ERROR_MESSAGES`: カテゴリ関連エラーメッセージ
- `URL_ERROR_MESSAGES`: URL関連エラーメッセージ
- `DATABASE_ERROR_MESSAGES`: データベース関連エラーメッセージ

**国際化対応**

エラーメッセージから国際化キーへのマッピングが`ERROR_MESSAGE_TO_I18N_KEY_MAP`で定義されている。

## 7. バリデーション設計

### 7.1 入力値バリデーション

#### URLバリデーション

**関数**: `validateUrlData()` (`src/lib/db/urls.ts`)

**チェック項目**

- `userId`: 必須、空文字でない
- `genreId`: 必須、空文字でない
- `title`: 必須、空文字でない、200文字以内
- `url`: 必須、空文字でない、有効なURL形式
- `description`: 500文字以内（オプション）

#### カテゴリバリデーション

**関数**: `validateCategoryData()` (`src/lib/db/categories.ts`)

**チェック項目**

- `name`: 必須、空文字でない、100文字以内
- `description`: 500文字以内（オプション）
- `color`: #RRGGBB形式（オプション）
- `icon`: 50文字以内（オプション）

#### ジャンルバリデーション

**関数**: `validateGenreData()` (`src/lib/db/genres.ts`)

**チェック項目**

- `name`: 必須、空文字でない、50文字以内
- `description`: 200文字以内（オプション）
- `color`: #RRGGBB形式（オプション）

### 7.2 データ整合性チェック

#### 重複チェック

**カテゴリ名の重複チェック**

- `checkCategoryNameExists()`関数で実装
- 同一ユーザー内で同じ名前のカテゴリが存在するかチェック

**ジャンル名の重複チェック**

- `checkGenreNameExists()`関数で実装
- 同一カテゴリ内で同じ名前のジャンルが存在するかチェック

#### UUID形式チェック

UUID形式の検証は正規表現で実装されている。

```typescript
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
```

## 8. キャッシュ設計

### 8.1 キャッシュタグ設計

キャッシュタグは以下の形式で定義されている。

- `categories-${userId}`: ユーザーのカテゴリ一覧
- `category-${categoryId}`: カテゴリ詳細
- `category-detail-${categoryId}`: カテゴリ詳細ページ
- `genre-${genreId}`: ジャンル詳細
- `genre-detail-${genreId}`: ジャンル詳細ページ
- `user-${userId}`: ユーザー関連データ

### 8.2 キャッシュ無効化戦略

#### URL作成時

以下のタグを無効化:

- `genre-${genreId}`
- `category-${categoryId}`
- `user-${userId}`
- `genre-detail-${genreId}`
- `category-detail-${categoryId}`

#### URL削除時

以下のタグを無効化:

- `genre-${genreId}`
- `category-${categoryId}`
- `user-${userId}`
- `genre-detail-${genreId}`
- `category-detail-${categoryId}`

#### カテゴリ作成時

以下のタグを無効化:

- `categories-${userId}`

#### カテゴリ削除時

以下のタグを無効化:

- `categories-${userId}`

#### ジャンル作成時

以下のタグを無効化:

- `category-${categoryId}`
- `user-${userId}`
- `category-detail-${categoryId}`

#### ジャンル削除時

以下のタグを無効化:

- `category-${categoryId}`
- `user-${userId}`
- `category-detail-${categoryId}`
- `genre-${genreId}`

## 9. 変更履歴

| 日付       | バージョン | 変更内容 | 変更者 |
| ---------- | ---------- | -------- | ------ |
| 2025-12-06 | 1.0        | 初版作成 | -      |
