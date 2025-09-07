DROP TABLE IF EXISTS urls;

CREATE TABLE urls (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL CHECK (LENGTH(TRIM(title)) > 0),
  url           TEXT NOT NULL CHECK (url ~ '^https?://[^\s/$.?#].[^\s]*$'),
  description   TEXT CHECK (LENGTH(description) <= 1000),
  favicon_url   TEXT CHECK (favicon_url ~ '^https?://[^\s/$.?#].[^\s]*$' OR favicon_url IS NULL),
  thumbnail_url TEXT CHECK (thumbnail_url ~ '^https?://[^\s/$.?#].[^\s]*$' OR thumbnail_url IS NULL),
  is_public     BOOLEAN DEFAULT false,
  view_count    INTEGER DEFAULT 0 CHECK (view_count >= 0),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  last_accessed_at TIMESTAMPTZ
);

-- URLの一意性制約（ユーザーごと）
CREATE UNIQUE INDEX idx_urls_user_url ON urls(user_id, url);
