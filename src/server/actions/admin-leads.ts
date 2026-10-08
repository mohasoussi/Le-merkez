"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "@/lib/zod";
import { requireAdmin } from "@/server/auth/guards";
import * as leads from "@/server/services/leads";
import { convertLeadToClient } from "@/server/services/clients";
import { PIPELINE_STAGES } from "@/lib/constants";
import { parseEuroToCents } from "@/lib/format";
import { ok, okData, runAction } from "./result";
import { AppError } from "@/server/errors";

const id = z.string().min(1).max(40);

export async function moveLeadAction(leadId: string, stage: string) {
  return runAction("moveLead", async () => {
    const actor = await requireAdmin();
    await leads.changeLeadStage(actor, id.parse(leadId), z.enum(PIPELINE_STAGES).parse(stage));
    revalidatePath("/admin", "layout");
  });
}

export async function changeStageAction(leadId: string, _: unknown, formData: FormData) {
  return runAction("changeStage", async () => {
    const actor = await requireAdmin();
    const stage = z.enum(PIPELINE_STAGES).parse(formData.get("stage"));
    const lostReason = z.string().max(500).optional().parse(formData.get("lostReason") || undefined);
    await leads.changeLeadStage(actor, id.parse(leadId), stage, { lostReason });
    revalidatePath("/admin", "layout");
    return ok("Statut mis à jour.");
  });
}

function euros(value: FormDataEntryValue | null) {
  const cents = parseEuroToCents(String(value ?? ""));
  if (Number.isNaN(cents)) throw new AppError("Montant invalide.", "VALIDATION", { dealAmount: "Montant invalide." });
  return cents;
}

export async function updateLeadAction(leadId: string, _: unknown, formData: FormData) {
  return runAction("updateLead", async () => {
    const actor = await requireAdmin();
    const f = Object.fromEntries(formData);
    const data = leads.leadUpdateSchema.parse({
      ...f,
      offerId: f.offerId || null,
      dealAmountCents: euros(formData.get("dealAmount")),
      nextCallAt: f.nextCallAt ? new Date(`${f.nextCallAt}:00${parisOffset(String(f.nextCallAt))}`) : null,
    });
    await leads.updateLead(actor, id.parse(leadId), data);
    revalidatePath("/admin", "layout");
    return ok("Fiche enregistrée.");
  });
}

/** Décalage horaire de Paris pour une date locale donnée (heure d'été / d'hiver). */
function parisOffset(local: string) {
  const d = new Date(`${local}:00Z`);
  const paris = new Date(d.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
  const utc = new Date(d.toLocaleString("en-US", { timeZone: "UTC" }));
  const diff = Math.round((paris.getTime() - utc.getTime()) / 60000);
  const sign = diff >= 0 ? "+" : "-";
  const abs = Math.abs(diff);
  return `${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
}

export async function addNoteAction(leadId: string, _: unknown, formData: FormData) {
  return runAction("addNote", async () => {
    const actor = await requireAdmin();
    await leads.addLeadNote(actor, id.parse(leadId), String(formData.get("body") ?? ""));
    revalidatePath(`/admin/prospects/${leadId}`);
    return ok("Note ajoutée.");
  });
}

export async function deleteNoteAction(noteId: string, leadId: string) {
  return runAction("deleteNote", async () => {
    const actor = await requireAdmin();
    await leads.deleteLeadNote(actor, id.parse(noteId));
    revalidatePath(`/admin/prospects/${leadId}`);
  });
}

export async function convertLeadAction(leadId: string, _: unknown, formData: FormData) {
  let target = "";
  const res = await runAction("convertLead", async () => {
    const actor = await requireAdmin();
    const { client } = await convertLeadToClient(actor, id.parse(leadId), { createProject: formData.get("createProject") === "on" });
    revalidatePath("/admin", "layout");
    target = `/admin/clients/${client.id}`;
  });
  if (!res.ok) return res;
  redirect(target);
}

export async function createLeadAction(_: unknown, formData: FormData) {
  let target = "";
  const res = await runAction("createLead", async () => {
    const actor = await requireAdmin();
    const lead = await leads.createManualLead(actor, leads.manualLeadSchema.parse(Object.fromEntries(formData)));
    revalidatePath("/admin", "layout");
    target = `/admin/prospects/${lead.id}`;
  });
  if (!res.ok) return res;
  redirect(target);
}

export async function deleteLeadAction(leadId: string) {
  const res = await runAction("deleteLead", async () => {
    const actor = await requireAdmin();
    await leads.deleteLead(actor, id.parse(leadId));
    revalidatePath("/admin", "layout");
  });
  if (!res.ok) return res;
  redirect("/admin/prospects");
}

export async function exportLeadDataAction(leadId: string) {
  return runAction("exportLeadData", async () => {
    const actor = await requireAdmin();
    return okData(JSON.stringify(await leads.exportLeadData(actor, id.parse(leadId)), null, 2));
  });
}
