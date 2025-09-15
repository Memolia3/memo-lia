import { ReactNode } from "react";

export interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  isSharePage?: boolean;
}
