/**
 * 通知の種類
 */
export type NotificationType = "success" | "error" | "warning" | "info";

/**
 * 通知の重要度
 */
export type NotificationSeverity = "low" | "medium" | "high" | "critical";

/**
 * 通知の位置
 */
export type NotificationPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

/**
 * 通知のアニメーション
 */
export type NotificationAnimation = "slide" | "fade" | "scale" | "bounce";

/**
 * 通知のアクション
 */
export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: "primary" | "secondary" | "ghost";
}

/**
 * 通知の設定
 */
export interface NotificationConfig {
  /** 通知の種類 */
  type: NotificationType;
  /** 通知の重要度 */
  severity?: NotificationSeverity;
  /** 通知のタイトル */
  title?: string;
  /** 通知のメッセージ */
  message: string;
  /** 通知の詳細説明 */
  description?: string;
  /** 自動で閉じるまでの時間（ミリ秒） */
  duration?: number;
  /** 手動で閉じることができるか */
  closable?: boolean;
  /** 通知の位置 */
  position?: NotificationPosition;
  /** アニメーション */
  animation?: NotificationAnimation;
  /** アクションボタン */
  actions?: NotificationAction[];
  /** カスタムアイコン */
  icon?: React.ReactNode;
  /** カスタムクラス名 */
  className?: string;
  /** 通知のID（重複チェック用） */
  id?: string;
  /** 通知のグループ */
  group?: string;
  /** 通知の優先度（数値が大きいほど優先） */
  priority?: number;
}

/**
 * 通知の状態
 */
export interface NotificationState extends NotificationConfig {
  /** 通知の一意ID */
  id: string;
  /** 作成日時 */
  createdAt: Date;
  /** 表示状態 */
  visible: boolean;
  /** アニメーション状態 */
  animating: boolean;
}

/**
 * 通知コンテキストの型
 */
export interface NotificationContextType {
  /** 通知を追加 */
  addNotification: (config: NotificationConfig) => string;
  /** 通知を削除 */
  removeNotification: (id: string) => void;
  /** 通知を更新 */
  updateNotification: (id: string, config: Partial<NotificationConfig>) => void;
  /** すべての通知をクリア */
  clearAllNotifications: () => void;
  /** グループの通知をクリア */
  clearGroupNotifications: (group: string) => void;
  /** 通知の一覧を取得 */
  getNotifications: () => NotificationState[];
  /** 通知の設定を更新 */
  updateConfig: (config: Partial<NotificationDefaults>) => void;
}

/**
 * 通知のデフォルト設定
 */
export interface NotificationDefaults {
  duration: number;
  closable: boolean;
  position: NotificationPosition;
  animation: NotificationAnimation;
  severity: NotificationSeverity;
}

/**
 * エラー通知の設定
 */
export interface ErrorNotificationConfig extends Omit<NotificationConfig, "type"> {
  type: "error";
  /** エラーの詳細 */
  error?: Error | unknown;
  /** エラーのスタックトレースを表示するか */
  showStackTrace?: boolean;
  /** エラーのカテゴリ */
  category?:
    | "network"
    | "validation"
    | "authentication"
    | "authorization"
    | "server"
    | "client"
    | "timeout"
    | "unknown";
}

/**
 * 成功通知の設定
 */
export interface SuccessNotificationConfig extends Omit<NotificationConfig, "type"> {
  type: "success";
  /** 成功のカテゴリ */
  category?:
    | "save"
    | "delete"
    | "update"
    | "create"
    | "login"
    | "auto-login"
    | "logout"
    | "upload"
    | "download"
    | "other";
}
