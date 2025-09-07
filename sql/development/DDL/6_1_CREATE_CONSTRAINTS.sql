-- データ整合性のための制約

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

-- カテゴリの階層制約（追加）
ALTER TABLE categories ADD CONSTRAINT check_category_max_depth CHECK (level <= 10);
ALTER TABLE categories ADD CONSTRAINT check_category_path_format CHECK (path ~ '^/[^/]+(/[^/]+)*$' OR path IS NULL);

-- 外部キー制約の追加（既存のテーブルに）
-- 注意: これらの制約は既存のテーブルに追加する場合、データの整合性を確認してから実行してください

-- ユーザープロバイダーの制約
ALTER TABLE user_providers ADD CONSTRAINT check_provider_name CHECK (provider IN ('google', 'github', 'discord', 'twitter'));
ALTER TABLE user_providers ADD CONSTRAINT check_provider_id_length CHECK (LENGTH(provider_id) > 0 AND LENGTH(provider_id) <= 100);

-- パフォーマンス監視用のビュー
CREATE OR REPLACE VIEW index_usage_stats AS
SELECT
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch,
    CASE
        WHEN idx_tup_read > 0 THEN (idx_tup_fetch::float / idx_tup_read::float) * 100
        ELSE 0
    END as hit_ratio
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_tup_read DESC;

-- テーブルサイズ監視用のビュー
CREATE OR REPLACE VIEW table_size_stats AS
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
