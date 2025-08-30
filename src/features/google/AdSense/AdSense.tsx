import { cn } from "@/utils/cn";
import { AdSenseProps } from "./AdSense.types";

/**
 * AdSense広告コンポーネント
 * @param className - クラス名
 * @param adSlot - AdSenseスロットID
 * @param adFormat - AdSense広告フォーマット
 * @param responsive - レスポンシブモードかどうか
 * @param style - スタイル
 */
export const AdSense: React.FC<AdSenseProps> = ({
  className,
  adSlot,
  adFormat = "auto",
  responsive = true,
  style,
}) => {
  return (
    <div
      className={cn(
        "w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden",
        "flex items-center justify-center min-h-[90px]",
        responsive && "responsive",
        className
      )}
      style={style}
    >
      {/* AdSense広告ユニット */}
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          textAlign: "center",
          ...(adFormat === "banner" && { height: "90px", width: "728px" }),
          ...(adFormat === "rectangle" && { height: "250px", width: "300px" }),
        }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // 実際のAdSenseクライアントIDに置き換え
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive}
      />

      {/* 開発環境用のプレースホルダー */}
      <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
          <span>Google AdSense</span>
        </div>
        <div className="text-xs mt-1">
          {adFormat === "banner"
            ? "728x90 Banner"
            : adFormat === "rectangle"
              ? "300x250 Rectangle"
              : "Responsive Ad"}
        </div>
      </div>
    </div>
  );
};
