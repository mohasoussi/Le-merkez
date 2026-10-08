import { requireAdmin } from "@/server/auth/guards";
import { listLeadsForExport, parseLeadFilters } from "@/server/services/leads";
import { leadsToCsv, leadsToXlsx } from "@/server/services/export";
import { errorResponse } from "@/server/http/respond";

export async function GET(request: Request) {
  try {
    const actor = await requireAdmin();
    const params = Object.fromEntries(new URL(request.url).searchParams);
    const leads = await listLeadsForExport(actor, parseLeadFilters(params));
    const date = new Date().toISOString().slice(0, 10);
    const common = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
    if (params.format === "xlsx") {
      const buffer = await leadsToXlsx(leads);
      return new Response(new Uint8Array(buffer), {
        headers: { ...common, "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition": `attachment; filename="prospects-${date}.xlsx"` },
      });
    }
    return new Response(leadsToCsv(leads), { headers: { ...common, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="prospects-${date}.csv"` } });
  } catch (error) {
    return errorResponse(error, "api.leads.export");
  }
}
