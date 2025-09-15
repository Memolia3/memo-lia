import { DATABASE_ERROR_MESSAGES } from "@/constants/error-messages";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

/**
 * トランザクション処理のベストプラクティス
 *
 * 使用方法:
 * ```typescript
 * const result = await executeTransaction(async (tx) => {
 *   // 複数のSQLクエリを実行
 *   const result1 = await tx`INSERT INTO table1 ...`;
 *   const result2 = await tx`UPDATE table2 ...`;
 *   return { result1, result2 };
 * });
 * ```
 */
export async function executeTransaction<T>(operation: (tx: typeof sql) => Promise<T>): Promise<T> {
  return await operation(sql);
}

/**
 * エラーハンドリング付きトランザクション実行
 *
 * @param operation トランザクション内で実行する処理
 * @param errorMessage エラー時のメッセージ
 * @param knownErrors 既知のエラーメッセージ配列（そのまま投げ直す）
 */
export async function executeTransactionWithErrorHandling<T>(
  operation: (tx: typeof sql) => Promise<T>,
  errorMessage: string,
  knownErrors: string[] = []
): Promise<T> {
  try {
    return await executeTransaction(operation);
  } catch (error: unknown) {
    // 既知のエラーメッセージの場合はそのまま投げ直し
    if (error instanceof Error && knownErrors.includes(error.message)) {
      throw error;
    }

    // PostgreSQL unique constraint violation
    if (error && typeof error === "object" && "code" in error && error.code === "23505") {
      throw new Error(DATABASE_ERROR_MESSAGES.DUPLICATE_DATA_DETECTED);
    }

    // その他のエラーの場合は汎用エラー
    throw new Error(errorMessage);
  }
}

/**
 * PostgreSQL エラーコード定数
 */
export const POSTGRES_ERROR_CODES = {
  UNIQUE_VIOLATION: "23505",
  FOREIGN_KEY_VIOLATION: "23503",
  NOT_NULL_VIOLATION: "23502",
  CHECK_VIOLATION: "23514",
} as const;

/**
 * エラーコードに基づくエラーメッセージの取得
 */
export function getErrorMessageByCode(errorCode: string): string {
  switch (errorCode) {
    case POSTGRES_ERROR_CODES.UNIQUE_VIOLATION:
      return DATABASE_ERROR_MESSAGES.DUPLICATE_DATA_DETECTED;
    case POSTGRES_ERROR_CODES.FOREIGN_KEY_VIOLATION:
      return DATABASE_ERROR_MESSAGES.REFERENCE_INTEGRITY_ERROR;
    case POSTGRES_ERROR_CODES.NOT_NULL_VIOLATION:
      return DATABASE_ERROR_MESSAGES.REQUIRED_FIELD_MISSING;
    case POSTGRES_ERROR_CODES.CHECK_VIOLATION:
      return DATABASE_ERROR_MESSAGES.DATA_CONSTRAINT_VIOLATION;
    default:
      return DATABASE_ERROR_MESSAGES.DATABASE_ERROR;
  }
}
