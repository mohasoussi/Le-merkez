import { storage } from "@/server/storage";
import { logger } from "@/server/logger";

/** Médias PUBLICS uniquement (images des réalisations) : seules les clés sous « public/ » sont servies ici. */
export async function GET(_req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  const path = key.join("/");
  if (!/^[a-zA-Z0-9/_.-]+$/.test(path) || path.includes("..")) return new Response("Not found", { status: 404 });
  try {
    const obj = await storage().get(`public/${path}`);
    if (!obj) return new Response("Not found", { status: 404 });
    const ext = path.split(".").pop()?.toLowerCase();
    const type = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", avif: "image/avif" }[ext ?? ""];
    if (!type) return new Response("Not found", { status: 404 });
    return new Response(obj.body, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    logger.error("media.get_failed", { error, path });
    return new Response("Erreur", { status: 500 });
  }
}
