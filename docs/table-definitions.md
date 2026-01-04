#### categories テーブル

カテゴリマスタを格納するテーブル。階層構造をサポート。

| カラム名    | データ型    | 制約                                             | 説明                     |
| ----------- | ----------- | ------------------------------------------------ | ------------------------ |
| id          | UUID        | NOT NULL, PRIMARY KEY, DEFAULT gen_random_uuid() | カテゴリID               |
| user_id     | UUID        | NOT NULL, FOREIGN KEY (users(id))                | ユーザーID               |
| parent_id   | UUID        | FOREIGN KEY (categories(id))                     | 親カテゴリID             |
| name        | TEXT        | NOT NULL                                         | カテゴリ名（1-100文字）  |
| description | TEXT        |                                                  | 説明（最大500文字）      |
| color       | TEXT        |                                                  | 色（#RRGGBB形式）        |
| icon        | TEXT        |                                                  | アイコン名（最大50文字） |
| sort_order  | INTEGER     | DEFAULT 0                                        | 並び順（0以上）          |
| level       | INTEGER     | DEFAULT 0                                        | 階層レベル（0-10）       |
| path        | TEXT        |                                                  | 階層パス（最大1000文字） |
| is_active   | BOOLEAN     | DEFAULT true                                     | 有効フラグ               |
| is_folder   | BOOLEAN     | DEFAULT false                                    | フォルダフラグ           |
| created_at  | TIMESTAMPTZ | DEFAULT now()                                    | 作成日時                 |
| updated_at  | TIMESTAMPTZ | DEFAULT now()                                    | 更新日時                 |

---

#### genres テーブル

ジャンルマスタを格納するテーブル。カテゴリに紐付けられる。

| カラム名    | データ型    | 制約                                             | 説明                     |
| ----------- | ----------- | ------------------------------------------------ | ------------------------ |
| id          | UUID        | NOT NULL, PRIMARY KEY, DEFAULT gen_random_uuid() | ジャンルID               |
| user_id     | UUID        | NOT NULL, FOREIGN KEY (users(id))                | ユーザーID               |
| category_id | UUID        | NOT NULL, FOREIGN KEY (categories(id))           | カテゴリID               |
| name        | TEXT        | NOT NULL                                         | ジャンル名（1-100文字）  |
| description | TEXT        |                                                  | 説明（最大500文字）      |
| color       | TEXT        |                                                  | 色（#RRGGBB形式）        |
| icon        | TEXT        |                                                  | アイコン名（最大50文字） |
| sort_order  | INTEGER     | DEFAULT 0                                        | 並び順（0以上）          |
| is_active   | BOOLEAN     | DEFAULT true                                     | 有効フラグ               |
| created_at  | TIMESTAMPTZ | DEFAULT now()                                    | 作成日時                 |
| updated_at  | TIMESTAMPTZ | DEFAULT now()                                    | 更新日時                 |

---

#### tags テーブル

タグマスタを格納するテーブル。現在はデータベースにテーブルは存在するが、アプリケーション側での実装は未対応。

| カラム名   | データ型    | 制約                                             | 説明                |
| ---------- | ----------- | ------------------------------------------------ | ------------------- |
| id         | UUID        | NOT NULL, PRIMARY KEY, DEFAULT gen_random_uuid() | タグID              |
| user_id    | UUID        | NOT NULL, FOREIGN KEY (users(id))                | ユーザーID          |
| name       | TEXT        | NOT NULL                                         | タグ名（1-100文字） |
| color      | TEXT        |                                                  | 色（#RRGGBB形式）   |
| is_active  | BOOLEAN     | DEFAULT true                                     | 有効フラグ          |
| created_at | TIMESTAMPTZ | DEFAULT now()                                    | 作成日時            |
| updated_at | TIMESTAMPTZ | DEFAULT now()                                    | 更新日時            |

---

#### url_categories テーブル

URLとカテゴリ・ジャンルの関連を格納するテーブル。

| カラム名    | データ型    | 制約                                             | 説明       |
| ----------- | ----------- | ------------------------------------------------ | ---------- |
| id          | UUID        | NOT NULL, PRIMARY KEY, DEFAULT gen_random_uuid() | 関連ID     |
| url_id      | UUID        | NOT NULL, FOREIGN KEY (urls(id)), UNIQUE         | URL ID     |
| category_id | UUID        | NOT NULL, FOREIGN KEY (categories(id)), UNIQUE   | カテゴリID |
| genre_id    | UUID        | FOREIGN KEY (genres(id)), UNIQUE                 | ジャンルID |
| user_id     | UUID        | NOT NULL, FOREIGN KEY (users(id))                | （説明）   |
| created_at  | TIMESTAMPTZ | DEFAULT now()                                    | 作成日時   |

