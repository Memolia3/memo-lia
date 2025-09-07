-- ジャンルとカテゴリ情報ビュー

CREATE OR REPLACE VIEW genre_with_category AS
SELECT
  g.id,
  g.user_id,
  g.category_id,
  g.name,
  g.description,
  g.color,
  g.icon,
  g.sort_order,
  g.is_active,
  g.created_at,
  g.updated_at,
  -- カテゴリ情報
  c.name as category_name,
  c.path as category_path,
  c.color as category_color,
  c.icon as category_icon,
  c.is_folder as category_is_folder,
  -- 階層パス（カテゴリの階層 + ジャンル名）
  CASE
    WHEN c.path IS NOT NULL THEN c.path || ' > ' || g.name
    ELSE g.name
  END as full_path,
  -- このジャンルに紐づくURL数
  (SELECT COUNT(*) FROM url_categories uc WHERE uc.genre_id = g.id) as url_count
FROM genres g
JOIN categories c ON g.category_id = c.id
WHERE g.is_active = true AND c.is_active = true
ORDER BY g.user_id, c.path, g.sort_order, g.name;
