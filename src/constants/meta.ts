// 言語定数
export const LOCALES: {
  ENGLISH: string;
  JAPANESE: string;
} = {
  ENGLISH: "en",
  JAPANESE: "ja",
} as const;

// サイト定数
export const SITE_NAME = "MemoLia";
export const AUTHOR = "Memolia";

// メタデータ定数
export const META = {
  TITLES: {
    DEFAULT_EN: "MemoLia - URL Bookmark App",
    DEFAULT_JA: "MemoLia - URL保管アプリ",
    TEMPLATE: "%s | MemoLia",
  },
  DESCRIPTIONS: {
    EN: "Organize and store your favorite URLs",
    JA: "お気に入りのURLを整理して保管するアプリ",
  },
  KEYWORDS: {
    COMMON: ["bookmark", "URL", "organizer", "favorites"] as const,
    EN: ["bookmarks", "URL management"] as const,
    JA: ["ブックマーク", "URL管理"] as const,
  },
  URLS: {
    BASE: process.env.NEXT_PUBLIC_APP_URL || "https://memolia.vercel.app",
    CANONICAL: "/",
    OG_IMAGE: "/og-image.jpg",
  },
  OPENGRAPH: {
    SITE_NAME: SITE_NAME,
    TYPE: "website" as const,
    IMAGE: {
      WIDTH: 1200,
      HEIGHT: 630,
      ALT: `${SITE_NAME} - URL Bookmark App`,
    },
  },
  TWITTER: {
    CARD: "summary_large_image" as const,
  },
  ROBOTS: {
    INDEX: true,
    FOLLOW: true,
    GOOGLE_BOT: {
      INDEX: true,
      FOLLOW: true,
      MAX_VIDEO_PREVIEW: -1,
      MAX_IMAGE_PREVIEW: "large" as const,
      MAX_SNIPPET: -1,
    },
  },
  FORMAT_DETECTION: {
    EMAIL: false,
    ADDRESS: false,
    TELEPHONE: false,
  },
} as const;

// 言語別の設定
export const LOCALE_CONFIG = {
  [LOCALES.ENGLISH]: {
    title: META.TITLES.DEFAULT_EN,
    description: META.DESCRIPTIONS.EN,
    keywords: [...META.KEYWORDS.COMMON, ...META.KEYWORDS.EN],
  },
  [LOCALES.JAPANESE]: {
    title: META.TITLES.DEFAULT_JA,
    description: META.DESCRIPTIONS.JA,
    keywords: [...META.KEYWORDS.COMMON, ...META.KEYWORDS.JA],
  },
} as const;

// ページ定数
export const PAGES = {
  TOP: "/",
  AUTH: "/auth",
} as const;
