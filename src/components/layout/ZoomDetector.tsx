"use client";

import { initZoomDetection } from "@/utils/zoom-detector";
import { useEffect } from "react";

/**
 * 拡大率検出コンポーネント
 * ブラウザの拡大率を検出して適切なクラスをbodyに追加
 */
export const ZoomDetector: React.FC = () => {
  useEffect(() => {
    // 拡大率検出を初期化
    initZoomDetection();
  }, []);

  return null; // このコンポーネントは何も表示しない
};
