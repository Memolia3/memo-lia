import { BookmarkletInstaller } from "@/components/PWA/BookmarkletInstaller";
import { Container } from "@/components/ui";
import { AuthGuard } from "@/features/auth";

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
        <Container maxWidth="7xl" className="h-full overflow-hidden">
          <div className="h-full flex items-center justify-center p-4">
            <BookmarkletInstaller />
          </div>
        </Container>
      </div>
    </AuthGuard>
  );
}
