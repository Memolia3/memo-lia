DROP TABLE IF EXISTS genres;

CREATE TABLE genres (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id   UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE, -- カテゴリに紐づけ
  name          TEXT NOT NULL,
  description   TEXT,
  color         TEXT, -- ジャンルの色（HEXカラーコード）
  icon          TEXT, -- ジャンルのアイコン
  sort_order    INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- カテゴリごとのジャンル名の一意性制約
CREATE UNIQUE INDEX idx_genres_category_name ON genres(category_id, name) WHERE is_active = true;
