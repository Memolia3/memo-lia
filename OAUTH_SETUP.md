# OAuth認証設定ガイド

このアプリケーションでOAuth認証を有効にするための設定手順です。

## 必要な環境変数

以下の環境変数を`.env.local`ファイルに設定してください：

```bash
# NextAuth.js基本設定
NEXTAUTH_URL=http://localhost:13000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth設定
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth設定
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Discord OAuth設定
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret

# データベース設定
DATABASE_URL=your-neon-database-url
```

## OAuthプロバイダーの設定

### 1. Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. プロジェクトを作成または選択
3. 「APIとサービス」→「認証情報」に移動
4. 「認証情報を作成」→「OAuth 2.0クライアントID」を選択
5. アプリケーションの種類を「ウェブアプリケーション」に設定
6. 承認済みのリダイレクトURIに以下を追加：
   - `http://localhost:13000/api/auth/callback/google`
   - `http://localhost:13000/auth/callback/google`
7. クライアントIDとクライアントシークレットを取得

### 2. GitHub OAuth

1. [GitHub Developer Settings](https://github.com/settings/developers)にアクセス
2. 「OAuth Apps」→「New OAuth App」をクリック
3. アプリケーション情報を入力：
   - Application name: MemoLia
   - Homepage URL: `http://localhost:13000`
   - Authorization callback URL:
     `http://localhost:13000/api/auth/callback/github`
4. クライアントIDとクライアントシークレットを取得

### 3. Discord OAuth

1. [Discord Developer Portal](https://discord.com/developers/applications)にアクセス
2. 「New Application」をクリック
3. アプリケーション名を入力
4. 「OAuth2」→「General」に移動
5. リダイレクトURIに以下を追加：
   - `http://localhost:13000/api/auth/callback/discord`
6. クライアントIDとクライアントシークレットを取得

## データベースの設定

1. Neonデータベースに接続
2. `sql/development/DDL/`フォルダ内のSQLファイルを実行：
   - `1_1_CREATE_TABLE_user.sql`
   - `1_2_CREATE_TABLE_user_providers.sql`

## アプリケーションの起動

1. 環境変数を設定
2. 依存関係をインストール：
   ```bash
   yarn install
   ```
3. 開発サーバーを起動：
   ```bash
   yarn dev
   ```
4. ブラウザで`http://localhost:13000/auth`にアクセス

## 認証フロー

1. ユーザーが認証ページ（`/auth`）にアクセス
2. OAuthプロバイダーボタンをクリック
3. プロバイダーの認証ページにリダイレクト
4. 認証成功後、アプリケーションに戻る
5. ユーザー情報がデータベースに保存される
6. セッションが開始される

## セキュリティのベストプラクティス

- 環境変数は`.env.local`に保存し、Gitにコミットしない
- 本番環境では適切なシークレットキーを使用
- HTTPSを使用して通信を暗号化
- 定期的にOAuthトークンを更新

## トラブルシューティング

### よくある問題

1. **認証エラー**: 環境変数が正しく設定されているか確認
2. **リダイレクトエラー**: 承認済みリダイレクトURIが正しく設定されているか確認
3. **データベースエラー**: データベース接続とテーブルが正しく設定されているか確認

### ログの確認

開発者ツールのコンソールでエラーメッセージを確認してください。
