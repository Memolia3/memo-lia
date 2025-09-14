/**
 * エラーメッセージ定数
 * サーバーアクションとクライアント側で共有するエラーメッセージ
 */

/**
 * ジャンル関連のエラーメッセージ
 */
export const GENRE_ERROR_MESSAGES = {
  NAME_ALREADY_EXISTS: "このジャンル名は既に使用されています",
  INVALID_CATEGORY: "無効なカテゴリIDです",
  NAME_REQUIRED: "ジャンル名は必須です",
  NAME_TOO_LONG: "ジャンル名は50文字以内で入力してください",
  DESCRIPTION_TOO_LONG: "説明は200文字以内で入力してください",
  USER_ID_NOT_PROVIDED: "ジャンル作成: ユーザーIDが指定されていません",
  INVALID_USER_ID: "ジャンル作成: 無効なユーザーIDです",
  CATEGORY_NOT_FOUND: "カテゴリが見つかりません",
  CREATE_FAILED: "ジャンルの作成に失敗しました",
  INVALID_GENRE: "ジャンル: 無効なジャンルIDです",
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
  DESCRIPTION_TOO_LONG: "説明は500文字以内で入力してください",
  USER_ID_NOT_PROVIDED: "ユーザーIDが指定されていません",
  INVALID_USER_ID: "無効なユーザーIDです",
  INVALID_GENRE: "無効なジャンルIDです",
  CREATE_FAILED: "URLの作成に失敗しました",
  URL_NOT_FOUND: "削除するURLが見つかりません",
} as const;

/**
 * エラーメッセージから国際化キーへのマッピング
 */
export const ERROR_MESSAGE_TO_I18N_KEY_MAP: Record<string, string> = {
  // ジャンル関連
  [GENRE_ERROR_MESSAGES.NAME_ALREADY_EXISTS]: "categoryDetail.genres.errors.nameAlreadyExists",
  [GENRE_ERROR_MESSAGES.INVALID_CATEGORY]: "categoryDetail.genres.errors.invalidCategory",
  [GENRE_ERROR_MESSAGES.NAME_REQUIRED]: "categoryDetail.genres.errors.nameRequired",
  [GENRE_ERROR_MESSAGES.NAME_TOO_LONG]: "categoryDetail.genres.errors.nameTooLong",
  [GENRE_ERROR_MESSAGES.DESCRIPTION_TOO_LONG]: "categoryDetail.genres.errors.descriptionTooLong",
  [GENRE_ERROR_MESSAGES.USER_ID_NOT_PROVIDED]: "categoryDetail.genres.errors.userIdRequired",
  [GENRE_ERROR_MESSAGES.INVALID_USER_ID]: "categoryDetail.genres.errors.invalidUserId",
  [GENRE_ERROR_MESSAGES.CATEGORY_NOT_FOUND]: "categoryDetail.genres.errors.categoryNotFound",
  [GENRE_ERROR_MESSAGES.CREATE_FAILED]: "categoryDetail.genres.errors.createFailed",
  [GENRE_ERROR_MESSAGES.INVALID_GENRE]: "categoryDetail.genres.errors.invalidGenre",

  // URL関連
  [URL_ERROR_MESSAGES.URL_ALREADY_EXISTS]: "urlForm.errors.urlAlreadyExists",
  [URL_ERROR_MESSAGES.INVALID_URL]: "urlForm.errors.urlInvalid",
  [URL_ERROR_MESSAGES.URL_REQUIRED]: "urlForm.errors.urlRequired",
  [URL_ERROR_MESSAGES.TITLE_REQUIRED]: "urlForm.errors.titleRequired",
  [URL_ERROR_MESSAGES.TITLE_TOO_LONG]: "urlForm.errors.titleTooLong",
  [URL_ERROR_MESSAGES.DESCRIPTION_TOO_LONG]: "urlForm.errors.descriptionTooLong",
  [URL_ERROR_MESSAGES.USER_ID_NOT_PROVIDED]: "urlForm.errors.userIdRequired",
  [URL_ERROR_MESSAGES.INVALID_USER_ID]: "urlForm.errors.invalidUserId",
  [URL_ERROR_MESSAGES.INVALID_GENRE]: "urlForm.errors.invalidGenre",
  [URL_ERROR_MESSAGES.CREATE_FAILED]: "urlForm.errors.createFailed",
  [URL_ERROR_MESSAGES.URL_NOT_FOUND]: "genreDetail.urls.notifications.deleteError",
} as const;

/**
 * エラーメッセージから国際化キーを取得するヘルパー関数
 */
export const getI18nKeyFromErrorMessage = (errorMessage: string): string => {
  // 完全一致でマッピングを探す
  if (ERROR_MESSAGE_TO_I18N_KEY_MAP[errorMessage]) {
    return ERROR_MESSAGE_TO_I18N_KEY_MAP[errorMessage];
  }

  // 部分一致でマッピングを探す
  for (const [message, i18nKey] of Object.entries(ERROR_MESSAGE_TO_I18N_KEY_MAP)) {
    if (errorMessage.includes(message)) {
      return i18nKey;
    }
  }

  // デフォルトは作成失敗（URL作成の場合はURL作成失敗）
  return errorMessage.includes("URL")
    ? "urlForm.errors.createFailed"
    : "categoryDetail.genres.errors.createFailed";
};
