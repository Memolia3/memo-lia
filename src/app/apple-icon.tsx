import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 120,
          background: "linear-gradient(to bottom right, #4F46E5, #7C3AED)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: "32px", // Apple icons usually have rounded corners, but iOS applies its own mask.
          // However, providing a square icon is standard, iOS rounds it.
          // But here we can add a slight radius if we want it to look good elsewhere,
          // though standard practice for apple-touch-icon is square and iOS masks it.
          // Let's stick to square or slight radius.
          // Actually, for generated icons, it's safer to fill the square.
          // But `icon.tsx` had radius. Let's remove radius for apple icon to let iOS handle it,
          // OR keep it if we want a specific look.
          // iOS adds a mask, so if we have transparent corners, they turn black.
          // We should fill the background.
          fontWeight: "bold",
        }}
      >
        M
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
