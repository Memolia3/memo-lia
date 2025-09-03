/**
 * 通知システムのデバッグ機能
 */

import { useNotificationStore } from "./store";

/**
 * 通知のデバッグ情報を取得
 */
export const getNotificationDebugInfo = () => {
  const state = useNotificationStore.getState();

  return {
    totalNotifications: state.notifications.length,
    visibleNotifications: state.notifications.filter(n => n.visible).length,
    maxNotifications: state.maxNotifications,
    position: state.position,
    defaults: state.defaults,
    notifications: state.notifications.map(n => ({
      id: n.id,
      type: n.type,
      message: n.message,
      visible: n.visible,
      createdAt: n.createdAt,
      priority: n.priority,
      duration: n.duration,
    })),
  };
};

/**
 * 通知のデバッグ情報をコンソールに出力
 */
export const logNotificationDebugInfo = () => {
  if (process.env.NODE_ENV === "development") {
    const debugInfo = getNotificationDebugInfo();
    console.group("🔔 Notification Debug Info");
    console.log("Total Notifications:", debugInfo.totalNotifications);
    console.log("Visible Notifications:", debugInfo.visibleNotifications);
    console.log("Max Notifications:", debugInfo.maxNotifications);
    console.log("Position:", debugInfo.position);
    console.log("Defaults:", debugInfo.defaults);
    console.log("Notifications:", debugInfo.notifications);
    console.groupEnd();
  }
};

/**
 * 通知のパフォーマンス統計を取得
 */
export const getNotificationPerformanceStats = () => {
  const state = useNotificationStore.getState();

  const now = new Date();
  const recentNotifications = state.notifications.filter(
    n => now.getTime() - n.createdAt.getTime() < 60000 // 1分以内
  );

  return {
    recentCount: recentNotifications.length,
    averageDuration:
      recentNotifications.reduce((sum, n) => sum + (n.duration || 0), 0) /
        recentNotifications.length || 0,
    typeDistribution: recentNotifications.reduce(
      (acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
  };
};
