"use client";

import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { TooltipProps } from "./Tooltip.types";

/**
 * ツールチップコンポーネント
 * ホバー時にツールチップを表示する
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = "top",
  delay = 300,
  children,
  className,
  maxWidth = "200px",
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled) return;

    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
      case "bottom":
        return "top-full left-1/2 transform -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 transform -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 transform -translate-y-1/2 ml-2";
      default:
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case "top":
        return "top-full left-1/2 transform -translate-x-1/2 border-t-gray-900 dark:border-t-gray-100";
      case "bottom":
        return "bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900 dark:border-b-gray-100";
      case "left":
        return "left-full top-1/2 transform -translate-y-1/2 border-l-gray-900 dark:border-l-gray-100";
      case "right":
        return "right-full top-1/2 transform -translate-y-1/2 border-r-gray-900 dark:border-r-gray-100";
      default:
        return "top-full left-1/2 transform -translate-x-1/2 border-t-gray-900 dark:border-t-gray-100";
    }
  };

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            "absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded shadow-lg",
            "whitespace-nowrap",
            getPositionClasses()
          )}
          style={{ maxWidth }}
        >
          {content}

          {/* 矢印 */}
          <div className={cn("absolute w-0 h-0 border-4 border-transparent", getArrowClasses())} />
        </div>
      )}
    </div>
  );
};
