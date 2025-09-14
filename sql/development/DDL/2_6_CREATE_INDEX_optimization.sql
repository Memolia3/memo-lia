-- パフォーマンス最適化のための追加インデックス

-- 複合検索用インデックス（よく使われるクエリパターン）
CREATE INDEX idx_urls_user_public_created ON urls(user_id, is_public, created_at DESC) WHERE is_public = true;
CREATE INDEX idx_urls_user_updated ON urls(user_id, updated_at DESC);
CREATE INDEX idx_urls_user_view_count ON urls(user_id, view_count DESC);

-- カテゴリ階層検索用の最適化インデックス
CREATE INDEX idx_categories_user_level_sort ON categories(user_id, level, sort_order, name);
CREATE INDEX idx_categories_parent_sort ON categories(parent_id, sort_order, name) WHERE parent_id IS NOT NULL;

-- ジャンル検索用の最適化インデックス
CREATE INDEX idx_genres_category_sort ON genres(category_id, sort_order, name);
CREATE INDEX idx_genres_user_category ON genres(user_id, category_id, sort_order);

-- タグ検索用の最適化インデックス
CREATE INDEX idx_tags_user_name ON tags(user_id, name);

-- URL関連テーブルの最適化インデックス
CREATE INDEX idx_url_categories_url_category ON url_categories(url_id, category_id);
CREATE INDEX idx_url_categories_category_url ON url_categories(category_id, url_id);
CREATE INDEX idx_url_tags_url_tag ON url_tags(url_id, tag_id);
CREATE INDEX idx_url_tags_tag_url ON url_tags(tag_id, url_id);

-- 部分インデックス（NULL値を除外）
CREATE INDEX idx_urls_description_not_null ON urls USING gin(to_tsvector('simple', description)) WHERE description IS NOT NULL;
CREATE INDEX idx_categories_description_not_null ON categories USING gin(to_tsvector('simple', description)) WHERE description IS NOT NULL;
CREATE INDEX idx_genres_description_not_null ON genres USING gin(to_tsvector('simple', description)) WHERE description IS NOT NULL;

-- カバリングインデックス（よく使われるクエリのカバリング）
CREATE INDEX idx_urls_covering ON urls(user_id, is_public, created_at DESC) INCLUDE (id, title, url, view_count);
CREATE INDEX idx_categories_covering ON categories(user_id, parent_id, sort_order) INCLUDE (id, name, is_folder, level);

-- 統計情報更新用の関数
CREATE OR REPLACE FUNCTION update_table_statistics()
RETURNS void AS $$
BEGIN
    ANALYZE urls;
    ANALYZE categories;
    ANALYZE genres;
    ANALYZE tags;
    ANALYZE url_categories;
    ANALYZE url_tags;
END;
$$ LANGUAGE plpgsql;
