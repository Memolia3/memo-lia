import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { hasDangerousProtocol, isValidUrl, sanitizeHtml } from "@/utils/sanitize";
import { NextRequest, NextResponse } from "next/server";

interface UrlMetadata {
  title?: string;
  description?: string;
  faviconUrl?: string;
  url: string;
}

// メモリキャッシュ（Vercel無料プラン向けに最適化）
const metadataCache = new Map<string, { data: UrlMetadata; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10分間キャッシュ（無料プラン対応）

// 定期的なキャッシュクリーンアップ（5分ごと）
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of metadataCache.entries()) {
      if (now - entry.timestamp > CACHE_TTL) {
        metadataCache.delete(key);
      }
    }
  },
  5 * 60 * 1000
);

export async function POST(request: NextRequest) {
  try {
    // レート制限チェック
    const clientIp =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (checkRateLimit(`metadata:${clientIp}`, 20, 60000)) {
      // 1分間に20回まで（無料プラン向けに緩和）
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    // 認証チェック
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // キャッシュチェック
    const cacheKey = url.toLowerCase();
    const cached = metadataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data, {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
        },
      });
    }

    // URLの妥当性チェック
    if (!isValidUrl(url)) {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    if (hasDangerousProtocol(url)) {
      return NextResponse.json({ error: "Dangerous protocol detected" }, { status: 400 });
    }

    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // URLのHTMLを取得（Vercel無料プラン向けに短縮）
    const response = await fetch(validUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; URL-metadata-bot/1.0)",
      },
      signal: AbortSignal.timeout(5000), // 5秒でタイムアウト（無料プラン対応）
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status}` },
        { status: 400 }
      );
    }

    const html = await response.text();

    // HTMLからメタデータを抽出
    const metadata: UrlMetadata = {
      url: validUrl.toString(),
    };

    // タイトル抽出
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      metadata.title = sanitizeHtml(titleMatch[1].trim());
    }

    // Open Graphタイトル
    const ogTitleMatch = html.match(
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i
    );
    if (ogTitleMatch) {
      metadata.title = sanitizeHtml(ogTitleMatch[1].trim());
    }

    // 説明抽出
    const descriptionMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
    );
    if (descriptionMatch) {
      metadata.description = sanitizeHtml(descriptionMatch[1].trim());
    }

    // Open Graph説明
    const ogDescriptionMatch = html.match(
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i
    );
    if (ogDescriptionMatch) {
      metadata.description = sanitizeHtml(ogDescriptionMatch[1].trim());
    }

    // ファビコン取得
    const faviconMatch = html.match(
      /<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*href=["']([^"']+)["']/i
    );
    if (faviconMatch) {
      const faviconPath = faviconMatch[1];
      if (faviconPath.startsWith("http")) {
        metadata.faviconUrl = faviconPath;
      } else if (faviconPath.startsWith("//")) {
        metadata.faviconUrl = `${validUrl.protocol}${faviconPath}`;
      } else if (faviconPath.startsWith("/")) {
        metadata.faviconUrl = `${validUrl.origin}${faviconPath}`;
      } else {
        metadata.faviconUrl = `${validUrl.origin}/${faviconPath}`;
      }
    } else {
      // デフォルトファビコンを試す
      metadata.faviconUrl = `${validUrl.origin}/favicon.ico`;
    }

    // キャッシュに保存
    metadataCache.set(cacheKey, {
      data: metadata,
      timestamp: Date.now(),
    });

    // キャッシュサイズ制限（1000件まで）
    if (metadataCache.size > 1000) {
      const firstKey = metadataCache.keys().next().value;
      if (firstKey) {
        metadataCache.delete(firstKey);
      }
    }

    return NextResponse.json(metadata, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch URL metadata" }, { status: 500 });
  }
}
