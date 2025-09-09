import { NextRequest, NextResponse } from "next/server";

interface UrlMetadata {
  title?: string;
  description?: string;
  faviconUrl?: string;
  url: string;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // URLの妥当性チェック
    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // URLのHTMLを取得
    const response = await fetch(validUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; URL-metadata-bot/1.0)",
      },
      signal: AbortSignal.timeout(10000), // 10秒でタイムアウト
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
      metadata.title = titleMatch[1].trim();
    }

    // Open Graphタイトル
    const ogTitleMatch = html.match(
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i
    );
    if (ogTitleMatch) {
      metadata.title = ogTitleMatch[1].trim();
    }

    // 説明抽出
    const descriptionMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
    );
    if (descriptionMatch) {
      metadata.description = descriptionMatch[1].trim();
    }

    // Open Graph説明
    const ogDescriptionMatch = html.match(
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i
    );
    if (ogDescriptionMatch) {
      metadata.description = ogDescriptionMatch[1].trim();
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

    return NextResponse.json(metadata);
  } catch {
    return NextResponse.json({ error: "Failed to fetch URL metadata" }, { status: 500 });
  }
}
