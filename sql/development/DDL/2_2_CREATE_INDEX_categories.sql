-- Categories テーブルのインデックス

-- ユーザー別のカテゴリ検索用インデックス
CREATE INDEX idx_categories_user_id ON categories(user_id);

-- 親子関係検索用インデックス
CREATE INDEX idx_categories_parent_id ON categories(parent_id) WHERE parent_id IS NOT NULL;

-- 階層レベル検索用インデックス
CREATE INDEX idx_categories_level ON categories(user_id, level, sort_order);

-- フォルダ・カテゴリ別検索用インデックス
CREATE INDEX idx_categories_is_folder ON categories(user_id, is_folder, sort_order);

-- アクティブなカテゴリ検索用インデックス
CREATE INDEX idx_categories_is_active ON categories(is_active) WHERE is_active = true;

-- ソート順用インデックス
CREATE INDEX idx_categories_sort_order ON categories(user_id, parent_id, sort_order, name);

-- カテゴリ名検索用インデックス（英語対応）
CREATE INDEX idx_categories_name_en ON categories USING gin(to_tsvector('english', name));

-- カテゴリ名検索用インデックス（多言語対応）
CREATE INDEX idx_categories_name_multi ON categories USING gin(to_tsvector('simple', name));

-- カテゴリ説明検索用インデックス（英語対応）
CREATE INDEX idx_categories_description_en ON categories USING gin(to_tsvector('english', description)) WHERE description IS NOT NULL;

-- カテゴリ説明検索用インデックス（多言語対応）
CREATE INDEX idx_categories_description_multi ON categories USING gin(to_tsvector('simple', description)) WHERE description IS NOT NULL;
