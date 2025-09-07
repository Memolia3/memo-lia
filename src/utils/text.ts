/**
 * テキスト関連のユーティリティ関数
 */

/**
 * テキストを指定した長さで省略表示する
 * @param text 省略するテキスト
 * @param maxLength 最大文字数（デフォルト: 4）
 * @param suffix 省略時の接尾辞（デフォルト: "..."）
 * @returns 省略されたテキスト
 */
export function truncateText(text: string, maxLength: number = 4, suffix: string = "..."): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + suffix;
}

/**
 * テキストをURLセーフな形式に変換する
 * @param text 変換するテキスト
 * @returns URLセーフな文字列
 */
export function toUrlSafe(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
