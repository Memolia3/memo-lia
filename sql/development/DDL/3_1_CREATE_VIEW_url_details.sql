-- URL詳細ビュー（カテゴリ、ジャンル、タグを含む）

CREATE OR REPLACE VIEW url_details AS
SELECT
  u.id,
  u.user_id,
  u.title,
  u.url,
  u.description,
  u.favicon_url,
  u.thumbnail_url,
  u.is_public,
  u.view_count,
  u.created_at,
  u.updated_at,
  u.last_accessed_at,
  -- カテゴリ情報（カンマ区切り）
  STRING_AGG(DISTINCT c.name, ',') FILTER (WHERE c.id IS NOT NULL) as categories,
  STRING_AGG(DISTINCT c.color, ',') FILTER (WHERE c.color IS NOT NULL) as category_colors,
  STRING_AGG(DISTINCT c.path, ',') FILTER (WHERE c.path IS NOT NULL) as category_paths,
  -- ジャンル情報（カンマ区切り）
  STRING_AGG(DISTINCT g.name, ',') FILTER (WHERE g.id IS NOT NULL) as genres,
  STRING_AGG(DISTINCT g.color, ',') FILTER (WHERE g.color IS NOT NULL) as genre_colors,
  -- タグ情報（カンマ区切り）
  STRING_AGG(DISTINCT t.name, ',') FILTER (WHERE t.id IS NOT NULL) as tags,
  STRING_AGG(DISTINCT t.color, ',') FILTER (WHERE t.color IS NOT NULL) as tag_colors
FROM urls u
LEFT JOIN url_categories uc ON u.id = uc.url_id
LEFT JOIN categories c ON uc.category_id = c.id AND c.is_active = true
LEFT JOIN genres g ON uc.genre_id = g.id AND g.is_active = true
LEFT JOIN url_tags ut ON u.id = ut.url_id
LEFT JOIN tags t ON ut.tag_id = t.id AND t.is_active = true
GROUP BY u.id, u.user_id, u.title, u.url, u.description, u.favicon_url, u.thumbnail_url,
         u.is_public, u.view_count, u.created_at, u.updated_at, u.last_accessed_at;
