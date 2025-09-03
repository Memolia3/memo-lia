"use client";

import { useNotificationStore } from "@/lib/notification/store";
import { NotificationContextType } from "@/types/notification";
import { createContext, ReactNode } from "react";
import { NotificationContainer } from "./NotificationContainer";

/**
 * 通知コンテキスト
 */
const NotificationContext = createContext<NotificationContextType | null>(null);

/**
 * 通知プロバイダーのプロパティ
 */
interface NotificationProviderProps {
  children: ReactNode;
}

/**
 * 通知プロバイダーコンポーネント
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <NotificationContainer />
    </>
  );
};

/**
 * 通知フック（直接ストアを使用）
 */
export const useNotification = (): NotificationContextType => {
  // 直接ストアの関数を取得
  const addNotification = useNotificationStore(state => state.addNotification);
  const removeNotification = useNotificationStore(state => state.removeNotification);
  const updateNotification = useNotificationStore(state => state.updateNotification);
  const clearAllNotifications = useNotificationStore(state => state.clearAllNotifications);
  const clearGroupNotifications = useNotificationStore(state => state.clearGroupNotifications);
  const getNotifications = useNotificationStore(state => state.getNotifications);
  const updateDefaults = useNotificationStore(state => state.updateDefaults);

  return {
    addNotification,
    removeNotification,
    updateNotification,
    clearAllNotifications,
    clearGroupNotifications,
    getNotifications,
    updateConfig: updateDefaults,
  };
};
