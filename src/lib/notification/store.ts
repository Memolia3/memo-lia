import {
  NotificationConfig,
  NotificationDefaults,
  NotificationPosition,
  NotificationState,
} from "@/types/notification";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

/**
 * 通知ストアの状態
 */
interface NotificationStoreState {
  /** 通知の一覧 */
  notifications: NotificationState[];
  /** デフォルト設定 */
  defaults: NotificationDefaults;
  /** 最大表示数 */
  maxNotifications: number;
  /** 通知の位置 */
  position: NotificationPosition;
}

/**
 * 通知ストアのアクション
 */
interface NotificationStoreActions {
  /** 通知を追加 */
  addNotification: (config: NotificationConfig) => string;
  /** 通知を取得 */
  getNotifications: () => NotificationState[];
  /** 通知を削除 */
  removeNotification: (id: string) => void;
  /** 通知を更新 */
  updateNotification: (id: string, config: Partial<NotificationConfig>) => void;
  /** すべての通知をクリア */
  clearAllNotifications: () => void;
  /** グループの通知をクリア */
  clearGroupNotifications: (group: string) => void;
  /** 通知の設定を更新 */
  updateDefaults: (config: Partial<NotificationDefaults>) => void;
  /** 通知の位置を更新 */
  updatePosition: (position: NotificationPosition) => void;
  /** 最大表示数を更新 */
  updateMaxNotifications: (max: number) => void;
}

/**
 * 通知ストアの型
 */
type NotificationStore = NotificationStoreState & NotificationStoreActions;

/**
 * 一意のIDを生成
 */
const generateId = (): string => {
  return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 通知のデフォルト設定
 */
const defaultConfig: NotificationDefaults = {
  duration: 5000,
  closable: true,
  position: "bottom-right",
  animation: "slide",
  severity: "medium",
};

/**
 * 通知ストア
 */
export const useNotificationStore = create<NotificationStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // 初期状態
      notifications: [],
      defaults: defaultConfig,
      maxNotifications: 5,
      position: "bottom-right",

      // 通知を追加
      addNotification: (config: NotificationConfig) => {
        const id = config.id || generateId();
        const defaults = get().defaults;

        const notification: NotificationState = {
          id,
          type: config.type,
          severity: config.severity || defaults.severity,
          title: config.title,
          message: config.message,
          description: config.description,
          duration: config.duration ?? defaults.duration,
          closable: config.closable ?? defaults.closable,
          position: config.position || defaults.position,
          animation: config.animation || defaults.animation,
          actions: config.actions,
          icon: config.icon,
          className: config.className,
          group: config.group,
          priority: config.priority || 0,
          createdAt: new Date(),
          visible: true,
          animating: false,
        };

        set(state => {
          const newNotifications = [...state.notifications, notification]
            .sort((a, b) => {
              // 優先度でソート（高い優先度が先）
              const priorityDiff = (b.priority || 0) - (a.priority || 0);
              if (priorityDiff !== 0) return priorityDiff;

              // 同じ優先度の場合は作成日時でソート（新しいものが先）
              return b.createdAt.getTime() - a.createdAt.getTime();
            })
            .slice(0, state.maxNotifications);

          return {
            notifications: newNotifications,
          };
        });

        // 自動削除のタイマーを設定
        if (notification.duration && notification.duration > 0) {
          setTimeout(() => {
            const currentNotifications = get().notifications;
            if (currentNotifications.some(n => n.id === id)) {
              get().removeNotification(id);
            }
          }, notification.duration);
        }

        return id;
      },

      // 通知を取得
      getNotifications: () => {
        return get().notifications;
      },

      // 通知を削除
      removeNotification: (id: string) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },

      // 通知を更新
      updateNotification: (id: string, config: Partial<NotificationConfig>) => {
        set(state => ({
          notifications: state.notifications.map(n => (n.id === id ? { ...n, ...config } : n)),
        }));
      },

      // すべての通知をクリア
      clearAllNotifications: () => {
        set({ notifications: [] });
      },

      // グループの通知をクリア
      clearGroupNotifications: (group: string) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.group !== group),
        }));
      },

      // デフォルト設定を更新
      updateDefaults: (config: Partial<NotificationDefaults>) => {
        set(state => ({
          defaults: { ...state.defaults, ...config },
        }));
      },

      // 位置を更新
      updatePosition: (position: NotificationPosition) => {
        set({ position });
      },

      // 最大表示数を更新
      updateMaxNotifications: (max: number) => {
        set(state => ({
          maxNotifications: max,
          notifications: state.notifications.slice(0, max),
        }));
      },
    })),
    {
      name: "notification-store",
    }
  )
);

// セレクターは削除（直接ストアアクセスを使用）

// デバッグ用のエクスポート（開発環境のみ）
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).__NOTIFICATION_DEBUG__ = {
    store: useNotificationStore,
  };
}
