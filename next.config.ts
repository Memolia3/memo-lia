import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/**
 * @type {import('next').NextConfig}
 */
const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
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
    optimizePackageImports: ["next-intl", "lucide-react", "@tanstack/react-query"],
    // パフォーマンス最適化
    optimizeCss: true,
    // Bundle analyzer
    // bundlePagesRouterDependencies: true, // This option doesn't exist
  },
  // コンパイラーの最適化
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // 環境変数の設定
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "https://memolia.vercel.app",
  },
};

export default withNextIntl(nextConfig);
