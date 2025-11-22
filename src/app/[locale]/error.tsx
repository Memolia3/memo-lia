"use client";

import { Button } from "@/components/ui/Button";
import { GlassBackground } from "@/components/ui/GlassBackground";
import { Typography } from "@/components/ui/Typography";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errorBoundary");
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <GlassBackground
        className="max-w-md w-full p-8 flex flex-col items-center text-center space-y-6"
        variant="intense"
        blur="lg"
        borderRadius="lg"
        enableScale={false}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse" />
          <AlertTriangle className="w-16 h-16 text-red-500 relative z-10" />
        </div>

        <div className="space-y-2">
          <Typography variant="h2" className="text-white font-bold tracking-tight">
            {t("title")}
          </Typography>
          <Typography variant="body" className="text-gray-300">
            {t("message")}
          </Typography>
          <Typography variant="caption" className="text-gray-400 block mt-2">
            {t("helpText")}
          </Typography>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="w-full bg-black/30 rounded-md p-4 text-left overflow-hidden">
            <Typography variant="caption" className="text-red-400 font-mono text-xs break-all">
              {t("details")} {error.message}
            </Typography>
            {error.digest && (
              <Typography variant="caption" className="text-gray-500 font-mono text-xs mt-1 block">
                Digest: {error.digest}
              </Typography>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
          <Button
            onClick={reset}
            variant="primary"
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white border-none shadow-lg shadow-red-900/20"
          >
            <RefreshCw className="w-4 h-4" />
            {t("retryButton")}
          </Button>

          <Button
            onClick={() => window.location.reload()}
            variant="secondary"
            className="flex-1 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {t("reloadButton")}
          </Button>
        </div>

        <Button
          onClick={() => router.push("/")}
          variant="ghost"
          className="text-gray-400 hover:text-white hover:bg-white/10 w-full"
        >
          <Home className="w-4 h-4 mr-2" />
          {t("backToTop") || "トップページに戻る"}
        </Button>
      </GlassBackground>
    </div>
  );
}