---

#### url_tags テーブル

URLとタグの多対多関係を格納するテーブル。現在はデータベースにテーブルは存在するが、アプリケーション側での実装は未対応。

| カラム名   | データ型    | 制約                                             | 説明     |
| ---------- | ----------- | ------------------------------------------------ | -------- |
| id         | UUID        | NOT NULL, PRIMARY KEY, DEFAULT gen_random_uuid() | 関連ID   |
| url_id     | UUID        | NOT NULL, FOREIGN KEY (urls(id)), UNIQUE         | URL ID   |
| tag_id     | UUID        | NOT NULL, FOREIGN KEY (tags(id)), UNIQUE         | タグID   |
| created_at | TIMESTAMPTZ | DEFAULT now()                                    | 作成日時 |

---

#### urls テーブル

URLの基本情報を格納するテーブル。

| カラム名         | データ型    | 制約                                             | 説明                  |
| ---------------- | ----------- | ------------------------------------------------ | --------------------- |
| id               | UUID        | NOT NULL, PRIMARY KEY, DEFAULT gen_random_uuid() | URL ID                |
| user_id          | UUID        | NOT NULL, FOREIGN KEY (users(id))                | ユーザーID            |
| title            | TEXT        | NOT NULL                                         | タイトル（1文字以上） |
| url              | TEXT        | NOT NULL                                         | URL（正規表現で検証） |
| description      | TEXT        |                                                  | 説明（最大1000文字）  |
| favicon_url      | TEXT        |                                                  | ファビコンURL         |
| thumbnail_url    | TEXT        |                                                  | サムネイル画像URL     |
| is_public        | BOOLEAN     | DEFAULT false                                    | 公開設定              |
| view_count       | INTEGER     | DEFAULT 0                                        | 閲覧回数（0以上）     |
| created_at       | TIMESTAMPTZ | DEFAULT now()                                    | 作成日時              |
| updated_at       | TIMESTAMPTZ | DEFAULT now()                                    | 更新日時              |
| last_accessed_at | TIMESTAMPTZ |                                                  | 最終アクセス日時      |

---

#### user_providers テーブル

OAuthプロバイダー情報を格納するテーブル。

| カラム名      | データ型    | 制約                                             | 説明                                     |
| ------------- | ----------- | ------------------------------------------------ | ---------------------------------------- |
| id            | UUID        | NOT NULL, PRIMARY KEY, DEFAULT gen_random_uuid() | プロバイダーID                           |
| user_id       | UUID        | NOT NULL, FOREIGN KEY (users(id))                | ユーザーID                               |
| provider      | TEXT        | NOT NULL, UNIQUE                                 | プロバイダー名 (google, github, discord) |
| provider_id   | TEXT        | NOT NULL, UNIQUE                                 | プロバイダー側のユーザーID               |
| access_token  | TEXT        |                                                  | アクセストークン                         |
| refresh_token | TEXT        |                                                  | リフレッシュトークン                     |
| expires_at    | TIMESTAMPTZ |                                                  | トークン有効期限                         |
| created_at    | TIMESTAMPTZ | DEFAULT now()                                    | 作成日時                                 |
| updated_at    | TIMESTAMPTZ | DEFAULT now()                                    | 更新日時                                 |

---

#### users テーブル

ユーザーの基本情報を格納するテーブル。

| カラム名   | データ型    | 制約                                             | 説明            |
| ---------- | ----------- | ------------------------------------------------ | --------------- |
| id         | UUID        | NOT NULL, PRIMARY KEY, DEFAULT gen_random_uuid() | ユーザーID      |
| email      | TEXT        | NOT NULL, UNIQUE                                 | メールアドレス  |
| name       | TEXT        |                                                  | ユーザー名      |
| avatar_url | TEXT        |                                                  | アバター画像URL |
| created_at | TIMESTAMPTZ | DEFAULT now()                                    | 作成日時        |
| updated_at | TIMESTAMPTZ | DEFAULT now()                                    | 更新日時        |

---
