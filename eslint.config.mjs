import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.jsの基本設定
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // カスタムルール
  {
    rules: {
      // React厳格ルール
      "react/display-name": "error",
      "react/jsx-key": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-undef": "error",
      "react/no-array-index-key": "warn",
      "react/no-danger": "warn",
      "react/no-deprecated": "error",
      "react/self-closing-comp": "error",

      // 一般的な厳格ルール
      "no-console": "warn",
      "no-debugger": "error",
      "no-alert": "error",
      "no-eval": "error",
      "prefer-const": "error",
      "no-var": "error",
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "no-trailing-spaces": "error",
      "eol-last": "error",
      "max-len": ["error", { code: 100, ignoreUrls: true, ignoreStrings: true }],
    },
  },

  // 無視ファイル
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "messages/**",
      "*.min.js",
      "*.min.css",
    ],
  },
];

export default eslintConfig;
