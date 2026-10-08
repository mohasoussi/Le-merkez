import { requireActor } from "@/server/auth/guards";
import { exportOwnData } from "@/server/services/client-account";
import { errorResponse } from "@/server/http/respond";

export async function GET() {
  try {
    const actor = await requireActor();
    const data = await exportOwnData(actor);
    return new Response(JSON.stringify(data, null, 2), {
      headers: { "Content-Type": "application/json; charset=utf-8", "Content-Disposition": 'attachment; filename="mes-donnees.json"', "Cache-Control": "no-store" },
    });
  } catch (error) {
    return errorResponse(error, "api.client.export");
  }
}
