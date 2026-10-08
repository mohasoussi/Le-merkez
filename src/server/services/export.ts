import "server-only";
import { BUDGET_LABELS, LEAD_SOURCE_LABELS, NEED_LABELS, PIPELINE_STAGE_LABELS, PROJECT_TYPE_LABELS, SECTOR_LABELS, TIMELINE_LABELS, type NeedCode } from "@/lib/constants";
import type { listLeadsForExport } from "./leads";

type Lead = Awaited<ReturnType<typeof listLeadsForExport>>[number];

const COLUMNS: [string, (l: Lead) => string | number | null | undefined][] = [
  ["Date", (l) => l.createdAt.toISOString().slice(0, 10)],
  ["Prénom", (l) => l.firstName],
  ["Nom", (l) => l.lastName],
  ["Entreprise", (l) => l.companyName],
  ["Email", (l) => l.email],
  ["Téléphone", (l) => l.phone],
  ["Activité", (l) => l.activity],
  ["Ville", (l) => l.city],
  ["Pays", (l) => l.country],
  ["Secteur", (l) => SECTOR_LABELS[l.sector]],
  ["Type de projet", (l) => PROJECT_TYPE_LABELS[l.projectType]],
  ["Budget", (l) => BUDGET_LABELS[l.budget]],
  ["Délai", (l) => TIMELINE_LABELS[l.timeline]],
  ["Besoins", (l) => l.needs.map((n) => NEED_LABELS[n as NeedCode] ?? n).join(", ")],
  ["Statut", (l) => PIPELINE_STAGE_LABELS[l.stage]],
  ["Offre envisagée", (l) => l.offer?.name],
  ["Montant devis (€)", (l) => (l.dealAmountCents != null ? l.dealAmountCents / 100 : null)],
  ["Source", (l) => LEAD_SOURCE_LABELS[l.source]],
  ["utm_source", (l) => l.utmSource],
  ["utm_medium", (l) => l.utmMedium],
  ["utm_campaign", (l) => l.utmCampaign],
  ["Site actuel", (l) => l.currentWebsite],
  ["Instagram", (l) => l.instagram],
  ["Description", (l) => l.description],
];

/** Neutralise l'injection de formules dans Excel (=, +, -, @ en début de cellule). */
function safeCell(v: string) {
  return /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
}

/** CSV compatible Excel FR : BOM UTF-8, séparateur « ; », guillemets échappés. */
export function leadsToCsv(leads: Lead[]) {
  const esc = (v: unknown) => {
    if (v == null) return "";
    const s = typeof v === "number" ? String(v).replace(".", ",") : safeCell(String(v));
    return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [COLUMNS.map(([h]) => h).join(";"), ...leads.map((l) => COLUMNS.map(([, f]) => esc(f(l))).join(";"))];
  return "﻿" + lines.join("\r\n");
}

export async function leadsToXlsx(leads: Lead[]) {
  const { default: writeXlsxFile } = await import("write-excel-file/node");
  const header = COLUMNS.map(([h]) => ({ value: h, fontWeight: "bold" as const }));
  const rows = leads.map((l) =>
    COLUMNS.map(([, f]) => {
      const v = f(l);
      if (v == null || v === "") return null;
      return typeof v === "number" ? { type: Number, value: v } : { type: String, value: safeCell(String(v)) };
    }),
  );
  return writeXlsxFile([header, ...rows], { columns: COLUMNS.map(([h]) => ({ width: Math.min(40, Math.max(12, h.length + 4)) })) }).toBuffer();
}
