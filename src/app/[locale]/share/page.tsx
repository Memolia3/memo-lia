import { Container } from "@/components/ui";
import { AuthGuard } from "@/features/auth";
import { ShareDesktop } from "./ShareDesktop";
import { ShareMobile } from "./ShareMobile";

interface SharePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SharePage({ params, searchParams }: SharePageProps) {
  const { locale } = await params;
  const searchParamsData = await searchParams;

  const sharedData = {
    title: searchParamsData.title as string,
    text: searchParamsData.text as string,
    url: searchParamsData.url as string,
  };

  return (
    <AuthGuard isSharePage={true}>
      {/* PC画面 */}
      <div className="hidden lg:block h-full">
        <Container padding="md" maxWidth="7xl" className="h-full overflow-hidden">
          <ShareDesktop locale={locale} sharedData={sharedData} />
        </Container>
      </div>
      {/* スマホ画面 */}
      <div className="block lg:hidden h-full">
        <Container maxWidth="7xl" className="h-full overflow-hidden">
          <ShareMobile locale={locale} sharedData={sharedData} />
        </Container>
      </div>
    </AuthGuard>
  );
}
