import "server-only";
import { z } from "@/lib/zod";
import { db } from "@/server/db";
import { AppError, notFound } from "@/server/errors";
import { assertAdmin } from "@/server/auth/guards";
import type { Actor } from "@/server/auth/session";
import { logActivity } from "./activity";
import { logger } from "@/server/logger";
import { leadSubmissionSchema } from "@/lib/validation/lead";
import { resolveLeadSource } from "@/lib/attribution";
import { BUDGET_LABELS, CONSENT_VERSION, LEAD_SOURCE_LABELS, PIPELINE_STAGE_LABELS, PIPELINE_STAGES, PROJECT_TYPE_LABELS, BUDGETS, LEAD_SOURCES, PROJECT_TYPES, SECTORS } from "@/lib/constants";
import { checkFormToken, verifyTurnstile } from "@/server/security/antispam";
import { enforceRateLimit, purgeRateLimits, RATE_LIMITS } from "@/server/security/rate-limit";
import { hashIp } from "@/server/security/ip";
import { notifyNewLead } from "@/server/email/notifications";
import type { PipelineStage, Prisma } from "@/generated/prisma/client";

// ─────────────────────────────── Formulaire public

export type SubmitResult = { status: "created"; leadId: string } | { status: "discarded" };

/**
 * Crée un prospect depuis le formulaire public.
 * Les soumissions détectées comme robots sont « acceptées » en apparence mais jamais enregistrées
 * (on ne donne pas d'indice aux robots sur la règle qui les a bloqués).
 */
export async function submitLead(raw: unknown, ctx: { ip: string; skipAntiSpam?: boolean }): Promise<SubmitResult> {
  await enforceRateLimit(`lead:${ctx.ip}`, RATE_LIMITS.leadForm);
  // Nettoyage occasionnel des compteurs expirés (pas de tâche planifiée à maintenir)
  if (Math.random() < 0.02) void purgeRateLimits().catch(() => {});
  const input = leadSubmissionSchema.parse(raw);

  if (!ctx.skipAntiSpam) {
    if (input.website2) return discard("honeypot");
    const token = checkFormToken(input.formToken);
    if (token !== "ok") return discard(`form_token_${token}`);
    if (!(await verifyTurnstile(input.turnstileToken, ctx.ip))) throw new AppError("La vérification anti-robot a échoué. Merci de réessayer.");
  }

  const offer = input.offerSlug ? await db.offer.findUnique({ where: { slug: input.offerSlug } }) : null;
  const a = input.attribution;
  const source = resolveLeadSource(a, input.heardFrom);

  const lead = await db.$transaction(async (tx) => {
    const created = await tx.lead.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        companyName: input.companyName,
        activity: input.activity,
        city: input.city,
        country: input.country,
        currentWebsite: input.currentWebsite,
        instagram: input.instagram,
        facebook: input.facebook,
        otherSocial: input.otherSocial,
        projectType: input.projectType,
        sector: input.sector,
        budget: input.budget,
        needs: [...new Set(input.needs)],
        needsOther: input.needsOther,
        description: input.description,
        references: input.references,
        timeline: input.timeline,
        source,
        utmSource: a.utmSource,
        utmMedium: a.utmMedium,
        utmCampaign: a.utmCampaign,
        utmTerm: a.utmTerm,
        utmContent: a.utmContent,
        referrer: a.referrer,
        landingPath: a.landingPath,
        consentAt: new Date(),
        consentVersion: CONSENT_VERSION,
        ipHash: ctx.ip === "unknown" ? null : hashIp(ctx.ip),
        offerId: offer?.isActive ? offer.id : null,
      },
    });
    await logActivity(tx, { type: "LEAD_CREATED", leadId: created.id, message: `Prospect créé depuis le formulaire (source : ${LEAD_SOURCE_LABELS[source]}).` });
    return created;
  });

  await notifyNewLead({
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    companyName: lead.companyName,
    email: lead.email,
    phone: lead.phone,
    budgetLabel: BUDGET_LABELS[lead.budget],
    projectTypeLabel: PROJECT_TYPE_LABELS[lead.projectType],
    sourceLabel: LEAD_SOURCE_LABELS[lead.source],
  });
  return { status: "created", leadId: lead.id };
}

