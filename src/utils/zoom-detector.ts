/**
 * 拡大率検出ユーティリティ
 * ブラウザの拡大率を検出して適切なクラスを追加
 */

export const detectZoomLevel = (): number => {
  if (typeof window === "undefined") return 100;

  // 方法1: window.devicePixelRatioを使用
  if (window.devicePixelRatio) {
    const zoom = Math.round(window.devicePixelRatio * 100);
    return zoom;
  }

  // 方法2: 要素のサイズ比較
  try {
    const testElement = document.createElement("div");
    testElement.style.width = "100px";
    testElement.style.height = "100px";
    testElement.style.position = "absolute";
    testElement.style.top = "-9999px";
    testElement.style.visibility = "hidden";
    testElement.style.pointerEvents = "none";

    document.body.appendChild(testElement);
    const rect = testElement.getBoundingClientRect();
    const zoom = Math.round((rect.width / 100) * 100);
    document.body.removeChild(testElement);

    return zoom;
  } catch {
    // 要素サイズ検出に失敗した場合は次の方法を試す
  }

  // 方法3: ビューポートのサイズ比較
  try {
    const zoom = Math.round((window.outerWidth / window.innerWidth) * 100);
    return zoom;
  } catch {
    // ビューポートサイズ検出に失敗した場合はデフォルト値を返す
  }

  return 100; // デフォルト値
};

export const applyZoomClasses = (): void => {
  if (typeof window === "undefined") return;

  const zoomLevel = detectZoomLevel();
  const body = document.body;

  // 既存のクラスを削除
  body.classList.remove("zoom-150-plus", "zoom-200-plus");

  // 拡大率に応じてクラスを追加
  if (zoomLevel >= 150) {
    body.classList.add("zoom-150-plus");

    // 直接スタイルを適用（より確実）
    const py8Elements = document.querySelectorAll("[class*='lg:py-8']");
    py8Elements.forEach(element => {
      (element as HTMLElement).style.setProperty("padding-top", "0", "important");
      (element as HTMLElement).style.setProperty("padding-bottom", "0", "important");
    });

    const p6Elements = document.querySelectorAll("[class*='lg:p-6']");
    p6Elements.forEach(element => {
      (element as HTMLElement).style.setProperty("padding", "0", "important");
    });
  }

  if (zoomLevel >= 200) {
    body.classList.add("zoom-200-plus");
  }
};

export const initZoomDetection = (): void => {
  if (typeof window === "undefined") return;

  // 初期実行
  applyZoomClasses();

  // リサイズ時に再検出
  window.addEventListener("resize", applyZoomClasses);

  // ページ表示時に再検出
  window.addEventListener("load", applyZoomClasses);
};
