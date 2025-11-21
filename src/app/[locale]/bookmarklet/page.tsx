import { BookmarkletInstaller } from "@/components/PWA/BookmarkletInstaller";
import { Container } from "@/components/ui";
import { AuthGuard } from "@/features/auth";
import { generateMetadata as generateMeta, generateViewport, isLocaleEnglish } from "@/utils/meta";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = isLocaleEnglish(locale);

  return generateMeta(locale, {
    title: isEn ? "Bookmarklet Installation" : "ブックマークレットのインストール",
    description: isEn
      ? "Install the MemoLia bookmarklet to save URLs easily."
      : "MemoLiaのブックマークレットをインストールして、簡単にURLを保存しましょう。",
    url: "/bookmarklet",
  });
}

/**
 * Viewport設定を生成
 */
export const viewport = generateViewport();

export default async function BookmarkletPage() {
  return (
    <AuthGuard>
      {/* PC画面 */}
      <div className="hidden lg:block h-full">
        <Container padding="md" maxWidth="7xl" className="h-full overflow-hidden">
          <div className="h-full flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <BookmarkletInstaller />
            </div>
          </div>
        </Container>
      </div>
      {/* スマホ画面 */}
      <div className="block lg:hidden h-full">
        <Container maxWidth="7xl" className="h-full">
          <div className="h-full flex items-center justify-center p-4">
            <BookmarkletInstaller />
          </div>
        </Container>
      </div>
    </AuthGuard>
  );
}
