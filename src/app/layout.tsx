import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

/**
 * ルートレイアウト
 * ルートURL（/）にアクセスした際に、適切なロケールにリダイレクト
 */
export const metadata: Metadata = {
  title: "MemoLia",
  description: "Organize and store your favorite URLs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // このレイアウトは実際には使用されない
  // ミドルウェアがルートURLを処理する前に呼ばれる可能性があるため、念のため配置
  return <>{children}</>;
}

