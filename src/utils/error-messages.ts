/**
 * エラーメッセージマッピングユーティリティ
 */

import { ERROR_MESSAGE_TO_I18N_KEY_MAP } from "@/constants/error-messages";

/**
 * サーバーエラーメッセージを国際化キーにマッピング
 */
export const mapServerErrorToI18nKey = (errorMessage: string): string => {
  return ERROR_MESSAGE_TO_I18N_KEY_MAP[errorMessage] || "common.errors.databaseError";
};

/**
 * エラーオブジェクトから適切な国際化キーを取得
 */
export const getErrorI18nKey = (error: unknown): string => {
  if (error instanceof Error) {
    return ERROR_MESSAGE_TO_I18N_KEY_MAP[error.message] || "common.errors.databaseError";
  }

  if (typeof error === "string") {
    return ERROR_MESSAGE_TO_I18N_KEY_MAP[error] || "common.errors.databaseError";
  }

  // その他の場合はデフォルトエラー
  return "common.errors.databaseError";
};
