"use client";

import { Icon, Typography } from "@/components/ui";
import { cn } from "@/utils";
import { Folder } from "lucide-react";
import { CategoryFolderProps } from "./CategoryFolder.types";

/**
 * カテゴリフォルダコンポーネント
 * 各カテゴリをフォルダ形式で表示
 */
export const CategoryFolder: React.FC<CategoryFolderProps> = ({ category, onClick, className }) => {
  const handleClick = () => {
    onClick(category);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group relative flex flex-col items-center justify-center",
        "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32",
        "p-4 rounded-xl",
        "bg-white/10 dark:bg-gray-800/10",
        "backdrop-blur-sm border border-white/20 dark:border-gray-700/20",
        "hover:bg-white/20 dark:hover:bg-gray-800/20",
        "hover:scale-105 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        "active:scale-95",
        className
      )}
      aria-label={`${category.name}フォルダを開く`}
    >
      {/* フォルダアイコン */}
      <div className="mb-2">
        {category.icon ? (
          <Icon
            name={category.icon}
            className="w-8 h-8 sm:w-10 sm:h-10 text-primary group-hover:text-primary/80"
          />
        ) : (
          <Folder
            className="w-8 h-8 sm:w-10 sm:h-10 text-primary group-hover:text-primary/80"
            style={{ color: category.color || undefined }}
          />
        )}
      </div>

      {/* フォルダ名 */}
      <Typography
        variant="caption"
        weight="medium"
        className="text-center text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100"
      >
        {category.name}
      </Typography>

      {/* ホバー時の光る効果 */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </button>
  );
};
