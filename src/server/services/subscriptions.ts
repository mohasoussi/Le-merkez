import "server-only";
import { z } from "@/lib/zod";
import { db } from "@/server/db";
import { AppError, notFound } from "@/server/errors";
import { assertAdmin } from "@/server/auth/guards";
import type { Actor } from "@/server/auth/session";
import { logActivity } from "./activity";
import { SUBSCRIPTION_STATUSES, SUBSCRIPTION_STATUS_LABELS } from "@/lib/constants";

export const subscriptionCreateSchema = z.object({
  offerId: z.string().min(1, "Choisissez une formule.").max(40),
  priceCents: z.number().int().min(0).max(10_000_000).nullable().optional(),
  startDate: z.coerce.date(),
  nextDueDate: z.coerce.date().nullable().optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
});

export async function createSubscription(actor: Actor, clientId: string, input: z.input<typeof subscriptionCreateSchema>) {
  assertAdmin(actor);
  const data = subscriptionCreateSchema.parse(input);
  const [client, plan] = await Promise.all([
    db.client.findUnique({ where: { id: clientId }, include: { lead: { select: { id: true, stage: true } } } }),
    db.offer.findUnique({ where: { id: data.offerId } }),
  ]);
  if (!client) throw notFound("Client");
  if (!plan || plan.type !== "MAINTENANCE") throw new AppError("Formule de maintenance invalide.");
  const nextDue = data.nextDueDate ?? addMonths(data.startDate, 1);

  return db.$transaction(async (tx) => {
    const sub = await tx.maintenanceSubscription.create({
      data: { clientId, offerId: plan.id, planName: plan.name, priceCents: data.priceCents ?? plan.priceCents, startDate: data.startDate, nextDueDate: nextDue, notes: data.notes },
    });
    await logActivity(tx, { type: "SUBSCRIPTION_CREATED", clientId, leadId: client.lead?.id, actorId: actor.id, message: `Maintenance ${plan.name} souscrite` });
    const lead = client.lead;
    if (lead?.stage === "COMPLETED") {
      await tx.lead.update({ where: { id: lead.id }, data: { stage: "MAINTENANCE", stageChangedAt: new Date() } });
    }
    return sub;
  });
}

export const subscriptionUpdateSchema = z.object({
  status: z.enum(SUBSCRIPTION_STATUSES),
  priceCents: z.number().int().min(0).max(10_000_000),
  nextDueDate: z.coerce.date().nullable(),
  notes: z.string().trim().max(2000).nullable().optional(),
});

export async function updateSubscription(actor: Actor, id: string, input: z.input<typeof subscriptionUpdateSchema>) {
  assertAdmin(actor);
  const data = subscriptionUpdateSchema.parse(input);
  const sub = await db.maintenanceSubscription.findUnique({ where: { id } });
  if (!sub) throw notFound("Abonnement");
  await db.$transaction(async (tx) => {
    await tx.maintenanceSubscription.update({
      where: { id },
      data: { ...data, cancelledAt: data.status === "CANCELLED" ? (sub.cancelledAt ?? new Date()) : null },
    });
    if (sub.status !== data.status) {
      await logActivity(tx, { type: "SUBSCRIPTION_UPDATED", clientId: sub.clientId, actorId: actor.id, message: `Maintenance ${sub.planName} : ${SUBSCRIPTION_STATUS_LABELS[data.status]}` });
    }
  });
  return sub.clientId;
}

export async function listSubscriptions(actor: Actor) {
  assertAdmin(actor);
  return db.maintenanceSubscription.findMany({
    orderBy: [{ status: "asc" }, { nextDueDate: { sort: "asc", nulls: "last" } }],
    include: { client: { select: { id: true, companyName: true } } },
  });
}

export function addMonths(d: Date, n: number) {
  const r = new Date(d);
  r.setMonth(r.getMonth() + n);
  return r;
}
