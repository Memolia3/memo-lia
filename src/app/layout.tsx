import type { Metadata } from "next";

/**
 * ルートレイアウト
 * ルートURL（/）にアクセスした際に、next-intlのミドルウェアが適切なロケールにリダイレクト
 */
export const metadata: Metadata = {
  title: "MemoLia",
  description: "Organize and store your favorite URLs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // このレイアウトは実際には使用されない
  // ミドルウェアがルートURLを処理する前に呼ばれる可能性があるため、念のため配置
  return <>{children}</>;
}
