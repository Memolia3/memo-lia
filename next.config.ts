import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/**
 * @type {import('next').NextConfig}
 */
const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1年間キャッシュ
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  // 静的ファイルの生成設定
  generateBuildId: async () => {
    return "memolia-build";
  },
  // 実験的機能の設定
  experimental: {
    // SSGでの最適化
    optimizePackageImports: ["next-intl", "@tanstack/react-query", "lucide-react", "zustand"],
    // サーバーコンポーネントの最適化
    optimizeServerReact: true,
  },
  // コンパイラーの最適化
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // 圧縮設定
  compress: true,
  // パワー設定
  poweredByHeader: false,
  // 環境変数の設定
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "https://memolia.vercel.app",
  },
  // 出力設定
  output: "standalone",
  // バンドルアナライザー（開発時のみ）
  ...(process.env.ANALYZE === "true" && {
    webpack: (config: { optimization?: Record<string, unknown> }) => {
      config.optimization = {
        ...config.optimization,
        moduleIds: "deterministic",
        runtimeChunk: "single",
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              priority: 10,
              reuseExistingChunk: true,
            },
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
      return config;
    },
  }),
};

export default withNextIntl(nextConfig);
