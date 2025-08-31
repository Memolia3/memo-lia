import { OAUTH_PROVIDER } from "@/constants";

/**
 * プロバイダーボタンのProps
 */
export interface ProviderButtonProps {
  provider: keyof typeof OAUTH_PROVIDER;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}
