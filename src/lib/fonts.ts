import { Inter } from "next/font/google";

/**
 * Interフォントの最適化設定
 * display: 'swap' でフォント読み込み中のFOIT（Flash of Invisible Text）を防止
 * preload: true でフォントを優先的に読み込み
 * fallback: システムフォントでフォールバック
 * weight: 必要なウェイトのみを読み込み（パフォーマンス最適化）
 */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
  adjustFontFallback: true,
  weight: ["400", "500", "600", "700"], // 必要なウェイトのみ
  style: ["normal"],
});
