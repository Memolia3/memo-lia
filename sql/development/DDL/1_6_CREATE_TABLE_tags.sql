DROP TABLE IF EXISTS tags;

CREATE TABLE tags (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  color         TEXT, -- タグの色（HEXカラーコード）
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ユーザーごとのタグ名の一意性制約
CREATE UNIQUE INDEX idx_tags_user_name ON tags(user_id, name) WHERE is_active = true;
