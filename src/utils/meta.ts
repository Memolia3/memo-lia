import { LOCALE_CONFIG, LOCALES, META } from "@/constants/meta";
import type { PageMetaOptions } from "@/types";
import type { Metadata } from "next";

/**
 * ブラウザが英語かどうかを判定する
 * ※日本語設定以外は英語として取り扱う
 * @param locale 言語
 * @returns ブラウザが英語かどうか
 */
export const isLocaleEnglish = (locale: string): boolean => {
  return LOCALES.JAPANESE !== locale;
};

/**
 * 動的メタデータ生成関数
 * @param locale 言語
 * @param options ページ固有のオプション
 * @returns メタデータ設定
 */
export const generateMetadata = (locale: string, options: PageMetaOptions = {}): Metadata => {
  const localeData =
    LOCALE_CONFIG[locale as keyof typeof LOCALE_CONFIG] || LOCALE_CONFIG[LOCALES.ENGLISH];

  // ページ固有の値またはデフォルト値を使用
  const title = options.title || localeData.title;
  const description = options.description || localeData.description;
  const keywords = options.keywords
    ? [...META.KEYWORDS.COMMON, ...options.keywords]
    : [...localeData.keywords];
  const image = options.image || META.URLS.OG_IMAGE;
  const url = options.url || META.URLS.CANONICAL;
  const type = options.type || META.OPENGRAPH.TYPE;

  return {
    title: META.TITLES.TEMPLATE.replace("%s", title),
    description,
    keywords,
    authors: [{ name: META.OPENGRAPH.SITE_NAME }],
    creator: META.OPENGRAPH.SITE_NAME,
    publisher: META.OPENGRAPH.SITE_NAME,
    formatDetection: {
      email: META.FORMAT_DETECTION.EMAIL,
      address: META.FORMAT_DETECTION.ADDRESS,
      telephone: META.FORMAT_DETECTION.TELEPHONE,
    },
    metadataBase: new URL(META.URLS.BASE),
    alternates: {
      canonical: url,
      languages: {
        [LOCALES.ENGLISH]: `/${LOCALES.ENGLISH}`,
        [LOCALES.JAPANESE]: `/${LOCALES.JAPANESE}`,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png", sizes: "32x32" },
        { url: "/assets/images/memo-lia-pwa-icon.png", type: "image/png", sizes: "192x192" },
        { url: "/assets/images/memo-lia-pwa-icon.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    },
    manifest: "/manifest.json",
    openGraph: {
      title,
      description,
      url,
      siteName: META.OPENGRAPH.SITE_NAME,
      locale: locale,
      type,
      images: [
        {
          url: image,
          width: META.OPENGRAPH.IMAGE.WIDTH,
          height: META.OPENGRAPH.IMAGE.HEIGHT,
          alt: title,
        },
      ],
    },
    twitter: {
      card: META.TWITTER.CARD,
      title,
      description,
      images: [image],
    },
    robots: {
      index: META.ROBOTS.INDEX,
      follow: META.ROBOTS.FOLLOW,
      googleBot: {
        index: META.ROBOTS.GOOGLE_BOT.INDEX,
        follow: META.ROBOTS.GOOGLE_BOT.FOLLOW,
        "max-video-preview": META.ROBOTS.GOOGLE_BOT.MAX_VIDEO_PREVIEW,
        "max-image-preview": META.ROBOTS.GOOGLE_BOT.MAX_IMAGE_PREVIEW,
        "max-snippet": META.ROBOTS.GOOGLE_BOT.MAX_SNIPPET,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    other: {
      "google-adsense-account": process.env.GOOGLE_ADSENSE_ACCOUNT || "",
    },
  };
};
