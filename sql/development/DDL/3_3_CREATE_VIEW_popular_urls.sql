-- 人気URLビュー（公開URLのみ）

CREATE OR REPLACE VIEW popular_urls AS
SELECT
  u.id,
  u.user_id,
  u.title,
  u.url,
  u.description,
  u.favicon_url,
  u.thumbnail_url,
  u.view_count,
  u.created_at,
  u.updated_at,
  -- ユーザー情報
  usr.name as user_name,
  usr.avatar_url as user_avatar_url,
  -- カテゴリ情報
  STRING_AGG(DISTINCT c.name, ',') FILTER (WHERE c.id IS NOT NULL) as categories,
  STRING_AGG(DISTINCT c.path, ',') FILTER (WHERE c.path IS NOT NULL) as category_paths,
  -- ジャンル情報
  STRING_AGG(DISTINCT g.name, ',') FILTER (WHERE g.id IS NOT NULL) as genres,
  -- タグ情報
  STRING_AGG(DISTINCT t.name, ',') FILTER (WHERE t.id IS NOT NULL) as tags
FROM urls u
JOIN users usr ON u.user_id = usr.id
LEFT JOIN url_categories uc ON u.id = uc.url_id
LEFT JOIN categories c ON uc.category_id = c.id AND c.is_active = true
LEFT JOIN genres g ON uc.genre_id = g.id AND g.is_active = true
LEFT JOIN url_tags ut ON u.id = ut.url_id
LEFT JOIN tags t ON ut.tag_id = t.id AND t.is_active = true
WHERE u.is_public = true
GROUP BY u.id, u.user_id, u.title, u.url, u.description, u.favicon_url, u.thumbnail_url,
         u.view_count, u.created_at, u.updated_at, usr.name, usr.avatar_url
ORDER BY u.view_count DESC, u.created_at DESC;
