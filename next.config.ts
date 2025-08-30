import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/**
 * @type {import('next').NextConfig}
 */
const nextConfig: NextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google認証のアバター画像
      "avatars.githubusercontent.com", // GitHub認証のアバター画像
    ],
  },
  // 静的ファイルの生成設定
  generateBuildId: async () => {
    return "memolia-build";
  },
  // 実験的機能の設定
  experimental: {
    // SSGでの最適化
    optimizePackageImports: ["next-intl"],
  },
  // 環境変数の設定
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "https://memolia.vercel.app",
  },
};

export default withNextIntl(nextConfig);
