DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id     UUID REFERENCES categories(id) ON DELETE CASCADE, -- 親カテゴリID（階層化）
  name          TEXT NOT NULL CHECK (LENGTH(TRIM(name)) > 0 AND LENGTH(name) <= 100),
  description   TEXT CHECK (LENGTH(description) <= 500),
  color         TEXT CHECK (color ~ '^#[0-9A-Fa-f]{6}$' OR color IS NULL), -- HEXカラーコード
  icon          TEXT CHECK (LENGTH(icon) <= 50),
  sort_order    INTEGER DEFAULT 0 CHECK (sort_order >= 0),
  level         INTEGER DEFAULT 0 CHECK (level >= 0 AND level <= 10), -- 最大10階層
  path          TEXT CHECK (LENGTH(path) <= 1000),
  is_active     BOOLEAN DEFAULT true,
  is_folder     BOOLEAN DEFAULT false, -- フォルダかどうか（true=フォルダ、false=カテゴリ）
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  -- 自己参照制約（循環参照を防ぐ）
  CONSTRAINT check_no_self_reference CHECK (id != parent_id)
);

-- ユーザーごとのカテゴリ名の一意性制約（同一階層内）
CREATE UNIQUE INDEX idx_categories_user_parent_name ON categories(user_id, parent_id, name) WHERE is_active = true;

-- 階層パス用インデックス
CREATE INDEX idx_categories_path ON categories(user_id, path) WHERE is_active = true;
