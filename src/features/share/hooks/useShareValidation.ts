// 許可されたドメインのリスト（サーバーサイドでのみ定義）
const ALLOWED_ORIGINS = process.env.NEXT_PUBLIC_APP_URL?.split(",") || [];

// 危険なドメインのブラックリスト
const DANGEROUS_DOMAINS = ["javascript:", "data:", "file:", "ftp:", "mailto:", "tel:", "sms:"];

// 危険なパターンのリスト
const DANGEROUS_PATTERNS = [
  /javascript:/i,
  /data:/i,
  /vbscript:/i,
  /onload=/i,
  /onerror=/i,
  /onclick=/i,
  /onmouseover=/i,
  /onfocus=/i,
  /onblur=/i,
  /onchange=/i,
  /onsubmit=/i,
  /<script/i,
  /<\/script/i,
  /eval\(/i,
  /expression\(/i,
  /setTimeout\(/i,
  /setInterval\(/i,
  /Function\(/i,
  /new\s+Function/i,
  /document\.write/i,
  /innerHTML\s*=/i,
  /outerHTML\s*=/i,
  /document\.createElement/i,
  /window\.open/i,
  /location\.href\s*=/i,
  /location\.replace/i,
  /history\.pushState/i,
  /history\.replaceState/i,
  /fetch\(/i,
  /XMLHttpRequest/i,
  /WebSocket/i,
  /postMessage/i,
  /import\s*\(/i,
  /require\s*\(/i,
  /\.call\(/i,
  /\.apply\(/i,
  /\.bind\(/i,
  /atob\(/i,
  /btoa\(/i,
  /unescape\(/i,
  /escape\(/i,
  /decodeURIComponent\(/i,
  /encodeURIComponent\(/i,
];

// URL検証関数
export function validateUrl(url: string): boolean {
  try {
    // 基本的な長さ制限
    if (!url || url.length > 2048) return false;

    // 危険なパターンのチェック
    for (const pattern of DANGEROUS_PATTERNS) {
      if (pattern.test(url)) return false;
    }

    // 危険なドメインのチェック
    for (const domain of DANGEROUS_DOMAINS) {
      if (url.toLowerCase().includes(domain)) return false;
    }

    const urlObj = new URL(url);

    // プロトコル検証（http/httpsのみ許可）
    if (!["http:", "https:"].includes(urlObj.protocol)) return false;

    // ホスト名の検証
    if (!urlObj.hostname || urlObj.hostname.length > 253) return false;

    // localhostの詳細検証
    if (urlObj.hostname.includes("localhost")) {
      if (!urlObj.hostname.match(/^localhost(:\d+)?$/)) return false;
    }

    // IPアドレスの検証（プライベートIPを制限）
    if (urlObj.hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      const parts = urlObj.hostname.split(".").map(Number);
      if (
        parts[0] === 127 ||
        parts[0] === 192 ||
        parts[0] === 10 ||
        (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)
      ) {
        // プライベートIPは開発環境のみ許可
        if (!ALLOWED_ORIGINS.includes(urlObj.origin)) return false;
      }
    }

    // パスの検証（危険な文字列をチェック）
    const dangerousPathPatterns = [
      /\.\.\//g, // ディレクトリトラバーサル
      /\.\.\\/g, // Windows ディレクトリトラバーサル
      /%2e%2e\//gi, // URL エンコードされたディレクトリトラバーサル
    ];

    for (const pattern of dangerousPathPatterns) {
      if (pattern.test(urlObj.pathname)) return false;
    }

    return true;
  } catch {
    return false;
  }
}

// リファラー検証（ブックマークレット対応版）
export function validateReferer(headers: Headers): boolean {
  const referer = headers.get("referer");

  // リファラーがない場合は許可（ブックマークレットや直接アクセスの場合）
  if (!referer) return true;

  try {
    const refererUrl = new URL(referer);

    // 許可されたドメインからのアクセスの場合は許可
    if (ALLOWED_ORIGINS.includes(refererUrl.origin)) {
      return true;
    }

    // 外部ドメインの場合、基本的な検証のみ
    if (refererUrl.protocol === "https:" || refererUrl.protocol === "http:") {
      // 危険なパターンのみチェック（緩和）
      const refererString = refererUrl.toString();

      // 明らかに危険なパターンのみチェック
      const criticalPatterns = [/javascript:/i, /data:/i, /vbscript:/i];

      for (const pattern of criticalPatterns) {
        if (pattern.test(refererString)) return false;
      }
      return true;
    }

    return false;
  } catch {
    // URL解析に失敗した場合は許可（外部サイトからのアクセスの場合）
    return true;
  }
}

// 入力データのサニタイズ
export function sanitizeInput(input: string | string[] | undefined): string {
  if (!input) return "";
  const str = Array.isArray(input) ? input[0] : String(input);

  // 基本的な長さ制限
  if (str.length > 1000) return str.substring(0, 1000);

  let sanitized = str;

  // 危険なパターンの除去
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, "");
  }

  // HTMLタグの除去
  sanitized = sanitized.replace(/<[^>]*>/g, "");

  // JavaScript関連の文字列除去
  sanitized = sanitized.replace(/javascript:/gi, "");
  sanitized = sanitized.replace(/data:/gi, "");
  sanitized = sanitized.replace(/vbscript:/gi, "");

  // 危険な文字のエスケープ
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

  // 制御文字の除去
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, "");

  return sanitized.trim();
}

// User-Agentの検証（ボット対策）
export function validateUserAgent(userAgent: string | null): boolean {
  return !!(userAgent && userAgent.length >= 10);
}

// レート制限チェック（強化版）
const requestCounts = new Map<string, { count: number; lastReset: number; suspicious: boolean }>();
const RATE_LIMIT_WINDOW = 60000; // 1分
const RATE_LIMIT_MAX_REQUESTS = 5; // 1分間に5回まで（強化）
const SUSPICIOUS_THRESHOLD = 3; // 3回で疑わしいとマーク

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(ip);

  if (!userRequests || now - userRequests.lastReset > RATE_LIMIT_WINDOW) {
    requestCounts.set(ip, { count: 1, lastReset: now, suspicious: false });
    return true;
  }

  // 疑わしいIPの場合はより厳しい制限
  const maxRequests = userRequests.suspicious ? 2 : RATE_LIMIT_MAX_REQUESTS;

  if (userRequests.count >= maxRequests) {
    return false;
  }

  userRequests.count++;

  // 疑わしい行動の検出
  if (userRequests.count >= SUSPICIOUS_THRESHOLD) {
    userRequests.suspicious = true;
  }

  return true;
}

// IPアドレスの取得
export function getClientIP(headers: Headers): string {
  return (
    headers.get("x-forwarded-for") ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

// セキュリティ強化のための追加検証
export function validateBookmarkletSecurity(
  url: string,
  title: string,
  userAgent: string | null,
  referer: string | null
): { isValid: boolean; reason?: string } {
  // 1. ブックマークレット特有の検証
  if (referer && referer.includes("javascript:")) {
    return { isValid: false, reason: "Suspicious referer detected" };
  }

  // 2. 異常に長いタイトルの検証
  if (title && title.length > 500) {
    return { isValid: false, reason: "Title too long" };
  }

  // 3. 異常なURLパラメータの検証
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;

    // パラメータの数が異常に多い場合
    if (params.size > 20) {
      return { isValid: false, reason: "Too many URL parameters" };
    }

    // パラメータの値が異常に長い場合
    for (const [, value] of params) {
      if (value.length > 1000) {
        return { isValid: false, reason: "URL parameter value too long" };
      }
    }
  } catch {
    return { isValid: false, reason: "Invalid URL structure" };
  }

  // 4. User-Agentの検証強化
  if (!userAgent || userAgent.length < 20) {
    return { isValid: false, reason: "Invalid or missing User-Agent" };
  }

  // 5. 疑わしいUser-Agentパターンの検証
  const suspiciousUserAgents = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /php/i,
  ];

  for (const pattern of suspiciousUserAgents) {
    if (pattern.test(userAgent)) {
      return { isValid: false, reason: "Automated request detected" };
    }
  }

  return { isValid: true };
}

// 共有データの検証とサニタイズ
export interface SharedData {
  title: string;
  text: string;
  url: string;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  data?: SharedData;
}

export function validateAndSanitizeShareData(
  rawUrl: string | undefined,
  rawTitle: string | undefined,
  rawText: string | undefined
): ValidationResult {
  // パラメータの存在チェック
  if (!rawUrl) {
    return {
      isValid: false,
      errorMessage: "Missing URL parameter",
    };
  }

  // URL検証
  if (!validateUrl(rawUrl)) {
    return {
      isValid: false,
      errorMessage: "Invalid URL or contains dangerous content",
    };
  }

  // データのサニタイズ
  const sharedData: SharedData = {
    title: sanitizeInput(rawTitle),
    text: sanitizeInput(rawText),
    url: sanitizeInput(rawUrl),
  };

  // サニタイズ後のURL再検証
  if (!validateUrl(sharedData.url)) {
    return {
      isValid: false,
      errorMessage: "URL failed security validation after sanitization",
    };
  }

  return {
    isValid: true,
    data: sharedData,
  };
}
