-- URLs テーブルのインデックス

-- ユーザー別のURL検索用インデックス
CREATE INDEX idx_urls_user_id ON urls(user_id);

-- タイトル検索用インデックス（英語対応）
CREATE INDEX idx_urls_title_en ON urls USING gin(to_tsvector('english', title));

-- タイトル検索用インデックス（多言語対応）
CREATE INDEX idx_urls_title_multi ON urls USING gin(to_tsvector('simple', title));

-- 説明文検索用インデックス（英語対応）
CREATE INDEX idx_urls_description_en ON urls USING gin(to_tsvector('english', description)) WHERE description IS NOT NULL;

-- 説明文検索用インデックス（多言語対応）
CREATE INDEX idx_urls_description_multi ON urls USING gin(to_tsvector('simple', description)) WHERE description IS NOT NULL;

-- 公開URL検索用インデックス
CREATE INDEX idx_urls_is_public ON urls(is_public) WHERE is_public = true;

-- 作成日時順ソート用インデックス
CREATE INDEX idx_urls_created_at ON urls(created_at DESC);

-- 更新日時順ソート用インデックス
CREATE INDEX idx_urls_updated_at ON urls(updated_at DESC);

-- アクセス日時順ソート用インデックス
CREATE INDEX idx_urls_last_accessed_at ON urls(last_accessed_at DESC) WHERE last_accessed_at IS NOT NULL;

-- ビュー数順ソート用インデックス
CREATE INDEX idx_urls_view_count ON urls(view_count DESC);
