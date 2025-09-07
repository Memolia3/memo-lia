-- Genres テーブルのインデックス

-- ユーザー別のジャンル検索用インデックス
CREATE INDEX idx_genres_user_id ON genres(user_id);

-- カテゴリ別のジャンル検索用インデックス
CREATE INDEX idx_genres_category_id ON genres(category_id);

-- アクティブなジャンル検索用インデックス
CREATE INDEX idx_genres_is_active ON genres(is_active) WHERE is_active = true;

-- ソート順用インデックス
CREATE INDEX idx_genres_sort_order ON genres(category_id, sort_order, name);

-- ジャンル名検索用インデックス（英語対応）
CREATE INDEX idx_genres_name_en ON genres USING gin(to_tsvector('english', name));

-- ジャンル名検索用インデックス（多言語対応）
CREATE INDEX idx_genres_name_multi ON genres USING gin(to_tsvector('simple', name));

-- ジャンル説明検索用インデックス（英語対応）
CREATE INDEX idx_genres_description_en ON genres USING gin(to_tsvector('english', description)) WHERE description IS NOT NULL;

-- ジャンル説明検索用インデックス（多言語対応）
CREATE INDEX idx_genres_description_multi ON genres USING gin(to_tsvector('simple', description)) WHERE description IS NOT NULL;
