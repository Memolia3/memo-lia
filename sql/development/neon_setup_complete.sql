-- ==============================================
-- URL保管アプリ データベース構築スクリプト（NeonDB用）
-- このファイルをNeonDBコンソールでコピペして実行してください
--
-- 最新の更新: url_categoriesテーブルにuser_id追加（セキュリティ強化）
-- ==============================================

-- 1. テーブル作成
-- ==============================================

-- ユーザーテーブル
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ユーザープロバイダーテーブル
DROP TABLE IF EXISTS user_providers CASCADE;
CREATE TABLE user_providers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider      TEXT NOT NULL,
  provider_id   TEXT NOT NULL,
  access_token  TEXT,
  refresh_token TEXT,
  expires_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE (provider, provider_id)
);

-- URLテーブル
DROP TABLE IF EXISTS urls CASCADE;
CREATE TABLE urls (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL CHECK (LENGTH(TRIM(title)) > 0),
  url           TEXT NOT NULL CHECK (url ~ '^https?://[^\s/$.?#].[^\s]*$'),
  description   TEXT CHECK (LENGTH(description) <= 1000),
  favicon_url   TEXT CHECK (favicon_url ~ '^https?://[^\s/$.?#].[^\s]*$' OR favicon_url IS NULL),
  thumbnail_url TEXT CHECK (thumbnail_url ~ '^https?://[^\s/$.?#].[^\s]*$' OR thumbnail_url IS NULL),
  is_public     BOOLEAN DEFAULT false,
  view_count    INTEGER DEFAULT 0 CHECK (view_count >= 0),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  last_accessed_at TIMESTAMPTZ
);

-- カテゴリテーブル（階層化対応）
DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id     UUID REFERENCES categories(id) ON DELETE CASCADE,
  name          TEXT NOT NULL CHECK (LENGTH(TRIM(name)) > 0 AND LENGTH(name) <= 100),
  description   TEXT CHECK (LENGTH(description) <= 500),
  color         TEXT CHECK (color ~ '^#[0-9A-Fa-f]{6}$' OR color IS NULL),
  icon          TEXT CHECK (LENGTH(icon) <= 50),
  sort_order    INTEGER DEFAULT 0 CHECK (sort_order >= 0),
  level         INTEGER DEFAULT 0 CHECK (level >= 0 AND level <= 10),
  path          TEXT CHECK (LENGTH(path) <= 1000),
  is_active     BOOLEAN DEFAULT true,
  is_folder     BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT check_no_self_reference CHECK (id != parent_id)
);

