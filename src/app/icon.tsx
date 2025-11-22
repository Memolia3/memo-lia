import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 192,
  height: 192,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128, // Increased font size for larger icon
          background: "linear-gradient(to bottom right, #4F46E5, #7C3AED)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: "20%", // Adjusted radius for larger size
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
