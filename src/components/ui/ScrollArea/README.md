# ScrollArea コンポーネント

プロジェクト統一のカスタムスクロールバーを提供するコンポーネントです。デザインシステムに統合された美しいスクロールバーで一貫したユーザー体験を実現します。

## 機能

- **統一されたデザイン**: プロジェクトのカラーパレットに基づいたスクロールバー
- **ダークモード対応**: ライトモード・ダークモード自動切り替え
- **レスポンシブ**: デスクトップ・モバイル両対応
- **カスタマイズ可能**: 3つのバリアント、3つのサイズ選択
- **アクセシビリティ**: キーボードフォーカス対応

## 使用方法

### 基本的な使用例

```tsx
import { ScrollArea } from "@/components/ui";

// 基本的な縦スクロール
<ScrollArea className="h-96">
  <div>
    {/* スクロール対象のコンテンツ */}
    長いコンテンツがここに入ります...
  </div>
</ScrollArea>;
```

### バリアント

```tsx
// デフォルト（グレー系）
<ScrollArea variant="default">
  <div>コンテンツ</div>
</ScrollArea>

// プライマリ（ブルー系）
<ScrollArea variant="primary">
  <div>コンテンツ</div>
</ScrollArea>

// サブトル（より控えめ）
<ScrollArea variant="subtle">
  <div>コンテンツ</div>
</ScrollArea>
```

### サイズ

```tsx
// 小（モバイル向け）
<ScrollArea size="sm">
  <div>コンテンツ</div>
</ScrollArea>

// 中（デフォルト）
<ScrollArea size="md">
  <div>コンテンツ</div>
</ScrollArea>

// 大（デスクトップ向け）
<ScrollArea size="lg">
  <div>コンテンツ</div>
</ScrollArea>
```

### スクロール方向

```tsx
// 縦スクロール（デフォルト）
<ScrollArea orientation="vertical">
  <div>縦に長いコンテンツ</div>
</ScrollArea>

// 横スクロール
<ScrollArea orientation="horizontal">
  <div className="w-[1000px]">横に長いコンテンツ</div>
</ScrollArea>

// 両方向スクロール
<ScrollArea orientation="both">
  <div className="w-[1000px] h-[1000px]">大きなコンテンツ</div>
</ScrollArea>
```

### スクロールバー非表示

```tsx
// スクロールバーを非表示（スクロール機能は維持）
<ScrollArea hideScrollbar>
  <div>コンテンツ</div>
</ScrollArea>
```

## 実装例

### カテゴリ詳細ページ（デスクトップ）

```tsx
<ScrollArea
  className="flex-1 px-6 pb-6"
  variant="default"
  size="md"
  orientation="vertical"
>
  <GenreGrid genres={genres} />
</ScrollArea>
```

### カテゴリ詳細ページ（モバイル）

```tsx
<ScrollArea
  className="flex-1 px-4 pb-4"
  variant="subtle"
  size="sm"
  orientation="vertical"
>
  <GenreGrid genres={genres} />
</ScrollArea>
```

### フォーム画面

```tsx
<ScrollArea className="flex-1 px-4 py-6" variant="subtle" size="sm">
  <div className="flex items-center min-h-full">
    <CategoryForm onSubmit={handleSubmit} />
  </div>
</ScrollArea>
```

## プロパティ

| プロパティ      | 型                                         | デフォルト   | 説明                           |
| --------------- | ------------------------------------------ | ------------ | ------------------------------ |
| `variant`       | `"default"` \| `"primary"` \| `"subtle"`   | `"default"`  | スクロールバーのスタイル       |
| `size`          | `"sm"` \| `"md"` \| `"lg"`                 | `"md"`       | スクロールバーのサイズ         |
| `hideScrollbar` | `boolean`                                  | `false`      | スクロールバーを非表示にするか |
| `orientation`   | `"vertical"` \| `"horizontal"` \| `"both"` | `"vertical"` | スクロール方向                 |
| `className`     | `string`                                   | -            | 追加のCSSクラス                |

## デザインシステム統合

### カラーパレット

- **default**: Gray系統（ライト: gray-100/300, ダーク: gray-800/600）
- **primary**: Blue系統（ライト: blue-50/300, ダーク: blue-950/600）
- **subtle**: 透明背景（ライト: gray-200, ダーク: gray-700）

### ブラウザサポート

- **Webkit系**: Chrome, Safari, Edge
- **Firefox**: scrollbar-width プロパティ使用
- **レガシーブラウザ**: フォールバック対応

## ベストプラクティス

1. **適切なバリアント選択**
   - メインコンテンツ: `default`
   - アクセント部分: `primary`
   - サブコンテンツ: `subtle`

2. **レスポンシブ対応**
   - デスクトップ: `size="md"` または `size="lg"`
   - モバイル: `size="sm"`

3. **パフォーマンス**
   - 大量データの場合は仮想化を検討
   - コンテンツが短い場合は不要

4. **アクセシビリティ**
   - フォーカス可能な要素での適切な処理
   - キーボードナビゲーション対応

## 注意事項

- `flex-1` や `overflow-hidden` などのレイアウトクラスとの組み合わせに注意
- 高さが確定していない場合は親要素で制約を設定
- Firefoxでは一部スタイルが制限される場合があります
