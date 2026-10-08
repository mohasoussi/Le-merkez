import { requireActor } from "@/server/auth/guards";
import { getFileForDownload } from "@/server/services/files";
import { errorResponse } from "@/server/http/respond";

/**
 * Téléchargement d'un fichier de projet, après vérification des droits.
 * Les images peuvent s'afficher (aperçu) ; tout le reste est forcé en téléchargement.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireActor();
    const { id } = await params;
    const { file, obj } = await getFileForDownload(actor, id);
    const inline = new URL(request.url).searchParams.get("inline") === "1" && /^image\/(jpeg|png|webp|gif|avif)$/.test(file.mimeType);
    const encoded = encodeURIComponent(file.originalName);
    return new Response(obj.body, {
      headers: {
        "Content-Type": file.mimeType,
        "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${encoded.replace(/%20/g, " ").replace(/[^\x20-\x7e]/g, "_")}"; filename*=UTF-8''${encoded}`,
        ...(obj.size ? { "Content-Length": String(obj.size) } : {}),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
      },
    });
  } catch (error) {
    return errorResponse(error, "api.files.download");
  }
}
