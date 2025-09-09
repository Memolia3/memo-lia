-- 関連テーブルのインデックス

-- URL-Category-Genre 関連のインデックス
CREATE INDEX idx_url_categories_url_id ON url_categories(url_id);
CREATE INDEX idx_url_categories_category_id ON url_categories(category_id);
CREATE INDEX idx_url_categories_genre_id ON url_categories(genre_id) WHERE genre_id IS NOT NULL;
CREATE INDEX idx_url_categories_user_id ON url_categories(user_id);

-- ユーザー別アクセス用の複合インデックス
CREATE INDEX idx_url_categories_user_genre ON url_categories(user_id, genre_id) WHERE genre_id IS NOT NULL;
CREATE INDEX idx_url_categories_user_category ON url_categories(user_id, category_id);

-- URL-Tag 関連のインデックス
CREATE INDEX idx_url_tags_url_id ON url_tags(url_id);
CREATE INDEX idx_url_tags_tag_id ON url_tags(tag_id);
