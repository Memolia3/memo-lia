"use client";

import { UrlMetadataOptions, UrlMetadataState } from "@/types/url-metadata";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

/**
 * URLメタデータを取得するカスタムフック
 */
export function useUrlMetadata(
  url: string,
  options: UrlMetadataOptions = {}
): UrlMetadataState & {
  fetchMetadata: () => Promise<void>;
  clearMetadata: () => void;
} {
  const { autoFetch = true, debounceMs = 500 } = options;
  const t = useTranslations("urlForm");

  const [state, setState] = useState<UrlMetadataState>({
    metadata: null,
    isLoading: false,
    error: null,
  });

  const fetchMetadata = useCallback(async () => {
    if (!url?.trim()) {
      setState({ metadata: null, isLoading: false, error: null });
      return;
    }

    // URLの基本的な検証
    try {
      new URL(url);
    } catch {
      setState({ metadata: null, isLoading: false, error: t("errors.urlInvalid") });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("/api/urls/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const metadata = await response.json();
        setState({
          metadata,
          isLoading: false,
          error: null,
        });
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: t("errors.metadataFailed") }));
        setState({
          metadata: null,
          isLoading: false,
          error: errorData.error || t("errors.metadataFailed"),
        });
      }
    } catch (error) {
      setState({
        metadata: null,
        isLoading: false,
        error: error instanceof Error ? error.message : t("errors.metadataFailed"),
      });
    }
  }, [url, t]);

  const clearMetadata = useCallback(() => {
    setState({ metadata: null, isLoading: false, error: null });
  }, []);

  // デバウンス付きの自動取得
  useEffect(() => {
    if (!autoFetch || !url?.trim()) return;

    const timeoutId = setTimeout(() => {
      fetchMetadata();
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [url, autoFetch, debounceMs, fetchMetadata]);

  return {
    ...state,
    fetchMetadata,
    clearMetadata,
  };
}
