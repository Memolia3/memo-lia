/**
 * エラーメッセージマッピングユーティリティ
 */

import { getI18nKeyFromErrorMessage } from "@/constants/error-messages";

/**
 * サーバーエラーメッセージを国際化キーにマッピング
 * @deprecated 新しい getI18nKeyFromErrorMessage を使用してください
 */
export const mapServerErrorToI18nKey = (errorMessage: string): string => {
  return getI18nKeyFromErrorMessage(errorMessage);
};

/**
 * エラーオブジェクトから適切な国際化キーを取得
 */
export const getErrorI18nKey = (error: unknown): string => {
  if (error instanceof Error) {
    return getI18nKeyFromErrorMessage(error.message);
  }

  if (typeof error === "string") {
    return getI18nKeyFromErrorMessage(error);
  }

  // その他の場合はデフォルトエラー
  return "categoryDetail.genres.errors.createFailed";
};
