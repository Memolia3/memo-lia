DROP TABLE IF EXISTS url_categories;

CREATE TABLE url_categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id        UUID NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
  category_id   UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  genre_id      UUID REFERENCES genres(id) ON DELETE CASCADE, -- ジャンルも一緒に管理
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE (url_id, category_id, genre_id)
);
