import "server-only";
import { z } from "zod";
import { db } from "@/server/db";
import { AppError, notFound } from "@/server/errors";
import { assertAdmin } from "@/server/auth/guards";
import type { Actor } from "@/server/auth/session";
import { logActivity } from "./activity";
import { PAYMENT_KINDS, PAYMENT_KIND_LABELS, PAYMENT_METHODS, PIPELINE_STAGES } from "@/lib/constants";
import { formatCents } from "@/lib/format";

// Paiements saisis manuellement (virement, chèque…). L'architecture permet d'ajouter plus tard
// un prestataire (Stripe, etc.) qui créerait ces mêmes enregistrements via un webhook.

export const paymentSchema = z.object({
  kind: z.enum(PAYMENT_KINDS),
  method: z.enum(PAYMENT_METHODS).default("TRANSFER"),
  amountCents: z.number().int().positive("Le montant doit être positif.").max(100_000_000),
  paidAt: z.coerce.date(),
  projectId: z.string().max(40).nullable().optional(),
  quoteId: z.string().max(40).nullable().optional(),
  reference: z.string().trim().max(120).nullable().optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
});

export async function recordPayment(actor: Actor, clientId: string, input: z.input<typeof paymentSchema>) {
  assertAdmin(actor);
  const data = paymentSchema.parse(input);
  const client = await db.client.findUnique({ where: { id: clientId }, include: { lead: { select: { id: true, stage: true } }, projects: { select: { id: true, status: true } } } });
  if (!client) throw notFound("Client");
  if (data.projectId && !client.projects.some((p) => p.id === data.projectId)) throw new AppError("Ce projet n'appartient pas à ce client.");

  return db.$transaction(async (tx) => {
    const payment = await tx.payment.create({ data: { ...data, clientId } });
    await logActivity(tx, {
      type: data.kind === "DEPOSIT" ? "DEPOSIT_RECEIVED" : "PAYMENT_RECORDED",
      clientId,
      leadId: client.lead?.id,
      projectId: data.projectId,
      actorId: actor.id,
      message: `${PAYMENT_KIND_LABELS[data.kind]} reçu : ${formatCents(data.amountCents)}`,
    });

    if (data.kind === "DEPOSIT") {
      // Acompte reçu → le client peut remplir son brief
      const targets = data.projectId ? [data.projectId] : client.projects.filter((p) => p.status === "BRIEF").map((p) => p.id);
      if (targets.length) await tx.project.updateMany({ where: { id: { in: targets } }, data: { briefEnabled: true } });
      const lead = client.lead;
      if (lead && lead.stage !== "LOST" && PIPELINE_STAGES.indexOf(lead.stage) < PIPELINE_STAGES.indexOf("DEPOSIT_RECEIVED")) {
        await tx.lead.update({ where: { id: lead.id }, data: { stage: "DEPOSIT_RECEIVED", stageChangedAt: new Date() } });
        await logActivity(tx, { type: "STAGE_CHANGED", leadId: lead.id, actorId: actor.id, message: "Statut mis à jour automatiquement : Acompte reçu" });
      }
    }
    return payment;
  });
}

export async function deletePayment(actor: Actor, id: string) {
  assertAdmin(actor);
  const p = await db.payment.findUnique({ where: { id } });
  if (!p) throw notFound("Paiement");
  await db.payment.delete({ where: { id } });
  return p.clientId;
}
