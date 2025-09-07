-- カテゴリ階層ビュー（フォルダ構造表示用）

CREATE OR REPLACE VIEW category_hierarchy AS
WITH RECURSIVE category_tree AS (
  -- ルートカテゴリ（親がないカテゴリ）
  SELECT
    id,
    user_id,
    parent_id,
    name,
    description,
    color,
    icon,
    sort_order,
    level,
    path,
    is_active,
    is_folder,
    created_at,
    updated_at,
    name as full_path,
    ARRAY[id] as path_ids,
    0 as depth
  FROM categories
  WHERE parent_id IS NULL AND is_active = true

  UNION ALL

  -- 子カテゴリ
  SELECT
    c.id,
    c.user_id,
    c.parent_id,
    c.name,
    c.description,
    c.color,
    c.icon,
    c.sort_order,
    c.level,
    c.path,
    c.is_active,
    c.is_folder,
    c.created_at,
    c.updated_at,
    ct.full_path || ' > ' || c.name as full_path,
    ct.path_ids || c.id as path_ids,
    ct.depth + 1 as depth
  FROM categories c
  JOIN category_tree ct ON c.parent_id = ct.id
  WHERE c.is_active = true
)
SELECT
  id,
  user_id,
  parent_id,
  name,
  description,
  color,
  icon,
  sort_order,
  level,
  path,
  is_active,
  is_folder,
  created_at,
  updated_at,
  full_path,
  path_ids,
  depth,
  -- 子カテゴリ数
  (SELECT COUNT(*) FROM categories WHERE parent_id = ct.id AND is_active = true) as child_count,
  -- 直接のURL数（カテゴリのみ、フォルダは除く）
  (SELECT COUNT(*) FROM url_categories uc WHERE uc.category_id = ct.id AND ct.is_folder = false) as direct_url_count,
  -- 階層内の全URL数（子カテゴリ含む）
  (SELECT COUNT(DISTINCT uc.url_id)
   FROM url_categories uc
   JOIN categories c ON uc.category_id = c.id
   WHERE c.id = ANY(ct.path_ids) AND c.is_folder = false) as total_url_count
FROM category_tree ct
ORDER BY user_id, path_ids;
