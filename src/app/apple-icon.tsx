import { ImageResponse } from "next/og";
import { emblemColors } from "@/components/ui/Emblem";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#14100c" }}>
        <div style={{ display: "flex", flexWrap: "wrap", width: 108, height: 108, gap: 3 }}>
          {emblemColors.map((c, i) => (
            <div key={i} style={{ width: 34, height: 34, background: c }} />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
