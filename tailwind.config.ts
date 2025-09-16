import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media", // OSの設定に応じて自動切り替え
  theme: {
    extend: {
      // 拡大率対応のブレークポイント
      screens: {
        xs: "320px", // 最小サイズ
        sm: "640px", // 小さいタブレット
        md: "768px", // タブレット
        lg: "1024px", // デスクトップ
        xl: "1280px", // 大画面
        "2xl": "1536px", // 超大画面
        // 高DPI対応
        retina: "2dppx",
        // 拡大率対応
        "zoom-150": "150%",
        "zoom-200": "200%",
        // 拡大率150%以上でpy-8を無効化
        "zoom-150+": {
          raw: "(min-zoom: 150%)",
        },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // ダークモード対応のカラーパレット
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#1d4ed8", // より濃い青色に変更
          600: "#1e40af",
          700: "#1e3a8a",
          800: "#172554",
          900: "#0f172a",
          950: "#020617",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
      },
    },
  },
  plugins: [],
};

export default config;
