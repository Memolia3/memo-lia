-- 自動更新トリガー

-- updated_at を自動更新する関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルに updated_at トリガーを追加
CREATE TRIGGER trigger_urls_updated_at
    BEFORE UPDATE ON urls
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_genres_updated_at
    BEFORE UPDATE ON genres
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_tags_updated_at
    BEFORE UPDATE ON tags
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_providers_updated_at
    BEFORE UPDATE ON user_providers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- カテゴリの階層パスを自動更新する関数
CREATE OR REPLACE FUNCTION update_category_path()
RETURNS TRIGGER AS $$
DECLARE
    parent_path TEXT;
    new_path TEXT;
BEGIN
    -- 親カテゴリのパスを取得
    IF NEW.parent_id IS NOT NULL THEN
        SELECT path INTO parent_path FROM categories WHERE id = NEW.parent_id;
        IF parent_path IS NOT NULL THEN
            new_path := parent_path || '/' || NEW.name;
        ELSE
            new_path := '/' || NEW.name;
        END IF;
    ELSE
        new_path := '/' || NEW.name;
    END IF;

    NEW.path := new_path;
    NEW.level := COALESCE((SELECT level + 1 FROM categories WHERE id = NEW.parent_id), 0);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- カテゴリのパス更新トリガー
CREATE TRIGGER trigger_categories_path_update
    BEFORE INSERT OR UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_category_path();

-- URLのアクセス時に last_accessed_at を更新する関数
CREATE OR REPLACE FUNCTION update_url_access_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_accessed_at = now();
    NEW.view_count = OLD.view_count + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- URLアクセス更新トリガー（アプリケーション側で呼び出し）
-- CREATE TRIGGER trigger_urls_access_update
--     BEFORE UPDATE OF view_count ON urls
--     FOR EACH ROW
--     WHEN (NEW.view_count > OLD.view_count)
--     EXECUTE FUNCTION update_url_access_time();

-- 循環参照を防ぐ関数
CREATE OR REPLACE FUNCTION check_category_cycle()
RETURNS TRIGGER AS $$
DECLARE
    current_id UUID;
    parent_id UUID;
    depth INTEGER := 0;
BEGIN
    current_id := NEW.parent_id;

    WHILE current_id IS NOT NULL AND depth < 10 LOOP
        IF current_id = NEW.id THEN
            RAISE EXCEPTION 'Circular reference detected in category hierarchy';
        END IF;

        SELECT parent_id INTO parent_id FROM categories WHERE id = current_id;
        current_id := parent_id;
        depth := depth + 1;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 循環参照チェックトリガー
CREATE TRIGGER trigger_categories_cycle_check
    BEFORE INSERT OR UPDATE ON categories
    FOR EACH ROW
    WHEN (NEW.parent_id IS NOT NULL)
    EXECUTE FUNCTION check_category_cycle();
