import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireActor } from "@/server/auth/guards";
import { uploadProjectFile } from "@/server/services/files";
import { assertSameOrigin } from "@/server/security/origin";
import { errorResponse } from "@/server/http/respond";
import { env } from "@/server/env";

/** Téléversement (multipart/form-data : « file » + « category »). Un fichier par requête. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const actor = await requireActor();
    const { id } = await params;
    const max = env().UPLOAD_MAX_MB * 1024 * 1024;
    const length = Number(request.headers.get("content-length") ?? 0);
    if (length > max + 64 * 1024) return NextResponse.json({ error: `Fichier trop volumineux (${env().UPLOAD_MAX_MB} Mo maximum).` }, { status: 413 });

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
    const record = await uploadProjectFile(actor, id, { name: file.name, bytes: new Uint8Array(await file.arrayBuffer()), category: String(form.get("category") ?? "OTHER") });
    revalidatePath(`/admin/projets/${id}`);
    revalidatePath(`/client/projets/${id}`, "layout");
    return NextResponse.json({ id: record.id, name: record.originalName }, { status: 201 });
  } catch (error) {
    return errorResponse(error, "api.files.upload");
  }
}
