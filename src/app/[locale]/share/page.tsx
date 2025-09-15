import { Container } from "@/components/ui";
import { AuthGuard } from "@/features/auth";
import {
  checkRateLimit,
  getClientIP,
  validateAndSanitizeShareData,
  validateReferer,
  validateUserAgent,
} from "@/features/share";
import { ShareDesktop } from "./ShareDesktop";
import { ShareMobile } from "./ShareMobile";

interface SharePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SharePage({ params, searchParams }: SharePageProps) {
  const { locale } = await params;
  const searchParamsData = await searchParams;

  // ヘッダー情報の取得
  const headers = await import("next/headers").then(m => m.headers());

  // セキュリティ検証
  const ip = getClientIP(headers);

  // レート制限チェック
  if (!checkRateLimit(ip)) {
    return (
      <AuthGuard isSharePage={true}>
        <Container className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Rate Limited</h2>
            <p className="text-gray-600">Too many requests. Please try again later.</p>
            <script
              dangerouslySetInnerHTML={{
                __html: `alert("Debug: Rate limit failed for IP: ${ip}");`,
              }}
            />
          </div>
        </Container>
      </AuthGuard>
    );
  }

  // リファラーの検証（CSRF対策）
  if (!validateReferer(headers)) {
    const referer = headers.get("referer");
    return (
      <AuthGuard isSharePage={true}>
        <Container className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-600">Invalid referer or suspicious request.</p>
            <script
              dangerouslySetInnerHTML={{
                __html: `alert("Debug: Referer validation failed. Referer: ${referer || "None"}");`,
              }}
            />
          </div>
        </Container>
      </AuthGuard>
    );
  }

  // User-Agentの検証（ボット対策）
  const userAgent = headers.get("user-agent");
  if (!validateUserAgent(userAgent)) {
    return (
      <AuthGuard isSharePage={true}>
        <Container className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-600">Invalid user agent.</p>
            <script
              dangerouslySetInnerHTML={{
                __html: `alert("Debug: User-Agent validation failed. User-Agent: ${userAgent || "None"}");`,
              }}
            />
          </div>
        </Container>
      </AuthGuard>
    );
  }

  // 入力データの検証とサニタイズ
  const rawUrl = searchParamsData.url as string;
  const rawTitle = searchParamsData.title as string;
  const rawText = searchParamsData.text as string;

  const validationResult = validateAndSanitizeShareData(rawUrl, rawTitle, rawText);

  if (!validationResult.isValid) {
    return (
      <AuthGuard isSharePage={true}>
        <Container className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">
              {validationResult.errorMessage === "Missing URL parameter"
                ? "Missing URL"
                : validationResult.errorMessage === "Invalid URL or contains dangerous content"
                  ? "Invalid URL"
                  : "Security Error"}
            </h2>
            <p className="text-gray-600">
              {validationResult.errorMessage === "Missing URL parameter"
                ? "URL parameter is required."
                : validationResult.errorMessage === "Invalid URL or contains dangerous content"
                  ? "The provided URL is not valid or contains dangerous content."
                  : "URL failed security validation."}
            </p>
            <script
              dangerouslySetInnerHTML={{
                __html: `alert("Debug: Validation failed\\nURL: ${rawUrl || "None"}\\nTitle: ${rawTitle || "None"}\\nError: ${validationResult.errorMessage}");`,
              }}
            />
          </div>
        </Container>
      </AuthGuard>
    );
  }

  const sharedData = validationResult.data!;

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
