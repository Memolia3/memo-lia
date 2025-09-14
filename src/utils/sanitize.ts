/**
 * HTMLサニタイズ用ユーティリティ関数
 */

/**
 * HTMLタグをエスケープしてXSS攻撃を防ぐ
 * @param text サニタイズするテキスト
 * @returns サニタイズされたテキスト
 */
export function sanitizeHtml(text: string): string {
  if (typeof text !== "string") {
    return "";
  }

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * テキストの長さを制限してサニタイズ
 * @param text サニタイズするテキスト
 * @param maxLength 最大文字数
 * @returns サニタイズされ長さ制限されたテキスト
 */
export function sanitizeAndTruncate(text: string, maxLength: number = 200): string {
  const sanitized = sanitizeHtml(text);
  return sanitized.length > maxLength ? sanitized.substring(0, maxLength) + "..." : sanitized;
}

/**
 * URLの妥当性をチェック
 * @param url チェックするURL
 * @returns 妥当なURLかどうか
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // HTTPとHTTPSのみ許可
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * 危険なプロトコルをチェック
 * @param url チェックするURL
 * @returns 危険なプロトコルが含まれているかどうか
 */
export function hasDangerousProtocol(url: string): boolean {
  const dangerousProtocols = ["javascript:", "data:", "vbscript:", "file:", "ftp:"];
  return dangerousProtocols.some(protocol => url.toLowerCase().startsWith(protocol));
}
