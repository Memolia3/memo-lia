"use client";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/utils";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { NotificationItemProps } from "./NotificationItem.types";

/**
 * 通知のアイコンを取得
 */
const getNotificationIcon = (type: string) => {
  const iconProps = { className: "w-5 h-5" };

  switch (type) {
    case "success":
      return <CheckCircle {...iconProps} className="text-green-500" />;
    case "error":
      return <AlertCircle {...iconProps} className="text-red-500" />;
    case "warning":
      return <AlertTriangle {...iconProps} className="text-yellow-500" />;
    case "info":
    default:
      return <Info {...iconProps} className="text-blue-500" />;
  }
};

/**
 * 通知の背景色を取得
 */
const getNotificationBgColor = (type: string) => {
  switch (type) {
    case "success":
      return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800";
    case "error":
      return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800";
    case "warning":
      return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
    case "info":
    default:
      return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800";
  }
};

/**
 * 通知のアニメーションクラスを取得
 */
const getAnimationClasses = (animation: string, visible: boolean, isAnimating: boolean) => {
  const baseClasses = "transition-all duration-300 ease-in-out transform";

  switch (animation) {
    case "slide":
      return cn(
        baseClasses,
        visible && !isAnimating ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      );
    case "fade":
      return cn(baseClasses, visible && !isAnimating ? "opacity-100" : "opacity-0");
    case "scale":
      return cn(
        baseClasses,
        visible && !isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
      );
    case "bounce":
      return cn(
        baseClasses,
        visible && !isAnimating ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      );
    default:
      // デフォルトは右にスライド＆フェードアウト
      return cn(
        baseClasses,
        visible && !isAnimating ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      );
  }
};

/**
 * 通知アイテムコンポーネント
 */
export const NotificationItem: React.FC<NotificationItemProps> = memo(
  ({ notification, onClose, onAction }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
      // 表示アニメーション
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, 50);

      return () => {
        clearTimeout(showTimer);
      };
    }, []);

    const handleClose = useCallback(() => {
      setIsAnimating(true);
      setIsVisible(false);

      // アニメーション完了後に削除
      setTimeout(() => {
        onClose(notification.id);
      }, 300);
    }, [notification.id, onClose]);

    const handleAction = useCallback(
      (action: () => void) => {
        if (onAction) {
          onAction(action);
        } else {
          action();
        }
      },
      [onAction]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === "Escape" && notification.closable) {
          handleClose();
        }
      },
      [handleClose, notification.closable]
    );

    const bgColor = getNotificationBgColor(notification.type);
    const animationClasses = getAnimationClasses(
      notification.animation || "slide",
      isVisible,
      isAnimating
    );
    const icon = notification.icon || getNotificationIcon(notification.type);

    return (
      <div
        className={cn(
          "relative w-full max-w-sm p-4 rounded-lg border shadow-lg backdrop-blur-sm",
          bgColor,
          animationClasses,
          notification.className
        )}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        aria-label={`${notification.type} : ${notification.message}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* 閉じるボタン */}
        {notification.closable && (
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* 通知内容 */}
        <div className="flex items-start space-x-3 pr-6">
          {/* アイコン */}
          <div className="flex-shrink-0 mt-0.5">{icon}</div>

          {/* テキスト内容 */}
          <div className="flex-1 min-w-0">
            {notification.title && (
              <Typography
                variant="body"
                weight="semibold"
                className="text-gray-900 dark:text-gray-100 mb-1"
              >
                {notification.title}
              </Typography>
            )}

            <Typography variant="body" className="text-gray-700 dark:text-gray-300 mb-2">
              {notification.message}
            </Typography>

            {notification.description && (
              <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                {notification.description}
              </Typography>
            )}

            {/* アクションボタン */}
            {notification.actions && notification.actions.length > 0 && (
              <div className="flex space-x-2 mt-3">
                {notification.actions.map((action, index) => (
                  <Button
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${notification.id}-action-${index}`}
                    variant={action.variant || "ghost"}
                    size="sm"
                    onClick={() => handleAction(action.action)}
                    className="text-xs"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* プログレスバー（自動削除の場合） */}
        {(notification.duration ?? 0) > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10 rounded-b-lg overflow-hidden">
            <div
              className="h-full bg-current opacity-30 animate-pulse"
              style={{
                animationDuration: `${notification.duration ?? 0}ms`,
              }}
            />
          </div>
        )}
      </div>
    );
  }
);

NotificationItem.displayName = "NotificationItem";
