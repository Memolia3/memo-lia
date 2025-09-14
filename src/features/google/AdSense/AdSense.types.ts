/**
 * AdSense広告コンポーネントのProps
 * @param className - クラス名
 * @param adSlot - AdSenseスロットID
 * @param adFormat - AdSense広告フォーマット
 * @param responsive - レスポンシブモードかどうか
 * @param style - スタイル
 */
export interface AdSenseProps {
  className?: string;
  adSlot: string;
  adFormat?: "auto" | "fluid" | "rectangle" | "banner";
  responsive?: boolean;
  style?: React.CSSProperties;
}