-- ジャンルテーブル（カテゴリに紐づけ）
DROP TABLE IF EXISTS genres CASCADE;
CREATE TABLE genres (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id   UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  color         TEXT,
  icon          TEXT,
  sort_order    INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- タグテーブル
DROP TABLE IF EXISTS tags CASCADE;
CREATE TABLE tags (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  color         TEXT,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- URL-カテゴリ関連テーブル
DROP TABLE IF EXISTS url_categories CASCADE;
CREATE TABLE url_categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id        UUID NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
  category_id   UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  genre_id      UUID REFERENCES genres(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- セキュリティ向上のため追加
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE (url_id, category_id, genre_id)
);

-- URL-タグ関連テーブル
DROP TABLE IF EXISTS url_tags CASCADE;
CREATE TABLE url_tags (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id        UUID NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
  tag_id        UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE (url_id, tag_id)
);

-- 2. インデックス作成
-- ==============================================

-- URLインデックス
CREATE UNIQUE INDEX idx_urls_user_url ON urls(user_id, url);
CREATE INDEX idx_urls_user_id ON urls(user_id);
CREATE INDEX idx_urls_title_en ON urls USING gin(to_tsvector('english', title));
CREATE INDEX idx_urls_title_multi ON urls USING gin(to_tsvector('simple', title));
CREATE INDEX idx_urls_description_en ON urls USING gin(to_tsvector('english', description)) WHERE description IS NOT NULL;
CREATE INDEX idx_urls_description_multi ON urls USING gin(to_tsvector('simple', description)) WHERE description IS NOT NULL;
CREATE INDEX idx_urls_is_public ON urls(is_public) WHERE is_public = true;
CREATE INDEX idx_urls_created_at ON urls(created_at DESC);
CREATE INDEX idx_urls_updated_at ON urls(updated_at DESC);
CREATE INDEX idx_urls_last_accessed_at ON urls(last_accessed_at DESC) WHERE last_accessed_at IS NOT NULL;
CREATE INDEX idx_urls_view_count ON urls(view_count DESC);

-- カテゴリインデックス
CREATE UNIQUE INDEX idx_categories_user_parent_name ON categories(user_id, parent_id, name) WHERE is_active = true;
CREATE INDEX idx_categories_path ON categories(user_id, path) WHERE is_active = true;
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_parent_id ON categories(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_categories_level ON categories(user_id, level, sort_order);
CREATE INDEX idx_categories_is_folder ON categories(user_id, is_folder, sort_order);
CREATE INDEX idx_categories_is_active ON categories(is_active) WHERE is_active = true;
CREATE INDEX idx_categories_sort_order ON categories(user_id, parent_id, sort_order, name);
CREATE INDEX idx_categories_name_en ON categories USING gin(to_tsvector('english', name));
CREATE INDEX idx_categories_name_multi ON categories USING gin(to_tsvector('simple', name));
CREATE INDEX idx_categories_description_en ON categories USING gin(to_tsvector('english', description)) WHERE description IS NOT NULL;
CREATE INDEX idx_categories_description_multi ON categories USING gin(to_tsvector('simple', description)) WHERE description IS NOT NULL;

-- ジャンルインデックス
CREATE UNIQUE INDEX idx_genres_category_name ON genres(category_id, name) WHERE is_active = true;
CREATE INDEX idx_genres_user_id ON genres(user_id);
CREATE INDEX idx_genres_category_id ON genres(category_id);
CREATE INDEX idx_genres_is_active ON genres(is_active) WHERE is_active = true;
CREATE INDEX idx_genres_sort_order ON genres(category_id, sort_order, name);
CREATE INDEX idx_genres_name_en ON genres USING gin(to_tsvector('english', name));
CREATE INDEX idx_genres_name_multi ON genres USING gin(to_tsvector('simple', name));
CREATE INDEX idx_genres_description_en ON genres USING gin(to_tsvector('english', description)) WHERE description IS NOT NULL;
CREATE INDEX idx_genres_description_multi ON genres USING gin(to_tsvector('simple', description)) WHERE description IS NOT NULL;

-- タグインデックス
CREATE UNIQUE INDEX idx_tags_user_name ON tags(user_id, name) WHERE is_active = true;
CREATE INDEX idx_tags_user_id ON tags(user_id);
CREATE INDEX idx_tags_is_active ON tags(is_active) WHERE is_active = true;
CREATE INDEX idx_tags_name_en ON tags USING gin(to_tsvector('english', name));
CREATE INDEX idx_tags_name_multi ON tags USING gin(to_tsvector('simple', name));

-- 関連テーブルインデックス
CREATE INDEX idx_url_categories_url_id ON url_categories(url_id);
CREATE INDEX idx_url_categories_category_id ON url_categories(category_id);
CREATE INDEX idx_url_categories_genre_id ON url_categories(genre_id) WHERE genre_id IS NOT NULL;
CREATE INDEX idx_url_categories_user_id ON url_categories(user_id);

-- ユーザー別アクセス用の複合インデックス
CREATE INDEX idx_url_categories_user_genre ON url_categories(user_id, genre_id) WHERE genre_id IS NOT NULL;
CREATE INDEX idx_url_categories_user_category ON url_categories(user_id, category_id);

CREATE INDEX idx_url_tags_url_id ON url_tags(url_id);
CREATE INDEX idx_url_tags_tag_id ON url_tags(tag_id);

-- 3. ビュー作成
-- ==============================================

-- URL詳細ビュー
CREATE OR REPLACE VIEW url_details AS
SELECT
  u.id,
  u.user_id,
  u.title,
  u.url,
  u.description,
  u.favicon_url,
  u.thumbnail_url,
  u.is_public,
  u.view_count,
  u.created_at,
  u.updated_at,
  u.last_accessed_at,
  STRING_AGG(DISTINCT c.name, ',') FILTER (WHERE c.id IS NOT NULL) as categories,
  STRING_AGG(DISTINCT c.color, ',') FILTER (WHERE c.color IS NOT NULL) as category_colors,
  STRING_AGG(DISTINCT c.path, ',') FILTER (WHERE c.path IS NOT NULL) as category_paths,
  STRING_AGG(DISTINCT g.name, ',') FILTER (WHERE g.id IS NOT NULL) as genres,
  STRING_AGG(DISTINCT g.color, ',') FILTER (WHERE g.color IS NOT NULL) as genre_colors,
  STRING_AGG(DISTINCT t.name, ',') FILTER (WHERE t.id IS NOT NULL) as tags,
  STRING_AGG(DISTINCT t.color, ',') FILTER (WHERE t.color IS NOT NULL) as tag_colors
FROM urls u
LEFT JOIN url_categories uc ON u.id = uc.url_id
LEFT JOIN categories c ON uc.category_id = c.id AND c.is_active = true
LEFT JOIN genres g ON uc.genre_id = g.id AND g.is_active = true
LEFT JOIN url_tags ut ON u.id = ut.url_id
LEFT JOIN tags t ON ut.tag_id = t.id AND t.is_active = true
GROUP BY u.id, u.user_id, u.title, u.url, u.description, u.favicon_url, u.thumbnail_url,
         u.is_public, u.view_count, u.created_at, u.updated_at, u.last_accessed_at;

-- ユーザー統計ビュー
CREATE OR REPLACE VIEW user_stats AS
SELECT
  u.id as user_id,
  u.email,
  u.name,
  COUNT(DISTINCT urls.id) as total_urls,
  COUNT(DISTINCT urls.id) FILTER (WHERE urls.is_public = true) as public_urls,
  COUNT(DISTINCT urls.id) FILTER (WHERE urls.created_at >= CURRENT_DATE - INTERVAL '30 days') as urls_last_30_days,
  COUNT(DISTINCT c.id) as total_categories,
  COUNT(DISTINCT c.id) FILTER (WHERE c.is_active = true) as active_categories,
  COUNT(DISTINCT c.id) FILTER (WHERE c.is_folder = true AND c.is_active = true) as active_folders,
  COUNT(DISTINCT c.id) FILTER (WHERE c.is_folder = false AND c.is_active = true) as active_categories_only,
  COUNT(DISTINCT g.id) as total_genres,
  COUNT(DISTINCT g.id) FILTER (WHERE g.is_active = true) as active_genres,
  COUNT(DISTINCT t.id) as total_tags,
  COUNT(DISTINCT t.id) FILTER (WHERE t.is_active = true) as active_tags,
  SUM(urls.view_count) as total_views,
  MAX(urls.last_accessed_at) as last_activity_at
FROM users u
LEFT JOIN urls ON u.id = urls.user_id
LEFT JOIN categories c ON u.id = c.user_id
LEFT JOIN genres g ON u.id = g.user_id
LEFT JOIN tags t ON u.id = t.user_id
GROUP BY u.id, u.email, u.name;

-- 人気URLビュー
CREATE OR REPLACE VIEW popular_urls AS
SELECT
  u.id,
  u.user_id,
  u.title,
  u.url,
  u.description,
  u.favicon_url,
  u.thumbnail_url,
  u.view_count,
  u.created_at,
  u.updated_at,
  usr.name as user_name,
  usr.avatar_url as user_avatar_url,
  STRING_AGG(DISTINCT c.name, ',') FILTER (WHERE c.id IS NOT NULL) as categories,
  STRING_AGG(DISTINCT c.path, ',') FILTER (WHERE c.path IS NOT NULL) as category_paths,
  STRING_AGG(DISTINCT g.name, ',') FILTER (WHERE g.id IS NOT NULL) as genres,
  STRING_AGG(DISTINCT t.name, ',') FILTER (WHERE t.id IS NOT NULL) as tags
FROM urls u
JOIN users usr ON u.user_id = usr.id
LEFT JOIN url_categories uc ON u.id = uc.url_id
LEFT JOIN categories c ON uc.category_id = c.id AND c.is_active = true
LEFT JOIN genres g ON uc.genre_id = g.id AND g.is_active = true
LEFT JOIN url_tags ut ON u.id = ut.url_id
LEFT JOIN tags t ON ut.tag_id = t.id AND t.is_active = true
WHERE u.is_public = true
GROUP BY u.id, u.user_id, u.title, u.url, u.description, u.favicon_url, u.thumbnail_url,
         u.view_count, u.created_at, u.updated_at, usr.name, usr.avatar_url
ORDER BY u.view_count DESC, u.created_at DESC;

-- 4. 関数作成
-- ==============================================

-- 多言語検索関数
CREATE OR REPLACE FUNCTION search_text_multilingual(
  search_query TEXT,
  target_column TEXT,
  table_name TEXT,
  user_id_param UUID DEFAULT NULL
) RETURNS TABLE(
  id UUID,
  rank REAL,
  language TEXT
) AS $$
DECLARE
  is_english BOOLEAN;
BEGIN
  is_english := search_query ~ '^[a-zA-Z\s]+$';

  IF is_english THEN
    RETURN QUERY EXECUTE format('
      SELECT
        id,
        ts_rank(to_tsvector(''english'', %I), plainto_tsquery(''english'', $1)) as rank,
        ''english''::TEXT as language
      FROM %I
      WHERE to_tsvector(''english'', %I) @@ plainto_tsquery(''english'', $1)
      %s
      ORDER BY rank DESC
    ', target_column, table_name, target_column,
       CASE WHEN user_id_param IS NOT NULL THEN 'AND user_id = $2' ELSE '' END)
    USING search_query, user_id_param;

  ELSE
    RETURN QUERY EXECUTE format('
      SELECT
        id,
        ts_rank(to_tsvector(''simple'', %I), plainto_tsquery(''simple'', $1)) as rank,
        ''multi''::TEXT as language
      FROM %I
      WHERE to_tsvector(''simple'', %I) @@ plainto_tsquery(''simple'', $1)
      %s
      ORDER BY rank DESC
    ', target_column, table_name, target_column,
       CASE WHEN user_id_param IS NOT NULL THEN 'AND user_id = $2' ELSE '' END)
    USING search_query, user_id_param;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 5. トリガー作成
-- ==============================================

-- updated_at を自動更新する関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルに updated_at トリガーを追加
CREATE TRIGGER trigger_urls_updated_at
    BEFORE UPDATE ON urls
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_genres_updated_at
    BEFORE UPDATE ON genres
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_tags_updated_at
    BEFORE UPDATE ON tags
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_providers_updated_at
    BEFORE UPDATE ON user_providers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. 制約追加
-- ==============================================

-- ジャンルの制約
ALTER TABLE genres ADD CONSTRAINT check_genre_name_length CHECK (LENGTH(TRIM(name)) > 0 AND LENGTH(name) <= 100);
ALTER TABLE genres ADD CONSTRAINT check_genre_description_length CHECK (LENGTH(description) <= 500);
ALTER TABLE genres ADD CONSTRAINT check_genre_color_format CHECK (color ~ '^#[0-9A-Fa-f]{6}$' OR color IS NULL);
ALTER TABLE genres ADD CONSTRAINT check_genre_sort_order CHECK (sort_order >= 0);

-- タグの制約
ALTER TABLE tags ADD CONSTRAINT check_tag_name_length CHECK (LENGTH(TRIM(name)) > 0 AND LENGTH(name) <= 50);
ALTER TABLE tags ADD CONSTRAINT check_tag_color_format CHECK (color ~ '^#[0-9A-Fa-f]{6}$' OR color IS NULL);

-- ユーザーの制約
ALTER TABLE users ADD CONSTRAINT check_user_email_format CHECK (email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
ALTER TABLE users ADD CONSTRAINT check_user_name_length CHECK (LENGTH(TRIM(name)) > 0 AND LENGTH(name) <= 100);

-- URL関連テーブルの制約
ALTER TABLE url_categories ADD CONSTRAINT check_url_category_not_both_null CHECK (category_id IS NOT NULL OR genre_id IS NOT NULL);

-- カテゴリの階層制約
ALTER TABLE categories ADD CONSTRAINT check_category_max_depth CHECK (level <= 10);
ALTER TABLE categories ADD CONSTRAINT check_category_path_format CHECK (path ~ '^/[^/]+(/[^/]+)*$' OR path IS NULL);

-- ユーザープロバイダーの制約
ALTER TABLE user_providers ADD CONSTRAINT check_provider_name CHECK (provider IN ('google', 'github', 'discord', 'twitter'));
ALTER TABLE user_providers ADD CONSTRAINT check_provider_id_length CHECK (LENGTH(provider_id) > 0 AND LENGTH(provider_id) <= 100);

-- 7. 完了メッセージ
-- ==============================================

DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'URL保管アプリ データベース構築が完了しました！';
    RAISE NOTICE '==============================================';
    RAISE NOTICE '作成されたテーブル:';
    RAISE NOTICE '- users (ユーザー)';
    RAISE NOTICE '- user_providers (OAuth認証)';
    RAISE NOTICE '- urls (URL管理)';
    RAISE NOTICE '- categories (カテゴリ・フォルダ)';
    RAISE NOTICE '- genres (ジャンル)';
    RAISE NOTICE '- tags (タグ)';
    RAISE NOTICE '- url_categories (URL-カテゴリ関連) ';
    RAISE NOTICE '- url_tags (URL-タグ関連)';
    RAISE NOTICE '';
    RAISE NOTICE 'データベースの準備が完了しました！';
    RAISE NOTICE '==============================================';
END $$;
