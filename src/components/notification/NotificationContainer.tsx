"use client";

import { useNotificationStore } from "@/lib/notification/store";
import { cn } from "@/utils";
import { memo, useMemo } from "react";
import { NotificationItem } from "./NotificationItem";

/**
 * 通知コンテナの位置クラスを取得
 */
const getPositionClasses = (position: string) => {
  switch (position) {
    case "top-left":
      return "top-4 left-4";
    case "top-right":
      return "top-4 right-4";
    case "top-center":
      return "top-4 left-1/2 transform -translate-x-1/2";
    case "bottom-left":
      return "bottom-4 left-4";
    case "bottom-right":
      return "bottom-4 right-4";
    case "bottom-center":
      return "bottom-4 left-1/2 transform -translate-x-1/2";
    default:
      return "bottom-4 right-4";
  }
};

/**
 * 通知コンテナのスタイルを取得
 */
const getContainerStyles = (position: string) => {
  const baseClasses = "fixed z-50 flex flex-col space-y-2 pointer-events-none";
  const positionClasses = getPositionClasses(position);

  return cn(baseClasses, positionClasses);
};

/**
 * 通知コンテナコンポーネント
 */
export const NotificationContainer: React.FC = memo(() => {
  // 直接ストアから状態を取得（セレクターを使わない）
  const notifications = useNotificationStore(state => state.notifications);
  const position = useNotificationStore(state => state.position);
  const removeNotification = useNotificationStore(state => state.removeNotification);

  // 表示中の通知のみをフィルタリング（メモ化）
  const visibleNotifications = useMemo(() => notifications.filter(n => n.visible), [notifications]);

  const containerClasses = getContainerStyles(position);

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className={containerClasses}>
      {visibleNotifications.map(notification => (
        <div
          key={notification.id}
          className="pointer-events-auto"
          style={{
            zIndex: 50 + (visibleNotifications.length - visibleNotifications.indexOf(notification)),
          }}
        >
          <NotificationItem notification={notification} onClose={removeNotification} />
        </div>
      ))}
    </div>
  );
});

NotificationContainer.displayName = "NotificationContainer";
