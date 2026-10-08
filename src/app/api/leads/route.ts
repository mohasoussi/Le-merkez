import { NextResponse } from "next/server";
import { submitLead } from "@/server/services/leads";
import { assertSameOrigin } from "@/server/security/origin";
import { getClientIp } from "@/server/security/ip";
import { errorResponse } from "@/server/http/respond";

/** Formulaire de qualification → création d'un prospect dans le CRM. */
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const length = Number(request.headers.get("content-length") ?? 0);
    if (length > 64 * 1024) return NextResponse.json({ error: "Demande trop volumineuse." }, { status: 413 });
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    await submitLead(body, { ip: getClientIp(request.headers) });
    // Même réponse que la demande ait été enregistrée ou écartée comme spam
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return errorResponse(error, "api.leads.post");
  }
}
