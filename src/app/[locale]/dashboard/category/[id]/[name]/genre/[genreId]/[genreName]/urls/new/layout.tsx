import { Background } from "@/components/ui";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function UrlAddLayout({ children }: LayoutProps) {
  return <Background className="min-h-screen">{children}</Background>;
}
