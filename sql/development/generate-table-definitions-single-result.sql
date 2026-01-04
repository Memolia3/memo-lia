-- ==============================================
-- テーブル定義書自動生成SQL
-- 使用方法:
-- 1. Database ClientのSQL Editorでこのファイルを開く
-- 2. クエリを実行
-- 3. 結果のセルをダブルクリックして全体を表示
-- 4. すべてコピーして docs/table-definitions.md に保存
-- ==============================================

WITH table_columns AS (
  SELECT
    t.table_name,
    c.column_name,
    c.ordinal_position,
    CASE
      WHEN c.data_type = 'character varying' THEN 'VARCHAR(' || c.character_maximum_length || ')'
      WHEN c.data_type = 'character' THEN 'CHAR(' || c.character_maximum_length || ')'
      WHEN c.data_type = 'numeric' THEN 'NUMERIC(' || c.numeric_precision || ',' || c.numeric_scale || ')'
      WHEN c.data_type = 'timestamp with time zone' THEN 'TIMESTAMPTZ'
      WHEN c.data_type = 'uuid' THEN 'UUID'
      WHEN c.data_type = 'boolean' THEN 'BOOLEAN'
      WHEN c.data_type = 'integer' THEN 'INTEGER'
      WHEN c.data_type = 'text' THEN 'TEXT'
      ELSE UPPER(c.data_type)
    END AS data_type,
    c.is_nullable,
    c.column_default
  FROM information_schema.tables t
  JOIN information_schema.columns c ON t.table_name = c.table_name
  WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
),
constraint_info AS (
  SELECT
    kcu.table_name,
    kcu.column_name,
    tc.constraint_type,
    CASE
      WHEN tc.constraint_type = 'FOREIGN KEY' THEN
        ccu.table_name || '(' || ccu.column_name || ')'
      ELSE NULL
    END AS foreign_key_ref
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  LEFT JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
    AND tc.constraint_type = 'FOREIGN KEY'
  WHERE tc.table_schema = 'public'
),
column_constraints AS (
  SELECT
    tc.table_name,
    tc.column_name,
    tc.ordinal_position,
    tc.data_type,
    tc.is_nullable,
    tc.column_default,
    string_agg(
      CASE
        WHEN ci.constraint_type = 'PRIMARY KEY' THEN 'PRIMARY KEY'
        WHEN ci.constraint_type = 'FOREIGN KEY' THEN
          'FOREIGN KEY' || CASE WHEN ci.foreign_key_ref IS NOT NULL THEN ' (' || ci.foreign_key_ref || ')' ELSE '' END
        WHEN ci.constraint_type = 'UNIQUE' THEN 'UNIQUE'
        ELSE NULL
      END,
      ', '
      ORDER BY
        CASE ci.constraint_type
          WHEN 'PRIMARY KEY' THEN 1
          WHEN 'FOREIGN KEY' THEN 2
          WHEN 'UNIQUE' THEN 3
          ELSE 99
        END
    ) AS constraints
  FROM table_columns tc
  LEFT JOIN constraint_info ci
    ON tc.table_name = ci.table_name
    AND tc.column_name = ci.column_name
  GROUP BY tc.table_name, tc.column_name, tc.ordinal_position, tc.data_type, tc.is_nullable, tc.column_default
),
table_definitions AS (
  SELECT
    tc.table_name,
    '#### ' || tc.table_name || ' テーブル' || E'\n\n' ||
    CASE tc.table_name
      WHEN 'users' THEN 'ユーザーの基本情報を格納するテーブル。'
      WHEN 'user_providers' THEN 'OAuthプロバイダー情報を格納するテーブル。'
      WHEN 'urls' THEN 'URLの基本情報を格納するテーブル。'
      WHEN 'categories' THEN 'カテゴリマスタを格納するテーブル。階層構造をサポート。'
      WHEN 'genres' THEN 'ジャンルマスタを格納するテーブル。カテゴリに紐付けられる。'
      WHEN 'tags' THEN 'タグマスタを格納するテーブル。現在はデータベースにテーブルは存在するが、アプリケーション側での実装は未対応。'
      WHEN 'url_categories' THEN 'URLとカテゴリ・ジャンルの関連を格納するテーブル。'
      WHEN 'url_tags' THEN 'URLとタグの多対多関係を格納するテーブル。現在はデータベースにテーブルは存在するが、アプリケーション側での実装は未対応。'
      ELSE '（説明を追加）'
    END || E'\n\n' ||
    '| カラム名 | データ型 | 制約 | 説明 |' || E'\n' ||
    '|----------|----------|------|------|' || E'\n' ||
    string_agg(
      '| ' || tc.column_name || ' | ' ||
      tc.data_type || ' | ' ||
      CASE
        WHEN tc.is_nullable = 'NO' THEN 'NOT NULL'
        ELSE ''
      END ||
      CASE
        WHEN tc.constraints IS NOT NULL THEN
          CASE WHEN tc.is_nullable = 'NO' THEN ', ' ELSE '' END || tc.constraints
        ELSE ''
      END ||
      CASE
        WHEN tc.column_default IS NOT NULL THEN
          CASE
            WHEN tc.is_nullable = 'NO' OR tc.constraints IS NOT NULL THEN ', '
            ELSE ''
          END || 'DEFAULT ' ||
          CASE
            WHEN tc.column_default LIKE '%gen_random_uuid()%' THEN 'gen_random_uuid()'
            WHEN tc.column_default LIKE '%now()%' THEN 'now()'
            ELSE tc.column_default
          END
        ELSE ''
      END || ' | ' ||
      CASE tc.table_name
        WHEN 'users' THEN
          CASE tc.column_name
            WHEN 'id' THEN 'ユーザーID'
            WHEN 'email' THEN 'メールアドレス'
            WHEN 'name' THEN 'ユーザー名'
            WHEN 'avatar_url' THEN 'アバター画像URL'
            WHEN 'created_at' THEN '作成日時'
            WHEN 'updated_at' THEN '更新日時'
            ELSE '（説明）'
          END
        WHEN 'user_providers' THEN
          CASE tc.column_name
            WHEN 'id' THEN 'プロバイダーID'
            WHEN 'user_id' THEN 'ユーザーID'
            WHEN 'provider' THEN 'プロバイダー名 (google, github, discord)'
            WHEN 'provider_id' THEN 'プロバイダー側のユーザーID'
            WHEN 'access_token' THEN 'アクセストークン'
            WHEN 'refresh_token' THEN 'リフレッシュトークン'
            WHEN 'expires_at' THEN 'トークン有効期限'
            WHEN 'created_at' THEN '作成日時'
            WHEN 'updated_at' THEN '更新日時'
            ELSE '（説明）'
          END
        WHEN 'urls' THEN
          CASE tc.column_name
            WHEN 'id' THEN 'URL ID'
            WHEN 'user_id' THEN 'ユーザーID'
            WHEN 'title' THEN 'タイトル（1文字以上）'
            WHEN 'url' THEN 'URL（正規表現で検証）'
            WHEN 'description' THEN '説明（最大1000文字）'
            WHEN 'favicon_url' THEN 'ファビコンURL'
            WHEN 'thumbnail_url' THEN 'サムネイル画像URL'
            WHEN 'is_public' THEN '公開設定'
            WHEN 'view_count' THEN '閲覧回数（0以上）'
            WHEN 'created_at' THEN '作成日時'
            WHEN 'updated_at' THEN '更新日時'
            WHEN 'last_accessed_at' THEN '最終アクセス日時'
            ELSE '（説明）'
          END
        WHEN 'categories' THEN
          CASE tc.column_name
            WHEN 'id' THEN 'カテゴリID'
            WHEN 'user_id' THEN 'ユーザーID'
            WHEN 'parent_id' THEN '親カテゴリID'
            WHEN 'name' THEN 'カテゴリ名（1-100文字）'
            WHEN 'description' THEN '説明（最大500文字）'
            WHEN 'color' THEN '色（#RRGGBB形式）'
            WHEN 'icon' THEN 'アイコン名（最大50文字）'
            WHEN 'sort_order' THEN '並び順（0以上）'
            WHEN 'level' THEN '階層レベル（0-10）'
            WHEN 'path' THEN '階層パス（最大1000文字）'
            WHEN 'is_active' THEN '有効フラグ'
            WHEN 'is_folder' THEN 'フォルダフラグ'
            WHEN 'created_at' THEN '作成日時'
            WHEN 'updated_at' THEN '更新日時'
            ELSE '（説明）'
          END
        WHEN 'genres' THEN
          CASE tc.column_name
            WHEN 'id' THEN 'ジャンルID'
            WHEN 'user_id' THEN 'ユーザーID'
            WHEN 'category_id' THEN 'カテゴリID'
            WHEN 'name' THEN 'ジャンル名（1-100文字）'
            WHEN 'description' THEN '説明（最大500文字）'
            WHEN 'color' THEN '色（#RRGGBB形式）'
            WHEN 'icon' THEN 'アイコン名（最大50文字）'
            WHEN 'sort_order' THEN '並び順（0以上）'
            WHEN 'is_active' THEN '有効フラグ'
            WHEN 'created_at' THEN '作成日時'
            WHEN 'updated_at' THEN '更新日時'
            ELSE '（説明）'
          END
        WHEN 'tags' THEN
          CASE tc.column_name
            WHEN 'id' THEN 'タグID'
            WHEN 'user_id' THEN 'ユーザーID'
            WHEN 'name' THEN 'タグ名（1-100文字）'
            WHEN 'color' THEN '色（#RRGGBB形式）'
            WHEN 'is_active' THEN '有効フラグ'
            WHEN 'created_at' THEN '作成日時'
            WHEN 'updated_at' THEN '更新日時'
            ELSE '（説明）'
          END
        WHEN 'url_categories' THEN
          CASE tc.column_name
            WHEN 'id' THEN '関連ID'
            WHEN 'url_id' THEN 'URL ID'
            WHEN 'category_id' THEN 'カテゴリID'
            WHEN 'genre_id' THEN 'ジャンルID'
            WHEN 'created_at' THEN '作成日時'
            ELSE '（説明）'
          END
        WHEN 'url_tags' THEN
          CASE tc.column_name
            WHEN 'id' THEN '関連ID'
            WHEN 'url_id' THEN 'URL ID'
            WHEN 'tag_id' THEN 'タグID'
            WHEN 'created_at' THEN '作成日時'
            ELSE '（説明）'
          END
        ELSE '（説明）'
      END || ' |',
      E'\n'
      ORDER BY tc.ordinal_position
    ) || E'\n\n---\n\n' AS definition
  FROM column_constraints tc
  GROUP BY tc.table_name
)
-- すべてのテーブル定義を1つの文字列に結合
SELECT string_agg(definition, '' ORDER BY table_name) AS all_table_definitions
FROM table_definitions;

