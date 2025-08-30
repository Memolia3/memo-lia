/**
 * グラスモーフィズム効果を持つバックグラウンドコンポーネントのProps
 */
export interface GlassBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "subtle" | "intense";
  blur?: "sm" | "md" | "lg";
  opacity?: number;
  borderRadius?: "none" | "sm" | "md" | "lg" | "full";
  backdrop?: boolean;
}
