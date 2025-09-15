/**
 * エラーメッセージ定数
 * サーバーアクションとクライアント側で共有するエラーメッセージ
 */

/**
 * 共通のエラーメッセージ
 */
export const COMMON_ERROR_MESSAGES = {
  NAME_REQUIRED: "名前は必須です",
  NAME_TOO_LONG: "名前は長すぎます",
  DESCRIPTION_TOO_LONG: "説明は長すぎます",
  USER_ID_NOT_PROVIDED: "ユーザーIDが指定されていません",
  INVALID_USER_ID: "無効なユーザーIDです",
  INVALID_USER_ID_FORMAT: "無効なユーザーID形式です",
  INVALID_COLOR_CODE: "カラーコードの形式が正しくありません",
  ID_REQUIRED: "IDとユーザーIDは必須です",
  CREATE_FAILED: "作成に失敗しました",
  FETCH_FAILED: "取得に失敗しました",
  DELETE_FAILED: "削除に失敗しました",
  UPDATE_FAILED: "更新に失敗しました",
  DUPLICATE_CHECK_FAILED: "重複チェックに失敗しました",
  SORT_ORDER_FAILED: "ソート順の取得に失敗しました",
  DELETION_STATS_FAILED: "削除影響の取得に失敗しました",
} as const;

/**
 * ジャンル関連のエラーメッセージ
 */
export const GENRE_ERROR_MESSAGES = {
  NAME_ALREADY_EXISTS: "このジャンル名は既に使用されています",
  INVALID_CATEGORY: "無効なカテゴリIDです",
  CATEGORY_NOT_FOUND: "カテゴリが見つかりません",
  INVALID_GENRE: "ジャンル: 無効なジャンルIDです",
  INVALID_GENRE_ID_FORMAT: "無効なジャンルID形式です",
  GENRE_NOT_FOUND: "ジャンルが見つかりません",
} as const;

/**
 * カテゴリ関連のエラーメッセージ
 */
export const CATEGORY_ERROR_MESSAGES = {
  NAME_ALREADY_EXISTS: "このカテゴリ名は既に使用されています",
  INVALID_CATEGORY_ID_FORMAT: "無効なカテゴリID形式です",
  CATEGORY_NOT_FOUND: "カテゴリが見つかりません",
  ICON_TOO_LONG: "アイコン名は50文字以内で入力してください",
} as const;

/**
 * ユーザー関連のエラーメッセージ
 */
export const USER_ERROR_MESSAGES = {
  EXISTENCE_CHECK_FAILED: "ユーザー存在チェックに失敗しました",
} as const;

/**
 * ユーザープロバイダー関連のエラーメッセージ
 */
export const USER_PROVIDER_ERROR_MESSAGES = {
  USER_FETCH_FAILED: "ユーザー情報の取得に失敗しました",
  PROVIDER_UPDATE_FAILED: "プロバイダー情報の更新に失敗しました",
  PROVIDER_DELETE_FAILED: "プロバイダー情報の削除に失敗しました",
} as const;

/**
 * URL関連のエラーメッセージ
 */
export const URL_ERROR_MESSAGES = {
  URL_ALREADY_EXISTS: "このURLは既に登録されています",
  INVALID_URL: "無効なURLです",
  URL_REQUIRED: "URLは必須です",
  TITLE_REQUIRED: "タイトルは必須です",
  TITLE_TOO_LONG: "タイトルは200文字以内で入力してください",
  INVALID_GENRE: "無効なジャンルIDです",
  URL_NOT_FOUND: "削除するURLが見つかりません",
} as const;

/**
 * データベース関連のエラーメッセージ
 */
export const DATABASE_ERROR_MESSAGES = {
  DUPLICATE_DATA_DETECTED: "データの重複が検出されました",
  REFERENCE_INTEGRITY_ERROR: "参照整合性エラーが発生しました",
  REQUIRED_FIELD_MISSING: "必須項目が入力されていません",
  DATA_CONSTRAINT_VIOLATION: "データの制約に違反しています",
  DATABASE_ERROR: "データベースエラーが発生しました",
} as const;

/**
 * エラーメッセージから国際化キーへのマッピング
 */
