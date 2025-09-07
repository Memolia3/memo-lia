"use client";

import { Icon, Typography } from "@/components/ui";
import { cn, truncateText } from "@/utils";
import { Folder, MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GenreFolderProps } from "../GenreFolder.types";

export const GenreFolder: React.FC<GenreFolderProps> = ({
  genre,
  onClick,
  className,
  onDelete,
}) => {
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
    onClick(genre);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);

    if (isDeleting) return;

    try {
      setIsDeleting(true);

      // TODO: ジャンル削除の実装
      console.log("Delete genre:", genre.id);

      if (onDelete) {
        onDelete(genre.id);
      }
    } catch (error) {
      console.error("Error deleting genre:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative flex flex-col items-center justify-center cursor-pointer",
        "w-[120px] h-[120px] aspect-square",
        "p-2 sm:p-3 rounded-xl",
        "bg-white/10 dark:bg-gray-800/10",
        "backdrop-blur-sm border border-white/20 dark:border-gray-700/20",
        "hover:bg-white/20 dark:hover:bg-gray-800/20",
        "hover:scale-105 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        "active:scale-95",
        className
      )}
      style={{
        width: "120px",
        height: "120px",
        aspectRatio: "1 / 1",
      }}
      aria-label={`${genre.name}ジャンルを開く`}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* ジャンルアイコン */}
      <div className="mb-1">
        {genre.icon ? (
          <Icon
            name={genre.icon}
            className="w-12 h-12 text-primary group-hover:text-primary/80 aspect-square"
          />
        ) : (
          <Folder
            className="w-12 h-12 text-primary group-hover:text-primary/80 aspect-square"
            style={{ color: genre.color || undefined }}
          />
        )}
      </div>

      {/* ジャンル名 */}
      <Typography
        variant="caption"
        weight="medium"
        className="text-center text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100"
      >
        {truncateText(genre.name)}
      </Typography>

      {/* ホバー時の光る効果 */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* メニューボタン */}
      <button
        onClick={handleMenuClick}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
        aria-label="メニューを開く"
      >
        <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-300" />
      </button>

      {/* メニュー - 右側に表示 */}
      {showMenu && (
        <div
          ref={menuRef}
          className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[140px]"
          style={{
            zIndex: 99999,
            top: "50%",
            right: "20px",
            transform: "translateY(-50%)",
          }}
        >
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {isDeleting ? "削除中..." : "削除"}
          </button>
        </div>
      )}
    </div>
  );
};
