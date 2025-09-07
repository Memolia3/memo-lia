-- 関連テーブルのインデックス

-- URL-Category-Genre 関連のインデックス
CREATE INDEX idx_url_categories_url_id ON url_categories(url_id);
CREATE INDEX idx_url_categories_category_id ON url_categories(category_id);
CREATE INDEX idx_url_categories_genre_id ON url_categories(genre_id) WHERE genre_id IS NOT NULL;

-- URL-Tag 関連のインデックス
CREATE INDEX idx_url_tags_url_id ON url_tags(url_id);
CREATE INDEX idx_url_tags_tag_id ON url_tags(tag_id);
