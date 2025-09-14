# 通知システム

右下に表示される通知システムです。エラーハンドリングと成功処理を統合し、ベストプラクティスに従って実装されています。

## 特徴

- 🎯 **右下固定表示**: ユーザーの注意を引く位置に配置
- 🎨 **美しいデザイン**: ガラスモーフィズム効果とダークモード対応
- ⚡ **高性能**: React.memoとuseCallbackによる最適化
- ♿ **アクセシビリティ**: ARIA属性とキーボード操作対応
- 🔧 **カスタマイズ可能**: 位置、アニメーション、持続時間などを設定可能
- 🛡️ **エラーハンドリング**: 自動エラー分類と適切な通知表示
- 📊 **デバッグ機能**: 開発環境でのデバッグ情報表示

## 使用方法

### 基本的な通知表示

```typescript
import { useNotificationHelpers } from "@/hooks/useNotificationHelpers";

const { showSuccess, showError, showWarning, showInfo } =
  useNotificationHelpers();

// 成功通知
showSuccess({
  message: "保存しました",
  category: "save",
});

// エラー通知
showError({
  message: "エラーが発生しました",
  error: new Error("詳細"),
  category: "network",
});
```

### 非同期操作での使用

```typescript
import { useAsyncOperation } from "@/hooks/useAsyncOperation";

const { execute, loading, error } = useAsyncOperation({
  successMessage: "操作が完了しました",
  errorMessage: "操作に失敗しました",
});

await execute(async () => {
  // 何らかの非同期処理
});
```

### 認証での使用

認証ボタンを押すと自動で通知が表示されます：

- **成功時**: "Googleでログインしました"
- **エラー時**: 適切なエラーメッセージ

## 通知の種類

### 成功通知

- `save`: 保存成功
- `delete`: 削除成功
- `update`: 更新成功
- `create`: 作成成功
- `login`: ログイン成功
- `logout`: ログアウト成功

### エラー通知

- `network`: ネットワークエラー
- `authentication`: 認証エラー
- `authorization`: 権限エラー
- `validation`: バリデーションエラー
- `server`: サーバーエラー
- `client`: クライアントエラー

## 設定

### 通知プロバイダーの設定

```typescript
<NotificationProvider
  defaults={{
    duration: 5000,
    closable: true,
    position: "bottom-right",
    animation: "slide",
    severity: "medium",
  }}
  maxNotifications={5}
  position="bottom-right"
>
  {/* アプリケーション */}
</NotificationProvider>
```

### 通知の位置

- `top-left`: 左上
- `top-right`: 右上
- `top-center`: 上中央
- `bottom-left`: 左下
- `bottom-right`: 右下（デフォルト）
- `bottom-center`: 下中央

### アニメーション

- `slide`: スライド（デフォルト）
- `fade`: フェード
- `scale`: スケール
- `bounce`: バウンス

## デバッグ

開発環境では、ブラウザのコンソールで以下のコマンドが使用できます：

```javascript
// 通知のデバッグ情報を表示
__NOTIFICATION_DEBUG__.store.getState();

// 通知をクリア
__NOTIFICATION_DEBUG__.store.getState().clearAllNotifications();

// テスト通知を追加
__NOTIFICATION_DEBUG__.store.getState().addNotification({
  type: "info",
  message: "テスト通知",
  duration: 3000,
});
```

## パフォーマンス

- React.memoによる再レンダリングの最適化
- useCallbackによる関数のメモ化
- Zustandによる効率的な状態管理
- 通知の優先度による表示順序の制御

## アクセシビリティ

- `role="alert"`によるスクリーンリーダー対応
- `aria-live="polite"`による動的コンテンツの通知
- `aria-atomic="true"`による完全な通知の読み上げ
- キーボード操作（Escapeキーで閉じる）
- 適切なコントラスト比とフォーカス表示

## カスタマイズ

通知の外観は以下の方法でカスタマイズできます：

1. **CSS変数**: テーマカラーを変更
2. **Tailwindクラス**: スタイルを調整
3. **カスタムアイコン**: 通知に独自のアイコンを設定
4. **アクションボタン**: 通知に操作ボタンを追加

## ベストプラクティス

1. **適切な通知タイプを使用**: 状況に応じてsuccess、error、warning、infoを使い分ける
2. **簡潔なメッセージ**: ユーザーが理解しやすい短いメッセージを心がける
3. **適切な持続時間**: 重要度に応じて表示時間を調整
4. **エラーの詳細**: 開発環境では詳細なエラー情報を表示
5. **通知の重複回避**: 同じ内容の通知が重複しないよう注意
