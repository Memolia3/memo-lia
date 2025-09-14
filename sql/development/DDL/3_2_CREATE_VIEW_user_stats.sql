-- ユーザー統計ビュー

CREATE OR REPLACE VIEW user_stats AS
SELECT
  u.id as user_id,
  u.email,
  u.name,
  -- URL統計
  COUNT(DISTINCT urls.id) as total_urls,
  COUNT(DISTINCT urls.id) FILTER (WHERE urls.is_public = true) as public_urls,
  COUNT(DISTINCT urls.id) FILTER (WHERE urls.created_at >= CURRENT_DATE - INTERVAL '30 days') as urls_last_30_days,
  -- カテゴリ統計（フォルダとカテゴリを分離）
  COUNT(DISTINCT c.id) as total_categories,
  COUNT(DISTINCT c.id) FILTER (WHERE c.is_active = true) as active_categories,
  COUNT(DISTINCT c.id) FILTER (WHERE c.is_folder = true AND c.is_active = true) as active_folders,
  COUNT(DISTINCT c.id) FILTER (WHERE c.is_folder = false AND c.is_active = true) as active_categories_only,
  -- ジャンル統計
  COUNT(DISTINCT g.id) as total_genres,
  COUNT(DISTINCT g.id) FILTER (WHERE g.is_active = true) as active_genres,
  -- タグ統計
  COUNT(DISTINCT t.id) as total_tags,
  COUNT(DISTINCT t.id) FILTER (WHERE t.is_active = true) as active_tags,
  -- アクセス統計
  SUM(urls.view_count) as total_views,
  MAX(urls.last_accessed_at) as last_activity_at
FROM users u
LEFT JOIN urls ON u.id = urls.user_id
LEFT JOIN categories c ON u.id = c.user_id
LEFT JOIN genres g ON u.id = g.user_id
LEFT JOIN tags t ON u.id = t.user_id
GROUP BY u.id, u.email, u.name;
