import { ImageResponse } from "next/og";
import { emblemColors } from "@/components/ui/Emblem";
import { site } from "@/content/site";
import { makePatches } from "@/lib/patchwork";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Image de partage générée : un patchwork qui converge vers l'emblème et le titre. */
export default function OpengraphImage() {
  const band = makePatches(24, 5);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#14100c", color: "#f4ecdd" }}>
        <div style={{ display: "flex", height: 24 }}>
          {band.map((p) => (
            <div key={p.id} style={{ flex: 1, background: p.color }} />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", flexWrap: "wrap", width: 102, height: 102, gap: 3 }}>
            {emblemColors.map((c, i) => (
              <div key={i} style={{ width: 32, height: 32, background: c }} />
            ))}
          </div>
          <div style={{ marginTop: 40, fontSize: 92, letterSpacing: 26, fontWeight: 300, textTransform: "uppercase" }}>Le Merkez</div>
          <div style={{ marginTop: 18, fontSize: 30, color: "#d8c3a0", letterSpacing: 4 }}>Créer des ponts entre les peuples</div>
        </div>
        <div style={{ display: "flex", height: 24 }}>
          {band.slice().reverse().map((p) => (
            <div key={p.id} style={{ flex: 1, background: p.color }} />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
