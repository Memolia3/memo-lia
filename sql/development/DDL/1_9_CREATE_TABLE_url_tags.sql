DROP TABLE IF EXISTS url_tags;

CREATE TABLE url_tags (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id        UUID NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
  tag_id        UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE (url_id, tag_id)
);
