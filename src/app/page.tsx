import { routing } from "@/i18n/routing";
import { redirect } from "next/navigation";

/**
 * ルートページ
 * next-intlのミドルウェアがルートURL（/）を処理する前に、
 * このページが呼ばれる可能性があるため、デフォルトロケールにリダイレクト
 *
 * 注意: localePrefix: "as-needed"の設定により、デフォルトロケール（en）の場合は
 * URLにプレフィックスを付けずに処理されるはずだが、Next.jsのApp Routerの構造上、
 * /[locale]/page.tsxにマッチさせるため、/enにリダイレクトする必要がある
 */
export default function RootPage() {
  // デフォルトロケールにリダイレクト
  // ミドルウェアがAccept-Languageヘッダーに基づいて適切なロケールを検出し、
  // 必要に応じて/jaにリダイレクトする
  redirect(`/${routing.defaultLocale}`);
}