function discard(reason: string): SubmitResult {
  logger.warn("lead.discarded_as_spam", { reason });
  return { status: "discarded" };
}

// ─────────────────────────────── CRM (administrateur)

export const leadFiltersSchema = z.object({
  q: z.string().trim().max(100).optional(),
  stage: z.enum(PIPELINE_STAGES).optional(),
  sector: z.enum(SECTORS).optional(),
  budget: z.enum(BUDGETS).optional(),
  projectType: z.enum(PROJECT_TYPES).optional(),
  source: z.enum(LEAD_SOURCES).optional(),
  offerId: z.string().max(40).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  sort: z.enum(["recent", "oldest", "name", "budget", "stage"]).default("recent"),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
});
export type LeadFilters = z.infer<typeof leadFiltersSchema>;

/** Transforme des searchParams (valeurs vides ignorées) en filtres validés. */
export function parseLeadFilters(params: Record<string, string | string[] | undefined>): LeadFilters {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => typeof v === "string" && v !== ""));
  const r = leadFiltersSchema.safeParse(clean);
  return r.success ? r.data : leadFiltersSchema.parse({});
}

export function buildLeadWhere(f: LeadFilters): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = {};
  if (f.q) {
    const q = f.q;
    const digits = q.replace(/\D/g, "");
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { companyName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
      ...(digits.length >= 4 ? [{ phone: { contains: digits.slice(-6) } }] : []),
    ];
  }
  if (f.stage) where.stage = f.stage;
  if (f.sector) where.sector = f.sector;
  if (f.budget) where.budget = f.budget;
  if (f.projectType) where.projectType = f.projectType;
  if (f.source) where.source = f.source;
  if (f.offerId) where.offerId = f.offerId;
  if (f.from || f.to) {
    const to = f.to ? new Date(f.to.getTime() + 24 * 60 * 60 * 1000 - 1) : undefined;
    where.createdAt = { ...(f.from ? { gte: f.from } : {}), ...(to ? { lte: to } : {}) };
  }
  return where;
}

function leadOrder(sort: LeadFilters["sort"]): Prisma.LeadOrderByWithRelationInput[] {
  switch (sort) {
    case "oldest":
      return [{ createdAt: "asc" }];
    case "name":
      return [{ lastName: "asc" }, { firstName: "asc" }];
    case "budget":
      return [{ budget: "desc" }, { createdAt: "desc" }];
    case "stage":
      return [{ stage: "asc" }, { createdAt: "desc" }];
    default:
      return [{ createdAt: "desc" }];
  }
}

export const LEADS_PAGE_SIZE = 25;

export async function listLeads(actor: Actor, f: LeadFilters) {
  assertAdmin(actor);
  const where = buildLeadWhere(f);
  const [items, total] = await Promise.all([
    db.lead.findMany({
      where,
      orderBy: leadOrder(f.sort),
      skip: (f.page - 1) * LEADS_PAGE_SIZE,
      take: LEADS_PAGE_SIZE,
      include: { offer: { select: { name: true } }, client: { select: { id: true } } },
    }),
    db.lead.count({ where }),
  ]);
  return { items, total, pageCount: Math.max(1, Math.ceil(total / LEADS_PAGE_SIZE)) };
}

export async function listLeadsForExport(actor: Actor, f: LeadFilters) {
  assertAdmin(actor);
  return db.lead.findMany({ where: buildLeadWhere(f), orderBy: leadOrder(f.sort), include: { offer: { select: { name: true } } }, take: 10_000 });
}

