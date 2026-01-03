# MemoLia 基本設計書

## 目次

1. [システム概要](#1-システム概要)
   - 1.1 [システム構成](#11-システム構成)
   - 1.2 [アーキテクチャ概要](#12-アーキテクチャ概要)
   - 1.3 [技術選定理由](#13-技術選定理由)
2. [システムアーキテクチャ](#2-システムアーキテクチャ)
   - 2.1 [全体構成](#21-全体構成)
   - 2.2 [レイヤー構成](#22-レイヤー構成)
   - 2.3 [データフロー](#23-データフロー)
3. [データベース設計](#3-データベース設計)
   - 3.1 [テーブル設計](#31-テーブル設計)
   - 3.2 [インデックス設計](#32-インデックス設計)
   - 3.3 [ビュー設計](#33-ビュー設計)
   - 3.4 [トランザクション設計](#34-トランザクション設計)
4. [API設計](#4-api設計)
   - 4.1 [サーバーアクション設計](#41-サーバーアクション設計)
   - 4.2 [API Routes設計](#42-api-routes設計)
   - 4.3 [エラーハンドリング](#43-エラーハンドリング)
5. [認証・認可設計](#5-認証認可設計)
   - 5.1 [認証フロー](#51-認証フロー)
   - 5.2 [セッション管理](#52-セッション管理)
   - 5.3 [トークン管理](#53-トークン管理)
6. [画面設計](#6-画面設計)
   - 6.1 [画面遷移図](#61-画面遷移図)
   - 6.2 [画面レイアウト](#62-画面レイアウト)
   - 6.3 [コンポーネント設計](#63-コンポーネント設計)
7. [セキュリティ設計](#7-セキュリティ設計)
   - 7.1 [認証・認可](#71-認証認可)
   - 7.2 [入力値検証](#72-入力値検証)
   - 7.3 [セキュリティヘッダー](#73-セキュリティヘッダー)
   - 7.4 [レート制限](#74-レート制限)
8. [パフォーマンス設計](#8-パフォーマンス設計)
   - 8.1 [キャッシュ戦略](#81-キャッシュ戦略)
   - 8.2 [最適化手法](#82-最適化手法)
   - 8.3 [データベース最適化](#83-データベース最適化)
9. [エラーハンドリング設計](#9-エラーハンドリング設計)
   - 9.1 [エラー分類](#91-エラー分類)
   - 9.2 [エラー処理フロー](#92-エラー処理フロー)
   - 9.3 [ログ設計](#93-ログ設計)
10. [国際化設計](#10-国際化設計)
    - 10.1 [多言語対応](#101-多言語対応)
    - 10.2 [ルーティング設計](#102-ルーティング設計)
11. [運用設計](#11-運用設計)
    - 11.1 [デプロイメント](#111-デプロイメント)
    - 11.2 [監視・ログ](#112-監視ログ)
    - 11.3 [バックアップ・リカバリ](#113-バックアップリカバリ)
12. [将来の拡張機能](#12-将来の拡張機能)
    - 12.1 [タグ機能](#121-タグ機能)
    - 12.2 [その他の拡張機能](#122-その他の拡張機能)
13. [変更履歴](#13-変更履歴)

## 1. システム概要

### 1.1 システム構成

MemoLiaは、Next.js 15のApp
Routerを採用したフルスタックWebアプリケーションである。サーバーサイドレンダリングとクライアントサイドレンダリングを組み合わせたハイブリッドアーキテクチャを採用し、パフォーマンスとユーザー体験の両立を実現している。

システムは以下の3層で構成される。

- プレゼンテーション層: Next.js App Router、React 19、TypeScript
- ビジネスロジック層: サーバーアクション、API Routes
- データ層: PostgreSQL (Neon Serverless)

### 1.2 アーキテクチャ概要

本システムは、フロントエンドとバックエンドが同一のコードベースに存在し、サーバーアクションとAPI
Routesを活用してバックエンド処理を実現している。

主要な特徴は以下の通り。

- サーバーコンポーネントによる初期レンダリングの最適化
- クライアントコンポーネントによるインタラクティブなUI実現
- サーバーアクションによる型安全なデータ操作
- 静的生成と動的レンダリングの適切な使い分け

### 1.3 技術選定理由

#### Next.js 15.2.8

App
Routerによる最新のルーティング機能とサーバーコンポーネントの活用により、パフォーマンスと開発効率を両立。React
Server Componentsにより、初期読み込み時間の短縮とサーバー負荷の軽減を実現。

#### React 19

最新のReact機能を活用し、将来の拡張性を確保。Concurrent
Featuresによるユーザー体験の向上。

#### TypeScript

型安全性による開発効率の向上とバグの早期発見。大規模開発における保守性の確保。

#### PostgreSQL (Neon Serverless)

サーバーレスアーキテクチャによる自動スケーリングとコスト最適化。PostgreSQLの豊富な機能を活用した複雑なクエリの実現。

#### NextAuth.js v5

OAuth 2.0による安全な認証。複数プロバイダー対応による柔軟な認証方式の提供。

## 2. システムアーキテクチャ

### 2.1 全体構成

```
┌─────────────────────────────────────────────────────────┐
│                     クライアント                         │
│  (ブラウザ: Chrome, Firefox, Safari, Edge)            │
└────────────────────┬────────────────────────────────────┘
                      │ HTTPS
┌─────────────────────▼────────────────────────────────────┐
│                  Vercel Edge Network                    │
│              (CDN、静的ファイル配信)                     │
└────────────────────┬────────────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────────────┐
│              Next.js Application (Vercel)               │
│  ┌──────────────────────────────────────────────────┐   │
│  │  App Router (Server Components)                  │   │
│  │  - ルーティング                                  │   │
│  │  - サーバーコンポーネント                        │   │
│  │  - サーバーアクション                            │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  API Routes                                       │   │
│  │  - /api/auth/* (NextAuth.js)                     │   │
│  │  - /api/urls/metadata                            │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Middleware                                       │   │
│  │  - 国際化ルーティング                            │   │
│  │  - セキュリティヘッダー                          │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────────────┐
│         PostgreSQL (Neon Serverless)                    │
│  - ユーザーデータ                                       │
│  - URLデータ                                            │
│  - カテゴリ・ジャンルデータ                             │
└─────────────────────────────────────────────────────────┘
```

### 2.2 レイヤー構成

#### プレゼンテーション層

- ページコンポーネント: `src/app/[locale]/*`
- UIコンポーネント: `src/components/ui/*`
- 機能コンポーネント: `src/features/*`
- レイアウトコンポーネント: `src/components/layout/*`

#### ビジネスロジック層

- サーバーアクション: `src/actions/*`
- API Routes: `src/app/api/*`
- ビジネスロジック: `src/lib/db/*`

#### データアクセス層

- データベース接続: `src/lib/neon/*`
- SQL実行: `src/lib/db/*`
- トランザクション管理: `src/lib/db/transaction.ts`

### 2.3 データフロー

#### URL登録フロー

1. ユーザーがURL入力フォームにURLを入力
2. クライアントコンポーネントがフォーム送信を処理
3. サーバーアクション `createUrlAction` が呼び出される
4. サーバーアクション内で以下を実行
   - 入力値のバリデーション
   - データベーストランザクション開始
   - URLメタデータの取得（必要に応じて）
   - データベースへの挿入
   - キャッシュの無効化
5. 結果をクライアントに返却
6. クライアントが成功/失敗に応じたUI更新

#### 認証フロー

1. ユーザーがOAuthプロバイダーを選択
2. NextAuth.jsがOAuth認証フローを開始
3. プロバイダーから認証情報を取得
4. `signIn` イベントでユーザー情報を同期
5. JWTトークンを生成
6. セッション情報をクライアントに返却
7. クライアントが認証状態を管理

## 3. データベース設計

### 3.1 テーブル設計

#### users テーブル

ユーザーの基本情報を格納するテーブル。

| カラム名   | データ型    | 制約                    | 説明            |
| ---------- | ----------- | ----------------------- | --------------- |
| id         | UUID        | PRIMARY KEY             | ユーザーID      |
| email      | TEXT        | UNIQUE, NOT NULL        | メールアドレス  |
| name       | TEXT        |                         | ユーザー名      |
| avatar_url | TEXT        |                         | アバター画像URL |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 作成日時        |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 更新日時        |

#### user_providers テーブル

OAuthプロバイダー情報を格納するテーブル。

| カラム名      | データ型    | 制約                    | 説明                                     |
| ------------- | ----------- | ----------------------- | ---------------------------------------- |
| id            | UUID        | PRIMARY KEY             | プロバイダーID                           |
| user_id       | UUID        | FOREIGN KEY, NOT NULL   | ユーザーID                               |
| provider      | TEXT        | NOT NULL                | プロバイダー名 (google, github, discord) |
| provider_id   | TEXT        | NOT NULL                | プロバイダー側のユーザーID               |
| access_token  | TEXT        |                         | アクセストークン                         |
| refresh_token | TEXT        |                         | リフレッシュトークン                     |
| expires_at    | TIMESTAMPTZ |                         | トークン有効期限                         |
| created_at    | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 作成日時                                 |
| updated_at    | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 更新日時                                 |

#### urls テーブル

URLの基本情報を格納するテーブル。

| カラム名         | データ型    | 制約                    | 説明                  |
| ---------------- | ----------- | ----------------------- | --------------------- |
| id               | UUID        | PRIMARY KEY             | URL ID                |
| user_id          | UUID        | FOREIGN KEY, NOT NULL   | ユーザーID            |
| title            | TEXT        | NOT NULL, CHECK         | タイトル（1文字以上） |
| url              | TEXT        | NOT NULL, CHECK         | URL（正規表現で検証） |
| description      | TEXT        | CHECK                   | 説明（最大1000文字）  |
| favicon_url      | TEXT        | CHECK                   | ファビコンURL         |
| thumbnail_url    | TEXT        | CHECK                   | サムネイル画像URL     |
| is_public        | BOOLEAN     | DEFAULT false           | 公開設定              |
| view_count       | INTEGER     | DEFAULT 0, CHECK        | 閲覧回数（0以上）     |
| created_at       | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 作成日時              |
| updated_at       | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 更新日時              |
| last_accessed_at | TIMESTAMPTZ |                         | 最終アクセス日時      |

#### categories テーブル

カテゴリマスタを格納するテーブル。階層構造をサポート。

| カラム名    | データ型    | 制約                    | 説明                     |
| ----------- | ----------- | ----------------------- | ------------------------ |
| id          | UUID        | PRIMARY KEY             | カテゴリID               |
| user_id     | UUID        | FOREIGN KEY, NOT NULL   | ユーザーID               |
| parent_id   | UUID        | FOREIGN KEY             | 親カテゴリID             |
| name        | TEXT        | NOT NULL, CHECK         | カテゴリ名（1-100文字）  |
| description | TEXT        | CHECK                   | 説明（最大500文字）      |
| color       | TEXT        | CHECK                   | 色（#RRGGBB形式）        |
| icon        | TEXT        | CHECK                   | アイコン名（最大50文字） |
| sort_order  | INTEGER     | DEFAULT 0, CHECK        | 並び順（0以上）          |
| level       | INTEGER     | DEFAULT 0, CHECK        | 階層レベル（0-10）       |
| path        | TEXT        | CHECK                   | 階層パス（最大1000文字） |
| is_active   | BOOLEAN     | DEFAULT true            | 有効フラグ               |
| is_folder   | BOOLEAN     | DEFAULT false           | フォルダフラグ           |
| created_at  | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 作成日時                 |
| updated_at  | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 更新日時                 |

#### genres テーブル

ジャンルマスタを格納するテーブル。カテゴリに紐付けられる。

| カラム名    | データ型    | 制約                    | 説明                     |
| ----------- | ----------- | ----------------------- | ------------------------ |
| id          | UUID        | PRIMARY KEY             | ジャンルID               |
| user_id     | UUID        | FOREIGN KEY, NOT NULL   | ユーザーID               |
| category_id | UUID        | FOREIGN KEY, NOT NULL   | カテゴリID               |
| name        | TEXT        | NOT NULL, CHECK         | ジャンル名（1-100文字）  |
| description | TEXT        | CHECK                   | 説明（最大500文字）      |
| color       | TEXT        | CHECK                   | 色（#RRGGBB形式）        |
| icon        | TEXT        | CHECK                   | アイコン名（最大50文字） |
| sort_order  | INTEGER     | DEFAULT 0, CHECK        | 並び順（0以上）          |
| is_active   | BOOLEAN     | DEFAULT true            | 有効フラグ               |
| created_at  | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 作成日時                 |
| updated_at  | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 更新日時                 |

#### url_categories テーブル

URLとカテゴリ・ジャンルの関連を格納するテーブル。

| カラム名    | データ型    | 制約                    | 説明       |
| ----------- | ----------- | ----------------------- | ---------- |
| id          | UUID        | PRIMARY KEY             | 関連ID     |
| url_id      | UUID        | FOREIGN KEY, NOT NULL   | URL ID     |
| category_id | UUID        | FOREIGN KEY, NOT NULL   | カテゴリID |
| genre_id    | UUID        | FOREIGN KEY, NOT NULL   | ジャンルID |
| created_at  | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 作成日時   |

#### tags テーブル

タグマスタを格納するテーブル。現在はデータベースにテーブルは存在するが、アプリケーション側での実装は未対応。

| カラム名   | データ型    | 制約                    | 説明                |
| ---------- | ----------- | ----------------------- | ------------------- |
| id         | UUID        | PRIMARY KEY             | タグID              |
| user_id    | UUID        | FOREIGN KEY, NOT NULL   | ユーザーID          |
| name       | TEXT        | NOT NULL, CHECK         | タグ名（1-100文字） |
| color      | TEXT        | CHECK                   | 色（#RRGGBB形式）   |
| is_active  | BOOLEAN     | DEFAULT true            | 有効フラグ          |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 作成日時            |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 更新日時            |

#### url_tags テーブル

URLとタグの多対多関係を格納するテーブル。現在はデータベースにテーブルは存在するが、アプリケーション側での実装は未対応。

| カラム名   | データ型    | 制約                    | 説明     |
| ---------- | ----------- | ----------------------- | -------- |
| id         | UUID        | PRIMARY KEY             | 関連ID   |
| url_id     | UUID        | FOREIGN KEY, NOT NULL   | URL ID   |
| tag_id     | UUID        | FOREIGN KEY, NOT NULL   | タグID   |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 作成日時 |

### 3.2 インデックス設計

#### 主要インデックス

- `idx_urls_user_url`: urlsテーブルの (user_id, url) にユニークインデックス
- `idx_urls_user_id`: urlsテーブルの user_id にインデックス
- `idx_categories_user_id`: categoriesテーブルの user_id にインデックス
- `idx_categories_parent_id`: categoriesテーブルの parent_id にインデックス
- `idx_genres_user_id`: genresテーブルの user_id にインデックス
- `idx_genres_category_id`: genresテーブルの category_id にインデックス
- `idx_url_categories_url_id`: url_categoriesテーブルの url_id にインデックス
- `idx_url_categories_genre_id`:
  url_categoriesテーブルの genre_id にインデックス

#### 全文検索インデックス

- 多言語全文検索用GINインデックス（日本語・英語対応）
- タイトル・説明文に対する検索最適化

#### 部分インデックス

- アクティブなレコードのみにインデックスを設定（is_active = true）

### 3.3 ビュー設計

#### url_details ビュー

URLの詳細情報をカテゴリ、ジャンルと結合して表示するビュー。

#### user_stats ビュー

ユーザーの統計情報（URL数、カテゴリ数、ジャンル数）を集計するビュー。

#### popular_urls ビュー

人気の公開URLを閲覧回数順に表示するビュー。

#### category_hierarchy ビュー

カテゴリの階層構造を再帰的に表示するビュー。

#### genre_with_category ビュー

ジャンルとカテゴリ情報を統合して表示するビュー。

#### multilingual_search_results ビュー

多言語対応の統合検索結果を表示するビュー。

### 3.4 トランザクション設計

データの整合性を保つため、以下の操作はトランザクション内で実行する。

- URL登録時の関連テーブルへの挿入
- カテゴリ削除時の関連データの削除
- ジャンル削除時の関連データの削除

トランザクション処理は `executeTransactionWithErrorHandling`
関数を使用し、エラーハンドリングとロールバックを自動的に処理する。

## 4. API設計

### 4.1 サーバーアクション設計

サーバーアクションは、クライアントコンポーネントから直接呼び出せる型安全なサーバーサイド関数である。

#### createUrlAction

URLを登録するサーバーアクション。

**入力**

- title: string
- url: string
- description?: string
- genreId: string
- faviconUrl?: string

**出力**

- success: boolean
- data?: UrlData
- error?: string

**処理フロー**

1. 入力値のバリデーション
2. ジャンルからカテゴリIDを取得
3. 既存URLの確認
4. URLテーブルへの挿入（既存の場合はスキップ）
5. url_categoriesテーブルへの挿入
6. ジャンル・カテゴリの更新日時を更新
7. キャッシュの無効化

#### getUrlsByGenreAction

ジャンルに紐づくURL一覧を取得するサーバーアクション。

**入力**

- genreId: string
- page: number (デフォルト: 1)
- limit: number (デフォルト: 20)

**出力**

- UrlData[]

**処理フロー**

1. ジャンルの存在確認
2. URL一覧の取得（ページネーション）
3. 関連データの結合
4. 結果の返却

### 4.2 API Routes設計

#### POST /api/urls/metadata

URLのメタデータ（タイトル、説明、ファビコン）を取得するAPI。

**リクエスト**

```json
{
  "url": "https://example.com"
}
```

**レスポンス**

```json
{
  "title": "Example",
  "description": "Example description",
  "faviconUrl": "https://example.com/favicon.ico",
  "url": "https://example.com"
}
```

**処理フロー**

1. レート制限チェック
2. 認証チェック
3. URLの妥当性チェック
4. キャッシュチェック
5. HTMLの取得
6. メタデータの抽出
7. キャッシュへの保存
8. 結果の返却

**エラーレスポンス**

- 400: 不正なURL形式
- 401: 未認証
- 429: レート制限超過
- 500: サーバーエラー

#### GET /api/auth/\*

NextAuth.jsによる認証エンドポイント。OAuth認証フローを処理する。

### 4.3 エラーハンドリング

#### エラー分類

- バリデーションエラー: 400 Bad Request
- 認証エラー: 401 Unauthorized
- 認可エラー: 403 Forbidden
- リソース未検出: 404 Not Found
- レート制限: 429 Too Many Requests
- サーバーエラー: 500 Internal Server Error

#### エラー処理フロー

1. エラーの発生
2. エラータイプの判定
3. エラーメッセージの生成
4. ログの記録
5. クライアントへの返却

## 5. 認証・認可設計

### 5.1 認証フロー

#### OAuth認証フロー

1. ユーザーがOAuthプロバイダーを選択
2. NextAuth.jsが認証URLにリダイレクト
3. プロバイダーで認証
4. プロバイダーから認証コードを取得
5. 認証コードをアクセストークンに交換
6. ユーザー情報を取得
7. データベースにユーザー情報を同期
8. JWTトークンを生成
9. セッション情報をクライアントに返却

#### サポートプロバイダー

- Google
- GitHub
- Discord

### 5.2 セッション管理

#### JWTセッション

NextAuth.jsはJWTベースのセッション管理を採用している。

- セッション有効期限: 24時間
- トークン更新: リフレッシュトークンによる自動更新
- ストレージ: HTTP-only Cookie

#### セッション情報

- user.id: ユーザーID
- user.email: メールアドレス
- user.name: ユーザー名
- user.image: アバター画像URL
- accessToken: アクセストークン
- refreshToken: リフレッシュトークン
- expiresAt: トークン有効期限

### 5.3 トークン管理

#### トークンリフレッシュ

アクセストークンの有効期限が切れる前に、リフレッシュトークンを使用して新しいアクセストークンを取得する。

**処理フロー**

1. トークンの有効期限チェック
2. リフレッシュトークンの存在確認
3. プロバイダーAPIにリフレッシュリクエスト
4. 新しいアクセストークンの取得
5. データベースのトークン情報を更新
6. JWTトークンを更新

## 6. 画面設計

### 6.1 画面遷移図

```
/ (TOP)
  ├─ /auth (認証)
  │   └─ /dashboard (ダッシュボード)
  │       ├─ /categories/new (カテゴリ作成)
  │       └─ /category/[id]/[name] (カテゴリ詳細)
  │           ├─ /genres/new (ジャンル作成)
  │           └─ /genre/[genreId]/[genreName] (ジャンル詳細)
  │               └─ /urls/new (URL登録)
  ├─ /bookmarklet (ブックマークレット)
  ├─ /share/[id] (URL共有)
  ├─ /privacy (プライバシーポリシー)
  └─ /terms (利用規約)
```

### 6.2 画面レイアウト

#### 共通レイアウト

- ヘッダー: アプリ名、ナビゲーション、ユーザー情報
- メインコンテンツ: ページ固有のコンテンツ
- フッター: コピーライト、リンク

#### レスポンシブデザイン

- デスクトップ: 1024px以上
- タブレット: 768px以上
- モバイル: 320px以上

デバイス別に最適化されたレイアウトを提供する。

### 6.3 コンポーネント設計

#### UIコンポーネント

- Button: ボタンコンポーネント
- Container: コンテナコンポーネント
- Typography: テキストコンポーネント
- Loading: ローディングコンポーネント
- Icon: アイコンコンポーネント
- Image: 画像コンポーネント
- Tooltip: ツールチップコンポーネント
- ScrollArea: スクロールエリアコンポーネント

#### 機能コンポーネント

- AuthGuard: 認証ガードコンポーネント
- UrlPreview: URLプレビューコンポーネント
- BookmarkletInstaller: ブックマークレットインストーラー
- NotificationContainer: 通知コンテナ

## 7. セキュリティ設計

### 7.1 認証・認可

#### 認証

- OAuth 2.0による安全な認証
- JWTトークンによるセッション管理
- リフレッシュトークンによる自動更新

#### 認可

- ユーザーIDによるデータアクセス制御
- サーバーサイドでの認可チェック
- クライアントサイドでのUI制御

### 7.2 入力値検証

#### URL検証

- URL形式の検証（正規表現）
- 危険なプロトコルの検証（javascript:, data:, vbscript:, file:, ftp:）
- HTTP/HTTPSプロトコルのみ許可

#### HTMLサニタイズ

- HTMLタグのエスケープ
- XSS攻撃の防止
- 危険な文字の置換

#### データ長制限

- タイトル: 1-100文字
- 説明: 最大1000文字
- カテゴリ名: 1-100文字
- カテゴリ説明: 最大500文字

### 7.3 セキュリティヘッダー

#### Content-Security-Policy (CSP)

- default-src 'self'
- script-src 'self' 'nonce-{nonce}' 'unsafe-eval' 'unsafe-inline' (AdSense用)
- style-src 'self' 'unsafe-inline'
- img-src 'self' data: https:
- font-src 'self' data:
- connect-src 'self'
- frame-src 'self' (AdSense用)
- object-src 'none'
- base-uri 'self'
- form-action 'self'

#### Strict-Transport-Security (HSTS)

本番環境でのみ有効。max-age=31536000; includeSubDomains

### 7.4 レート制限

#### メタデータ取得API

- 1分間に20リクエストまで
- IPアドレスベースの制限
- メモリベースの実装（本番環境ではRedis推奨）

## 8. パフォーマンス設計

### 8.1 キャッシュ戦略

#### Next.jsキャッシュ

- 静的ページ: ISR (Incremental Static Regeneration)
- 動的ページ: サーバーサイドキャッシュ
- 画像: 1年間のキャッシュ

#### データベースキャッシュ

- React Queryによるクライアントサイドキャッシュ
- サーバーアクションのキャッシュタグによる無効化

#### メタデータキャッシュ

- メモリベースのキャッシュ（10分間）
- 最大1000件まで保持

### 8.2 最適化手法

#### コード分割

- 動的インポートによる遅延読み込み
- デバイス別コンポーネントの分割
- バンドルサイズの最適化

#### 画像最適化

- Next.js Imageコンポーネントの使用
- AVIF、WebP形式のサポート
- レスポンシブ画像の生成

#### 仮想スクロール

- react-virtuosoによる大量データの効率的な表示
- 画面に表示される項目のみレンダリング

### 8.3 データベース最適化

#### クエリ最適化

- 適切なインデックスの使用
- JOINの最適化
- 部分インデックスの活用

#### 接続プール

- Neon Serverlessによる自動接続管理
- 接続数の最適化

## 9. エラーハンドリング設計

### 9.1 エラー分類

#### クライアントエラー

- バリデーションエラー: 入力値の不正
- 認証エラー: 未認証
- 認可エラー: 権限不足
- リソース未検出: 存在しないリソースへのアクセス

#### サーバーエラー

- データベースエラー: 接続エラー、クエリエラー
- 外部APIエラー: メタデータ取得エラー
- 予期しないエラー: システムエラー

### 9.2 エラー処理フロー

1. エラーの発生
2. エラータイプの判定
3. エラーメッセージの生成
4. ログの記録
5. ユーザーへの通知
6. エラー画面の表示（必要に応じて）

### 9.3 ログ設計

#### ログレベル

- ERROR: エラー情報
- WARN: 警告情報
- INFO: 一般情報
- DEBUG: デバッグ情報（開発環境のみ）

#### ログ出力

- サーバーサイド: コンソール出力（本番環境では外部サービス推奨）
- クライアントサイド: ブラウザコンソール（開発環境のみ）

## 10. 国際化設計

### 10.1 多言語対応

#### サポート言語

- 日本語 (ja)
- 英語 (en)

#### 翻訳ファイル

- `messages/ja.json`: 日本語翻訳
- `messages/en.json`: 英語翻訳

#### 翻訳キー構造

階層的なキー構造により、関連する翻訳をグループ化。

例: `top.features.bookmark.title`

### 10.2 ルーティング設計

#### ロケールプレフィックス

- `as-needed`: デフォルト言語（英語）ではプレフィックスなし
- 日本語: `/ja/*`
- 英語: `/*` (プレフィックスなし)

#### ミドルウェア

- ロケールの自動検出
- ロケール別のルーティング
- セキュリティヘッダーの追加

## 11. 運用設計

### 11.1 デプロイメント

#### Vercelへのデプロイ

- Gitリポジトリへのプッシュで自動デプロイ
- プレビューデプロイの自動生成
- 本番環境への手動デプロイ

#### 環境変数

- 本番環境: Vercelダッシュボードで管理
- 開発環境: `.env.local` で管理

#### ビルドプロセス

1. 依存関係のインストール
2. TypeScriptの型チェック
3. ESLintによるコード品質チェック
4. Next.jsビルド
5. 静的ファイルの生成

### 11.2 監視・ログ

#### パフォーマンス監視

- Vercel Analyticsによるパフォーマンス監視
- Web Vitalsの計測
- エラー率の監視

#### エラーログ

- Vercelのログ機能によるエラー追跡
- エラー通知の設定（推奨）

### 11.3 バックアップ・リカバリ

#### データベースバックアップ

- Neon Serverlessによる自動バックアップ
- ポイントインタイムリカバリ対応

#### リカバリ手順

1. バックアップの確認
2. 復元ポイントの選択
3. データベースの復元
4. 動作確認

## 12. 将来の拡張機能

### 12.1 タグ機能

データベースには既にtagsテーブルとurl_tagsテーブルが存在するが、アプリケーション側での実装は未対応。将来的に以下の機能を実装予定。

#### タグ管理機能

- タグの作成
- タグの編集
- タグの削除
- タグの色設定
- URLへのタグ付け（複数タグ対応）
- タグ名の最大100文字

#### タグ検索機能

- タグによるURLの絞り込み
- タグ一覧の表示
- タグ別のURL一覧表示

#### 実装時の考慮事項

- url_detailsビューの拡張（タグ情報の結合）
- user_statsビューの拡張（タグ数の集計）
- 検索機能へのタグ条件の追加
- UIコンポーネントの追加

### 12.2 その他の拡張機能

- コメント機能
- お気に入り機能
- 共有機能の拡張
- カテゴリの移動・並び替え機能
- バルク操作機能
- 多言語UI対応の拡張
- 翻訳機能
- 言語別の統計ダッシュボード

## 13. 変更履歴

| 日付       | バージョン | 変更内容 | 変更者 |
| ---------- | ---------- | -------- | ------ |
| 2025-12-04 | 1.0        | 初版作成 | -      |
