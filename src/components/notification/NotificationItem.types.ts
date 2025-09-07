import { NotificationState } from "@/types/notification";

/**
 * 通知アイテムのプロパティ
 */
export interface NotificationItemProps {
  notification: NotificationState;
  onClose: (id: string) => void;
  onAction?: (action: () => void) => void;
}
