import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * クラス名を結合し、Tailwind CSSの競合を解決する
 * clsxとtailwind-mergeを使用して、重複するクラスを適切に処理
 *
 * @param inputs - 結合するクラス名
 * @returns 処理されたクラス名の文字列
 *
 * @example
 * cn("px-2 py-1", "px-3") // "py-1 px-3" (px-2はpx-3で上書き)
 * cn("text-red-500", "text-blue-500") // "text-blue-500"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
