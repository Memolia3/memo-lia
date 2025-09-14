-- 多言語対応検索ビュー

-- 統合検索ビュー（URL、カテゴリ、ジャンル、タグを横断検索）
CREATE OR REPLACE VIEW multilingual_search_results AS
WITH search_union AS (
  -- URL検索結果
  SELECT
    'url' as result_type,
    u.id,
    u.user_id,
    u.title as name,
    u.description,
    u.url as target_url,
    NULL::UUID as category_id,
    NULL::TEXT as category_name,
    NULL::TEXT as path,
    u.created_at,
    u.updated_at,
    'URL' as type_label
  FROM urls u

  UNION ALL

  -- カテゴリ検索結果
  SELECT
    'category' as result_type,
    c.id,
    c.user_id,
    c.name,
    c.description,
    NULL as target_url,
    c.id as category_id,
    c.name as category_name,
    c.path,
    c.created_at,
    c.updated_at,
    CASE WHEN c.is_folder THEN 'フォルダ' ELSE 'カテゴリ' END as type_label
  FROM categories c
  WHERE c.is_active = true

  UNION ALL

  -- ジャンル検索結果
  SELECT
    'genre' as result_type,
    g.id,
    g.user_id,
    g.name,
    g.description,
    NULL as target_url,
    g.category_id,
    c.name as category_name,
    c.path,
    g.created_at,
    g.updated_at,
    'ジャンル' as type_label
  FROM genres g
  JOIN categories c ON g.category_id = c.id
  WHERE g.is_active = true AND c.is_active = true

  UNION ALL

  -- タグ検索結果
  SELECT
    'tag' as result_type,
    t.id,
    t.user_id,
    t.name,
    NULL as description,
    NULL as target_url,
    NULL::UUID as category_id,
    NULL::TEXT as category_name,
    NULL::TEXT as path,
    t.created_at,
    t.updated_at,
    'タグ' as type_label
  FROM tags t
  WHERE t.is_active = true
)
SELECT
  result_type,
  id,
  user_id,
  name,
  description,
  target_url,
  category_id,
  category_name,
  path,
  created_at,
  updated_at,
  type_label,
  -- 検索用の統合テキスト
  COALESCE(name, '') || ' ' || COALESCE(description, '') as search_text
FROM search_union;

-- 言語別統計ビュー
CREATE OR REPLACE VIEW language_statistics AS
SELECT
  u.id as user_id,
  u.name as user_name,
  -- 多言語コンテンツ数（日本語文字を含む）
  (SELECT COUNT(*) FROM urls WHERE user_id = u.id AND title ~ '[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]') as multilingual_urls,
  (SELECT COUNT(*) FROM categories WHERE user_id = u.id AND name ~ '[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]') as multilingual_categories,
  (SELECT COUNT(*) FROM genres WHERE user_id = u.id AND name ~ '[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]') as multilingual_genres,
  (SELECT COUNT(*) FROM tags WHERE user_id = u.id AND name ~ '[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]') as multilingual_tags,
  -- 英語コンテンツ数
  (SELECT COUNT(*) FROM urls WHERE user_id = u.id AND title ~ '^[a-zA-Z\s]+$') as english_urls,
  (SELECT COUNT(*) FROM categories WHERE user_id = u.id AND name ~ '^[a-zA-Z\s]+$') as english_categories,
  (SELECT COUNT(*) FROM genres WHERE user_id = u.id AND name ~ '^[a-zA-Z\s]+$') as english_genres,
  (SELECT COUNT(*) FROM tags WHERE user_id = u.id AND name ~ '^[a-zA-Z\s]+$') as english_tags,
  -- その他の言語コンテンツ数
  (SELECT COUNT(*) FROM urls WHERE user_id = u.id AND title ~ '[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAFa-zA-Z\s]') as other_language_urls,
  (SELECT COUNT(*) FROM categories WHERE user_id = u.id AND name ~ '[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAFa-zA-Z\s]') as other_language_categories,
  (SELECT COUNT(*) FROM genres WHERE user_id = u.id AND name ~ '[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAFa-zA-Z\s]') as other_language_genres,
  (SELECT COUNT(*) FROM tags WHERE user_id = u.id AND name ~ '[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAFa-zA-Z\s]') as other_language_tags
FROM users u;
