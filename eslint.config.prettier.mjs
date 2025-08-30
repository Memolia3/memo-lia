import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Prettierとの競合を防ぐ設定
const prettierConfig = [
  ...compat.extends("prettier"),
  {
    rules: {
      // Prettierが処理するため、ESLintの競合ルールを無効化
      indent: "off",
      quotes: "off",
      semi: "off",
      "comma-dangle": "off",
      "object-curly-spacing": "off",
      "array-bracket-spacing": "off",
      "comma-spacing": "off",
      "template-curly-spacing": "off",
      "arrow-spacing": "off",
      "generator-star-spacing": "off",
      "yield-star-spacing": "off",
      "rest-spread-spacing": "off",
      "no-trailing-spaces": "off",
      "eol-last": "off",
      "no-multiple-empty-lines": "off",
      "max-len": "off",
      "prefer-template": "off",
      "object-shorthand": "off",
      "prefer-const": "off",
      "no-var": "off",
      "prefer-destructuring": "off",
      "prefer-rest-params": "off",
      "prefer-spread": "off",
      "no-duplicate-imports": "off",
      "no-useless-rename": "off",
    },
  },
];

export default prettierConfig;
