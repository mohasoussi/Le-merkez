import "server-only";
import { z } from "@/lib/zod";
import { db } from "@/server/db";
import { AppError, notFound } from "@/server/errors";
import { assertAdmin } from "@/server/auth/guards";
import type { Actor } from "@/server/auth/session";
import { logActivity } from "./activity";
import { getSettings } from "./settings";
import { quoteTotals } from "@/lib/quote-math";
import { PIPELINE_STAGES, QUOTE_STATUSES } from "@/lib/constants";
import { formatCents } from "@/lib/format";
import { Prisma, type QuoteStatus } from "@/generated/prisma/client";

// V1 : structure de données + administration + version imprimable (PDF via « Imprimer » du navigateur).
// Prévu ensuite : génération PDF serveur, envoi par email, signature électronique.

export const quoteItemSchema = z.object({
  label: z.string().trim().min(1, "Libellé requis.").max(200),
  description: z.string().trim().max(1000).optional().nullable(),
  quantity: z.number().int().min(1).max(1000),
  unitPriceCents: z.number().int().min(0).max(100_000_000),
  offerId: z.string().max(40).nullable().optional(),
  optionId: z.string().max(40).nullable().optional(),
});

export const quoteInputSchema = z.object({
  validUntil: z.coerce.date(),
  vatRateBps: z.number().int().min(0).max(10_000),
  notes: z.string().trim().max(5000).nullable().optional(),
  items: z.array(quoteItemSchema).min(1, "Ajoutez au moins une ligne.").max(50),
});
export type QuoteInput = z.input<typeof quoteInputSchema>;

async function nextNumber(tx: Prisma.TransactionClient) {
  const year = new Date().getFullYear();
  const prefix = `DEV-${year}-`;
  const last = await tx.quote.findFirst({ where: { number: { startsWith: prefix } }, orderBy: { number: "desc" }, select: { number: true } });
  const seq = last ? Number(last.number.slice(prefix.length)) + 1 : 1;
  return `${prefix}${String(seq).padStart(4, "0")}`;
}

export async function createQuote(actor: Actor, leadId: string, input: QuoteInput) {
  assertAdmin(actor);
  const data = quoteInputSchema.parse(input);
  const lead = await db.lead.findUnique({ where: { id: leadId }, select: { id: true } });
  if (!lead) throw notFound("Prospect");
  const totals = quoteTotals(data.items, data.vatRateBps);
  // Retry en cas de collision de numéro (deux devis créés au même instant)
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await db.$transaction(async (tx) => {
        const quote = await tx.quote.create({
          data: { number: await nextNumber(tx), leadId, validUntil: data.validUntil, vatRateBps: data.vatRateBps, notes: data.notes, ...totals, items: { create: data.items.map((it, i) => ({ ...it, sortOrder: i })) } },
        });
        await logActivity(tx, { type: "QUOTE_CREATED", leadId, actorId: actor.id, message: `Devis ${quote.number} créé (${formatCents(totals.totalTtcCents)})` });
        return quote;
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002" && attempt < 2) continue;
      throw e;
    }
  }
  throw new AppError("Impossible de numéroter le devis, réessayez.");
}

export async function updateQuote(actor: Actor, id: string, input: QuoteInput) {
  assertAdmin(actor);
  const data = quoteInputSchema.parse(input);
  const quote = await db.quote.findUnique({ where: { id } });
  if (!quote) throw notFound("Devis");
  if (quote.status === "ACCEPTED") throw new AppError("Un devis accepté ne peut plus être modifié. Créez un nouveau devis.", "CONFLICT");
  const totals = quoteTotals(data.items, data.vatRateBps);
  await db.$transaction([
    db.quoteItem.deleteMany({ where: { quoteId: id } }),
    db.quote.update({
      where: { id },
      data: { validUntil: data.validUntil, vatRateBps: data.vatRateBps, notes: data.notes, ...totals, items: { create: data.items.map((it, i) => ({ ...it, sortOrder: i })) } },
    }),
  ]);
}

export async function setQuoteStatus(actor: Actor, id: string, status: QuoteStatus) {
  assertAdmin(actor);
  if (!QUOTE_STATUSES.includes(status)) throw new AppError("Statut invalide.");
  const quote = await db.quote.findUnique({ where: { id }, include: { lead: { select: { id: true, stage: true } } } });
  if (!quote) throw notFound("Devis");
  if (quote.status === status) return;
  await db.$transaction(async (tx) => {
    await tx.quote.update({
      where: { id },
      data: { status, ...(status === "SENT" ? { sentAt: new Date() } : {}), ...(status === "ACCEPTED" || status === "REFUSED" ? { respondedAt: new Date() } : {}) },
    });
    const type = status === "SENT" ? "QUOTE_SENT" : status === "ACCEPTED" ? "QUOTE_ACCEPTED" : status === "REFUSED" ? "QUOTE_REFUSED" : null;
    if (type) await logActivity(tx, { type, leadId: quote.leadId, actorId: actor.id, message: `Devis ${quote.number} : ${{ QUOTE_SENT: "envoyé", QUOTE_ACCEPTED: "accepté", QUOTE_REFUSED: "refusé" }[type]}` });
    if (status === "SENT" || status === "ACCEPTED") {
      // Le montant du devis alimente la fiche prospect ; le pipeline avance (jamais de recul automatique)
      const target = status === "SENT" ? "QUOTE_SENT" : "NEGOTIATION";
      const advance = quote.lead.stage !== "LOST" && PIPELINE_STAGES.indexOf(quote.lead.stage) < PIPELINE_STAGES.indexOf(target);
      await tx.lead.update({ where: { id: quote.leadId }, data: { dealAmountCents: quote.totalTtcCents, lastInteractionAt: new Date(), ...(advance ? { stage: target, stageChangedAt: new Date() } : {}) } });
    }
  });
}

export async function listQuotes(actor: Actor) {
  assertAdmin(actor);
  return db.quote.findMany({ orderBy: { createdAt: "desc" }, include: { lead: { select: { id: true, companyName: true, firstName: true, lastName: true } } } });
}

export async function getQuote(actor: Actor, id: string) {
  assertAdmin(actor);
  const quote = await db.quote.findUnique({ where: { id }, include: { items: { orderBy: { sortOrder: "asc" } }, lead: { include: { client: true } } } });
  if (!quote) throw notFound("Devis");
  return quote;
}

export async function deleteQuote(actor: Actor, id: string) {
  assertAdmin(actor);
  const quote = await db.quote.findUnique({ where: { id } });
  if (!quote) throw notFound("Devis");
  if (quote.status !== "DRAFT") throw new AppError("Seul un brouillon peut être supprimé.", "CONFLICT");
  await db.quote.delete({ where: { id } });
  return quote.leadId;
}

/** Valeurs par défaut d'un nouveau devis (réglages + offre envisagée du prospect). */
export async function quoteDefaults(leadId: string) {
  const [settings, lead] = await Promise.all([getSettings(), db.lead.findUnique({ where: { id: leadId }, include: { offer: true } })]);
  if (!lead) throw notFound("Prospect");
  const validUntil = new Date(Date.now() + settings.quoteValidityDays * 86_400_000);
  const items = lead.offer ? [{ label: `Site ${lead.offer.name}`, description: lead.offer.features.join(" · "), quantity: 1, unitPriceCents: lead.offer.priceCents, offerId: lead.offer.id }] : [];
  return { lead, validUntil, vatRateBps: settings.vatRateBps, items };
}