export async function listPipeline(actor: Actor) {
  assertAdmin(actor);
  return db.lead.findMany({
    orderBy: [{ stageChangedAt: "desc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      companyName: true,
      stage: true,
      budget: true,
      sector: true,
      dealAmountCents: true,
      nextCallAt: true,
      createdAt: true,
      isDemo: true,
      offer: { select: { name: true } },
    },
  });
}

export async function getLead(actor: Actor, id: string) {
  assertAdmin(actor);
  const lead = await db.lead.findUnique({
    where: { id },
    include: {
      offer: true,
      client: { include: { payments: true, projects: { select: { id: true, name: true, status: true } } } },
      notes: { orderBy: { createdAt: "desc" }, include: { author: { select: { firstName: true, lastName: true } } } },
      activities: { orderBy: { createdAt: "desc" }, take: 100, include: { actor: { select: { firstName: true } } } },
      quotes: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!lead) throw notFound("Prospect");
  return lead;
}

/** Synthèse financière d'un prospect/client : devis, acompte attendu/reçu, payé, solde. */
export function leadFinancials(
  lead: { dealAmountCents: number | null; client: { payments: { kind: string; amountCents: number }[] } | null },
  depositPercent: number,
) {
  const payments = (lead.client?.payments ?? []).filter((p) => p.kind !== "MAINTENANCE");
  const paid = payments.reduce((s, p) => s + p.amountCents, 0);
  const deposit = payments.filter((p) => p.kind === "DEPOSIT").reduce((s, p) => s + p.amountCents, 0);
  const quote = lead.dealAmountCents;
  return {
    quote,
    depositExpected: quote != null ? Math.round((quote * depositPercent) / 100) : null,
    depositReceived: deposit,
    paid,
    balance: quote != null ? quote - paid : null,
  };
}

export async function changeLeadStage(actor: Actor, id: string, stage: PipelineStage, opts: { lostReason?: string } = {}) {
  assertAdmin(actor);
  const lead = await db.lead.findUnique({ where: { id }, select: { stage: true } });
  if (!lead) throw notFound("Prospect");
  if (lead.stage === stage) return;
  await db.$transaction(async (tx) => {
    await tx.lead.update({
      where: { id },
      data: { stage, stageChangedAt: new Date(), lastInteractionAt: new Date(), ...(stage === "LOST" && opts.lostReason ? { lostReason: opts.lostReason } : {}) },
    });
    await logActivity(tx, {
      type: "STAGE_CHANGED",
      leadId: id,
      actorId: actor.id,
      message: `Statut : ${PIPELINE_STAGE_LABELS[lead.stage]} → ${PIPELINE_STAGE_LABELS[stage]}`,
      metadata: { from: lead.stage, to: stage },
    });
  });
}

export const leadUpdateSchema = z.object({
  firstName: z.string().trim().min(1, "Prénom requis.").max(80),
  lastName: z.string().trim().min(1, "Nom requis.").max(80),
  email: z.email("Email invalide.").max(200),
  phone: z.string().trim().max(25),
  companyName: z.string().trim().min(1, "Entreprise requise.").max(120),
  activity: z.string().trim().max(120),
  city: z.string().trim().max(100),
  currentWebsite: z.string().trim().max(300).optional(),
  instagram: z.string().trim().max(200).optional(),
  facebook: z.string().trim().max(300).optional(),
  source: z.enum(LEAD_SOURCES),
  offerId: z.string().max(40).nullable(),
  dealAmountCents: z.number().int().min(0).max(100_000_000).nullable(),
  nextCallAt: z.coerce.date().nullable(),
});

export async function updateLead(actor: Actor, id: string, data: z.infer<typeof leadUpdateSchema>) {
  assertAdmin(actor);
  const before = await db.lead.findUnique({ where: { id }, select: { nextCallAt: true } });
  if (!before) throw notFound("Prospect");
  const clean = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v === "" ? null : v])) as typeof data;
  await db.$transaction(async (tx) => {
    await tx.lead.update({ where: { id }, data: { ...clean, lastInteractionAt: new Date() } });
    const callChanged = (clean.nextCallAt?.getTime() ?? null) !== (before.nextCallAt?.getTime() ?? null);
    if (callChanged && clean.nextCallAt) {
      await logActivity(tx, {
        type: "CALL_SCHEDULED",
        leadId: id,
        actorId: actor.id,
        message: `Appel programmé le ${clean.nextCallAt.toLocaleString("fr-FR", { timeZone: "Europe/Paris", dateStyle: "medium", timeStyle: "short" })}`,
      });
    } else {
      await logActivity(tx, { type: "LEAD_UPDATED", leadId: id, actorId: actor.id, message: "Fiche mise à jour" });
    }
  });
}