export const ERROR_MESSAGE_TO_I18N_KEY_MAP: Record<string, string> = {
  // 共通のエラーメッセージ
  [COMMON_ERROR_MESSAGES.NAME_REQUIRED]: "common.errors.nameRequired",
  [COMMON_ERROR_MESSAGES.NAME_TOO_LONG]: "common.errors.nameTooLong",
  [COMMON_ERROR_MESSAGES.DESCRIPTION_TOO_LONG]: "common.errors.descriptionTooLong",
  [COMMON_ERROR_MESSAGES.USER_ID_NOT_PROVIDED]: "common.errors.userIdRequired",
  [COMMON_ERROR_MESSAGES.INVALID_USER_ID]: "common.errors.invalidUserId",
  [COMMON_ERROR_MESSAGES.INVALID_USER_ID_FORMAT]: "common.errors.invalidUserIdFormat",
  [COMMON_ERROR_MESSAGES.INVALID_COLOR_CODE]: "common.errors.invalidColorCode",
  [COMMON_ERROR_MESSAGES.ID_REQUIRED]: "common.errors.idRequired",
  [COMMON_ERROR_MESSAGES.CREATE_FAILED]: "common.errors.createFailed",
  [COMMON_ERROR_MESSAGES.FETCH_FAILED]: "common.errors.fetchFailed",
  [COMMON_ERROR_MESSAGES.DELETE_FAILED]: "common.errors.deleteFailed",
  [COMMON_ERROR_MESSAGES.UPDATE_FAILED]: "common.errors.updateFailed",
  [COMMON_ERROR_MESSAGES.DUPLICATE_CHECK_FAILED]: "common.errors.duplicateCheckFailed",
  [COMMON_ERROR_MESSAGES.SORT_ORDER_FAILED]: "common.errors.sortOrderFailed",
  [COMMON_ERROR_MESSAGES.DELETION_STATS_FAILED]: "common.errors.deletionStatsFailed",

  // ジャンル関連
  [GENRE_ERROR_MESSAGES.NAME_ALREADY_EXISTS]: "categoryDetail.genres.errors.nameAlreadyExists",
  [GENRE_ERROR_MESSAGES.INVALID_CATEGORY]: "categoryDetail.genres.errors.invalidCategory",
  [GENRE_ERROR_MESSAGES.INVALID_GENRE]: "categoryDetail.genres.errors.invalidGenre",
  [GENRE_ERROR_MESSAGES.INVALID_GENRE_ID_FORMAT]:
    "categoryDetail.genres.errors.invalidGenreIdFormat",
  [GENRE_ERROR_MESSAGES.GENRE_NOT_FOUND]: "categoryDetail.genres.errors.genreNotFound",

  // カテゴリ関連
  [CATEGORY_ERROR_MESSAGES.NAME_ALREADY_EXISTS]: "categories.errors.nameAlreadyExists",
  [CATEGORY_ERROR_MESSAGES.INVALID_CATEGORY_ID_FORMAT]: "categories.errors.invalidCategoryIdFormat",
  [CATEGORY_ERROR_MESSAGES.CATEGORY_NOT_FOUND]: "categories.errors.categoryNotFound",
  [CATEGORY_ERROR_MESSAGES.ICON_TOO_LONG]: "categories.errors.iconTooLong",

  // ユーザー関連
  [USER_ERROR_MESSAGES.EXISTENCE_CHECK_FAILED]: "users.errors.existenceCheckFailed",

  // ユーザープロバイダー関連
  [USER_PROVIDER_ERROR_MESSAGES.USER_FETCH_FAILED]: "userProviders.errors.userFetchFailed",
  [USER_PROVIDER_ERROR_MESSAGES.PROVIDER_UPDATE_FAILED]:
    "userProviders.errors.providerUpdateFailed",
  [USER_PROVIDER_ERROR_MESSAGES.PROVIDER_DELETE_FAILED]:
    "userProviders.errors.providerDeleteFailed",

  // URL関連
  [URL_ERROR_MESSAGES.URL_ALREADY_EXISTS]: "urlForm.errors.urlAlreadyExists",
  [URL_ERROR_MESSAGES.INVALID_URL]: "urlForm.errors.urlInvalid",
  [URL_ERROR_MESSAGES.URL_REQUIRED]: "urlForm.errors.urlRequired",
  [URL_ERROR_MESSAGES.TITLE_REQUIRED]: "urlForm.errors.titleRequired",
  [URL_ERROR_MESSAGES.TITLE_TOO_LONG]: "urlForm.errors.titleTooLong",
  [URL_ERROR_MESSAGES.INVALID_GENRE]: "urlForm.errors.invalidGenre",
  [URL_ERROR_MESSAGES.URL_NOT_FOUND]: "urlForm.errors.urlNotFound",

  // データベース関連
  [DATABASE_ERROR_MESSAGES.DUPLICATE_DATA_DETECTED]: "common.errors.duplicateDataDetected",
  [DATABASE_ERROR_MESSAGES.REFERENCE_INTEGRITY_ERROR]: "common.errors.referenceIntegrityError",
  [DATABASE_ERROR_MESSAGES.REQUIRED_FIELD_MISSING]: "common.errors.requiredFieldMissing",
  [DATABASE_ERROR_MESSAGES.DATA_CONSTRAINT_VIOLATION]: "common.errors.dataConstraintViolation",
  [DATABASE_ERROR_MESSAGES.DATABASE_ERROR]: "common.errors.databaseError",
};
