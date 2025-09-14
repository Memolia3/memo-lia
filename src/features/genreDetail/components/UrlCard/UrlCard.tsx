"use client";

import { Typography } from "@/components/ui";
import { cn } from "@/utils";
import { ExternalLink, Globe, MoreVertical, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { UrlCardProps } from "./UrlCard.types";

export const UrlCard: React.FC<UrlCardProps> = ({ url, onClick, onDelete, className }) => {
  const t = useTranslations("genreDetail.urls.actions");
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleClick = () => {
    onClick(url);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    setShowMenu(false);

    if (onDelete) {
      onDelete(url.id);
    }

    setIsDeleting(false);
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative flex flex-col cursor-pointer",
        "w-full",
        "p-4 rounded-xl",
        "bg-white dark:bg-gray-800",
        "border border-gray-200 dark:border-gray-700",
        "shadow-sm hover:shadow-lg",
        "hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/40 dark:hover:to-indigo-900/40",
        "hover:border-blue-400 dark:hover:border-blue-500",
        "hover:border-l-4 hover:border-l-blue-500",
        "hover:scale-[1.02] transition-all duration-300 ease-out",
        "transform",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
        "active:scale-[0.98]",
        className
      )}
      aria-label={`${url.title}を開く`}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* コンテンツエリア */}
      <div className="flex items-start gap-3">
        {/* Favicon */}
        <div className="flex-shrink-0">
          {url.faviconUrl ? (
            <Image
              src={url.faviconUrl}
              alt={`${url.title} favicon`}
              width={32}
              height={32}
              className="w-8 h-8 rounded object-cover group-hover:scale-110 transition-transform duration-300"
              onError={e => {
                // ファビコン読み込み失敗時のフォールバック
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.nextElementSibling?.setAttribute("style", "display: block;");
              }}
            />
          ) : null}
          <Globe
            className={cn(
              "w-8 h-8 text-blue-500 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300",
              url.faviconUrl ? "hidden" : "block"
            )}
            style={{ display: url.faviconUrl ? "none" : "block" }}
          />
        </div>

        {/* テキストコンテンツ */}
        <div className="flex-1 min-w-0">
          {/* タイトル */}
          <Typography
            variant="body"
            weight="semibold"
            className="text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300 mb-1 line-clamp-2"
          >
            {url.title}
          </Typography>

          {/* 説明 */}
          {url.description && (
            <Typography variant="caption" color="muted" className="line-clamp-2 leading-relaxed">
              {url.description}
            </Typography>
          )}

          {/* URL */}
          <Typography variant="caption" color="muted" className="mt-1 opacity-75 truncate">
            {url.url}
          </Typography>
        </div>
      </div>

      {/* メニューボタン */}
      <div
        ref={menuRef}
        className="absolute top-2 right-2 opacity-100 transition-opacity duration-200"
      >
        <button
          onClick={handleMenuClick}
          className="p-1.5 rounded-full bg-white dark:bg-gray-700 shadow-sm hover:shadow-md hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all duration-200 border border-gray-200 dark:border-gray-600"
          aria-label="URLメニューを開く"
        >
          <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200" />
        </button>

        {/* ドロップダウンメニュー */}
        {showMenu && (
          <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <div className="flex">
              <button
                onClick={handleExternalLink}
                className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-l-lg flex items-center gap-2 whitespace-nowrap transition-all duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                {t("open")}
              </button>
              {onDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-r-lg flex items-center gap-2 disabled:opacity-50 whitespace-nowrap transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? t("deleting") : t("delete")}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
