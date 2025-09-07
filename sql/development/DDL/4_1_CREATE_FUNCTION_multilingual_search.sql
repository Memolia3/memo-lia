-- 多言語対応検索関数

-- 言語を自動判定して適切な全文検索を実行する関数
CREATE OR REPLACE FUNCTION search_text_multilingual(
  search_query TEXT,
  target_column TEXT,
  table_name TEXT,
  user_id_param UUID DEFAULT NULL
) RETURNS TABLE(
  id UUID,
  rank REAL,
  language TEXT
) AS $$
DECLARE
  is_english BOOLEAN;
BEGIN
  -- 英語文字の判定
  is_english := search_query ~ '^[a-zA-Z\s]+$';

  -- 検索クエリの構築
  IF is_english THEN
    -- 英語検索
    RETURN QUERY EXECUTE format('
      SELECT
        id,
        ts_rank(to_tsvector(''english'', %I), plainto_tsquery(''english'', $1)) as rank,
        ''english''::TEXT as language
      FROM %I
      WHERE to_tsvector(''english'', %I) @@ plainto_tsquery(''english'', $1)
      %s
      ORDER BY rank DESC
    ', target_column, table_name, target_column,
       CASE WHEN user_id_param IS NOT NULL THEN 'AND user_id = $2' ELSE '' END)
    USING search_query, user_id_param;

  ELSE
    -- 多言語検索（simple）
    RETURN QUERY EXECUTE format('
      SELECT
        id,
        ts_rank(to_tsvector(''simple'', %I), plainto_tsquery(''simple'', $1)) as rank,
        ''multi''::TEXT as language
      FROM %I
      WHERE to_tsvector(''simple'', %I) @@ plainto_tsquery(''simple'', $1)
      %s
      ORDER BY rank DESC
    ', target_column, table_name, target_column,
       CASE WHEN user_id_param IS NOT NULL THEN 'AND user_id = $2' ELSE '' END)
    USING search_query, user_id_param;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- URL検索用の便利な関数
CREATE OR REPLACE FUNCTION search_urls_multilingual(
  search_query TEXT,
  user_id_param UUID DEFAULT NULL
) RETURNS TABLE(
  id UUID,
  user_id UUID,
  title TEXT,
  url TEXT,
  description TEXT,
  rank REAL,
  language TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.user_id,
    u.title,
    u.url,
    u.description,
    stm.rank,
    stm.language
  FROM search_text_multilingual(search_query, 'title', 'urls', user_id_param) stm
  JOIN urls u ON stm.id = u.id
  ORDER BY stm.rank DESC;
END;
$$ LANGUAGE plpgsql;

-- カテゴリ検索用の便利な関数
CREATE OR REPLACE FUNCTION search_categories_multilingual(
  search_query TEXT,
  user_id_param UUID DEFAULT NULL
) RETURNS TABLE(
  id UUID,
  user_id UUID,
  name TEXT,
  description TEXT,
  path TEXT,
  rank REAL,
  language TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.user_id,
    c.name,
    c.description,
    c.path,
    stm.rank,
    stm.language
  FROM search_text_multilingual(search_query, 'name', 'categories', user_id_param) stm
  JOIN categories c ON stm.id = c.id
  WHERE c.is_active = true
  ORDER BY stm.rank DESC;
END;
$$ LANGUAGE plpgsql;

-- ジャンル検索用の便利な関数
CREATE OR REPLACE FUNCTION search_genres_multilingual(
  search_query TEXT,
  user_id_param UUID DEFAULT NULL
) RETURNS TABLE(
  id UUID,
  user_id UUID,
  category_id UUID,
  name TEXT,
  description TEXT,
  rank REAL,
  language TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    g.id,
    g.user_id,
    g.category_id,
    g.name,
    g.description,
    stm.rank,
    stm.language
  FROM search_text_multilingual(search_query, 'name', 'genres', user_id_param) stm
  JOIN genres g ON stm.id = g.id
  WHERE g.is_active = true
  ORDER BY stm.rank DESC;
END;
$$ LANGUAGE plpgsql;

-- タグ検索用の便利な関数
CREATE OR REPLACE FUNCTION search_tags_multilingual(
  search_query TEXT,
  user_id_param UUID DEFAULT NULL
) RETURNS TABLE(
  id UUID,
  user_id UUID,
  name TEXT,
  rank REAL,
  language TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.user_id,
    t.name,
    stm.rank,
    stm.language
  FROM search_text_multilingual(search_query, 'name', 'tags', user_id_param) stm
  JOIN tags t ON stm.id = t.id
  WHERE t.is_active = true
  ORDER BY stm.rank DESC;
END;
$$ LANGUAGE plpgsql;
