-- URL保管アプリ データベース構築スクリプト
-- すべてのDDLファイルを順序通りに実行します

-- ==============================================
-- 1. テーブル作成
-- ==============================================

-- ユーザーテーブル
\i sql/development/DDL/1_1_CREATE_TABLE_user.sql

-- ユーザープロバイダーテーブル
\i sql/development/DDL/1_2_CREATE_TABLE_user_providers.sql

-- URLテーブル
\i sql/development/DDL/1_3_CREATE_TABLE_urls.sql

-- カテゴリテーブル（階層化対応）
\i sql/development/DDL/1_4_CREATE_TABLE_categories.sql

-- ジャンルテーブル（カテゴリに紐づけ）
\i sql/development/DDL/1_5_CREATE_TABLE_genres.sql

-- タグテーブル
\i sql/development/DDL/1_6_CREATE_TABLE_tags.sql

-- URL-カテゴリ関連テーブル
\i sql/development/DDL/1_7_CREATE_TABLE_url_categories.sql

-- URL-タグ関連テーブル
\i sql/development/DDL/1_9_CREATE_TABLE_url_tags.sql

-- ==============================================
-- 2. インデックス作成
-- ==============================================

-- URLインデックス
\i sql/development/DDL/2_1_CREATE_INDEX_urls.sql

-- カテゴリインデックス
\i sql/development/DDL/2_2_CREATE_INDEX_categories.sql

-- ジャンルインデックス
\i sql/development/DDL/2_3_CREATE_INDEX_genres.sql

-- タグインデックス
\i sql/development/DDL/2_4_CREATE_INDEX_tags.sql

-- 関連テーブルインデックス
\i sql/development/DDL/2_5_CREATE_INDEX_relations.sql

-- パフォーマンス最適化インデックス
\i sql/development/DDL/2_6_CREATE_INDEX_optimization.sql

-- ==============================================
-- 3. ビュー作成
-- ==============================================

-- URL詳細ビュー
\i sql/development/DDL/3_1_CREATE_VIEW_url_details.sql

-- ユーザー統計ビュー
\i sql/development/DDL/3_2_CREATE_VIEW_user_stats.sql

-- 人気URLビュー
\i sql/development/DDL/3_3_CREATE_VIEW_popular_urls.sql

-- カテゴリ階層ビュー
\i sql/development/DDL/3_4_CREATE_VIEW_category_hierarchy.sql

-- ジャンル-カテゴリ統合ビュー
\i sql/development/DDL/3_5_CREATE_VIEW_genre_with_category.sql

-- 多言語検索ビュー
\i sql/development/DDL/3_6_CREATE_VIEW_multilingual_search.sql

-- ==============================================
-- 4. 関数作成
-- ==============================================

-- 多言語検索関数
\i sql/development/DDL/4_1_CREATE_FUNCTION_multilingual_search.sql

-- ==============================================
-- 5. トリガー作成
-- ==============================================

-- 自動更新トリガー
\i sql/development/DDL/5_1_CREATE_TRIGGERS.sql

-- ==============================================
-- 6. 制約追加
-- ==============================================

-- データ整合性制約
\i sql/development/DDL/6_1_CREATE_CONSTRAINTS.sql

-- ==============================================
-- 7. 統計情報更新
-- ==============================================

-- テーブル統計情報の更新
SELECT update_table_statistics();

-- ==============================================
-- 8. 実行完了メッセージ
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
    RAISE NOTICE '作成されたビュー:';
    RAISE NOTICE '- url_details (URL詳細)';
    RAISE NOTICE '- user_stats (ユーザー統計)';
    RAISE NOTICE '- popular_urls (人気URL)';
    RAISE NOTICE '- category_hierarchy (カテゴリ階層)';
    RAISE NOTICE '- genre_with_category (ジャンル-カテゴリ)';
    RAISE NOTICE '- multilingual_search_results (多言語検索)';
    RAISE NOTICE '- language_statistics (言語統計)';
    RAISE NOTICE '';
    RAISE NOTICE '作成された関数:';
    RAISE NOTICE '- search_text_multilingual (多言語検索)';
    RAISE NOTICE '- search_urls_multilingual (URL検索)';
    RAISE NOTICE '- search_categories_multilingual (カテゴリ検索)';
    RAISE NOTICE '- search_genres_multilingual (ジャンル検索)';
    RAISE NOTICE '- search_tags_multilingual (タグ検索)';
    RAISE NOTICE '';
    RAISE NOTICE 'データベースの準備が完了しました！';
    RAISE NOTICE '';
    RAISE NOTICE '📋 既存データベースの場合:';
    RAISE NOTICE 'psql -f sql/development/EXECUTE_MIGRATION_001.sql';
    RAISE NOTICE '==============================================';
END $$;
