-- Tags テーブルのインデックス

-- ユーザー別のタグ検索用インデックス
CREATE INDEX idx_tags_user_id ON tags(user_id);

-- アクティブなタグ検索用インデックス
CREATE INDEX idx_tags_is_active ON tags(is_active) WHERE is_active = true;

-- タグ名検索用インデックス（英語対応）
CREATE INDEX idx_tags_name_en ON tags USING gin(to_tsvector('english', name));

-- タグ名検索用インデックス（多言語対応）
CREATE INDEX idx_tags_name_multi ON tags USING gin(to_tsvector('simple', name));
