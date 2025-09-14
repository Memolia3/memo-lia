/**
 * レート制限ユーティリティ
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// メモリベースのレート制限（本番環境ではRedisなどの外部ストレージを使用することを推奨）
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * レート制限をチェック
 * @param identifier ユーザー識別子（IPアドレス、ユーザーIDなど）
 * @param maxRequests 最大リクエスト数
 * @param windowMs 時間窓（ミリ秒）
 * @returns レート制限に引っかかっているかどうか
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15分
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    // 新しいエントリまたはリセット時間を過ぎた場合
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false; // レート制限に引っかからない
  }

  if (entry.count >= maxRequests) {
    return true; // レート制限に引っかかる
  }

  // カウントを増やす
  entry.count++;
  return false; // レート制限に引っかからない
}

/**
 * 古いエントリをクリーンアップ
 */
export function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// 5分ごとにクリーンアップを実行
setInterval(cleanupRateLimit, 5 * 60 * 1000);