/** Création manuelle d'un prospect (appel entrant, recommandation…) depuis l'admin. */
export const manualLeadSchema = leadUpdateSchema.pick({ firstName: true, lastName: true, email: true, phone: true, companyName: true, activity: true, city: true, source: true }).extend({
  projectType: z.enum(PROJECT_TYPES).default("NEW_SITE"),
  sector: z.enum(SECTORS).default("OTHER"),
  budget: z.enum(BUDGETS).default("FROM_500_TO_1000"),
  description: z.string().trim().max(5000).default(""),
});

export async function createManualLead(actor: Actor, data: z.infer<typeof manualLeadSchema>) {
  assertAdmin(actor);
  return db.$transaction(async (tx) => {
    const lead = await tx.lead.create({
      data: { ...data, needs: [], timeline: "ASAP", consentAt: new Date(), consentVersion: "admin-manual", stage: "TO_QUALIFY" },
    });
    await logActivity(tx, { type: "LEAD_CREATED", leadId: lead.id, actorId: actor.id, message: "Prospect ajouté manuellement" });
    return lead;
  });
}

export async function addLeadNote(actor: Actor, leadId: string, body: string) {
  assertAdmin(actor);
  const text = body.trim();
  if (!text) throw new AppError("La note est vide.");
  if (text.length > 5000) throw new AppError("Note trop longue (5 000 caractères max).");
  await db.$transaction(async (tx) => {
    await tx.note.create({ data: { leadId, authorId: actor.id, body: text } });
    await tx.lead.update({ where: { id: leadId }, data: { lastInteractionAt: new Date() } });
    await logActivity(tx, { type: "NOTE_ADDED", leadId, actorId: actor.id, message: "Note ajoutée" });
  });
}

export async function deleteLeadNote(actor: Actor, noteId: string) {
  assertAdmin(actor);
  await db.note.deleteMany({ where: { id: noteId } });
}

/** RGPD : suppression définitive du prospect (et en cascade : notes, historique, devis). Un client lié est conservé mais délié. */
export async function deleteLead(actor: Actor, id: string) {
  assertAdmin(actor);
  const lead = await db.lead.findUnique({ where: { id }, select: { client: { select: { id: true } } } });
  if (!lead) throw notFound("Prospect");
  if (lead.client) throw new AppError("Ce prospect est devenu client : supprimez d'abord le client (Clients → Supprimer).", "CONFLICT");
  await db.lead.delete({ where: { id } });
}

/** RGPD : export de toutes les données d'un prospect (droit d'accès / portabilité). */
export async function exportLeadData(actor: Actor, id: string) {
  assertAdmin(actor);
  const lead = await db.lead.findUnique({
    where: { id },
    include: { notes: true, activities: true, quotes: { include: { items: true } }, client: { include: { projects: { include: { brief: true, messages: true, files: true } }, payments: true, subscriptions: true } } },
  });
  if (!lead) throw notFound("Prospect");
  const { ipHash: _ignored, ...rest } = lead;
  return rest;
}
