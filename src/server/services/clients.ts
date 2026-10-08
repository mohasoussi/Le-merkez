import "server-only";
import { z } from "@/lib/zod";
import { db } from "@/server/db";
import { AppError, notFound } from "@/server/errors";
import { assertAdmin } from "@/server/auth/guards";
import type { Actor } from "@/server/auth/session";
import { logActivity } from "./activity";
import { issueAuthToken, normalizeEmail } from "./auth";
import { notifyNewClient, sendInvitation } from "@/server/email/notifications";
import { getSettings } from "./settings";
import { env } from "@/server/env";
import { PROJECT_TYPE_LABELS } from "@/lib/constants";

/**
 * Convertit un prospect en client SANS ressaisie : identité, coordonnées et entreprise sont copiées,
 * le lien Lead → Client conserve tout l'historique commercial. Peut créer le premier projet dans la foulée.
 */
export async function convertLeadToClient(actor: Actor, leadId: string, opts: { createProject?: boolean } = {}) {
  assertAdmin(actor);
  const lead = await db.lead.findUnique({ where: { id: leadId }, include: { client: true, offer: true } });
  if (!lead) throw notFound("Prospect");
  if (lead.client) throw new AppError("Ce prospect est déjà client.", "CONFLICT");

  const result = await db.$transaction(async (tx) => {
    const client = await tx.client.create({
      data: {
        leadId: lead.id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        companyName: lead.companyName,
        activity: lead.activity,
        city: lead.city,
        country: lead.country,
        website: lead.currentWebsite,
        isDemo: lead.isDemo,
      },
    });
    await logActivity(tx, { type: "CLIENT_CREATED", leadId: lead.id, clientId: client.id, actorId: actor.id, message: "Prospect converti en client" });
    await tx.lead.update({ where: { id: lead.id }, data: { lastInteractionAt: new Date() } });

    let projectId: string | null = null;
    if (opts.createProject) {
      const project = await tx.project.create({
        data: {
          clientId: client.id,
          name: `Site ${lead.companyName}`,
          offerId: lead.offerId,
          priceCents: lead.dealAmountCents ?? lead.offer?.priceCents ?? null,
          startDate: new Date(),
          notes: `Type de projet : ${PROJECT_TYPE_LABELS[lead.projectType]}`,
          brief: { create: {} },
        },
      });
      projectId = project.id;
      await logActivity(tx, { type: "PROJECT_CREATED", leadId: lead.id, clientId: client.id, projectId, actorId: actor.id, message: `Projet « ${project.name} » créé` });
    }
    return { client, projectId };
  });

  await notifyNewClient(result.client);
  return result;
}

export async function listClients(actor: Actor, q?: string) {
  assertAdmin(actor);
  return db.client.findMany({
    where: q
      ? {
          OR: [
            { companyName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { firstName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      projects: { select: { id: true, status: true } },
      users: { select: { id: true, passwordHash: true, lastLoginAt: true } },
      payments: { select: { amountCents: true, kind: true } },
      subscriptions: { where: { status: "ACTIVE" }, select: { priceCents: true } },
    },
  });
}

export async function getClient(actor: Actor, id: string) {
  assertAdmin(actor);
  const client = await db.client.findUnique({
    where: { id },
    include: {
      lead: { include: { offer: true, quotes: { orderBy: { createdAt: "desc" } } } },
      projects: { orderBy: { createdAt: "desc" }, include: { offer: { select: { name: true } } } },
      payments: { orderBy: { paidAt: "desc" }, include: { project: { select: { name: true } } } },
      subscriptions: { orderBy: { createdAt: "desc" } },
      users: { select: { id: true, email: true, firstName: true, passwordHash: true, lastLoginAt: true, isActive: true, createdAt: true } },
      activities: { orderBy: { createdAt: "desc" }, take: 50, include: { actor: { select: { firstName: true } } } },
    },
  });
  if (!client) throw notFound("Client");
  return client;
}

export const clientUpdateSchema = z.object({
  firstName: z.string().trim().min(1, "Prénom requis.").max(80),
  lastName: z.string().trim().min(1, "Nom requis.").max(80),
  email: z.email("Email invalide.").max(200),
  phone: z.string().trim().max(25).optional(),
  companyName: z.string().trim().min(1, "Entreprise requise.").max(120),
  activity: z.string().trim().max(120).optional(),
  address: z.string().trim().max(300).optional(),
  city: z.string().trim().max(100).optional(),
  country: z.string().trim().max(100).default("France"),
  website: z.string().trim().max(300).optional(),
  notes: z.string().trim().max(5000).optional(),
});

export async function updateClient(actor: Actor, id: string, data: z.infer<typeof clientUpdateSchema>) {
  assertAdmin(actor);
  const clean = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v === "" ? null : v]));
  await db.client.update({ where: { id }, data: clean });
}

/**
 * Crée (ou ré-invite) l'accès client : compte CLIENT sans mot de passe + lien d'activation à usage unique.
 * Retourne le lien, pour pouvoir le transmettre manuellement si l'email n'est pas configuré.
 */
export async function createClientAccess(actor: Actor, clientId: string, emailInput?: string) {
  assertAdmin(actor);
  const client = await db.client.findUnique({ where: { id: clientId }, include: { users: true } });
  if (!client) throw notFound("Client");
  const email = normalizeEmail(emailInput || client.email);

  let user = client.users.find((u) => u.email === email);
  if (!user) {
    const taken = await db.user.findUnique({ where: { email } });
    if (taken) throw new AppError("Cette adresse email est déjà utilisée par un autre compte.", "CONFLICT");
    user = await db.user.create({ data: { email, role: "CLIENT", clientId, firstName: client.firstName, lastName: client.lastName } });
  }
  if (!user.isActive) await db.user.update({ where: { id: user.id }, data: { isActive: true } });

  const token = await issueAuthToken(user.id, "INVITATION");
  await logActivity(db, { type: "CLIENT_ACCESS_CREATED", clientId, leadId: client.leadId, actorId: actor.id, message: `Accès client envoyé à ${email}` });
  const settings = await getSettings();
  const sent = await sendInvitation({ to: email, firstName: client.firstName, token, brandName: settings.brandName });
  return { link: `${env().APP_URL}/activation?token=${encodeURIComponent(token)}`, emailSent: sent && env().EMAIL_DRIVER !== "console" };
}

export async function setClientUserActive(actor: Actor, userId: string, isActive: boolean) {
  assertAdmin(actor);
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "CLIENT") throw notFound("Compte");
  await db.user.update({ where: { id: userId }, data: { isActive } });
  if (!isActive) await db.session.deleteMany({ where: { userId } });
}

/** RGPD : suppression définitive d'un client (projets, fichiers, messages, paiements, comptes). Le prospect d'origine est supprimé aussi. */
export async function deleteClient(actor: Actor, id: string) {
  assertAdmin(actor);
  const client = await db.client.findUnique({ where: { id }, include: { projects: { include: { files: { select: { storageKey: true } } } } } });
  if (!client) throw notFound("Client");
  const keys = client.projects.flatMap((p) => p.files.map((f) => f.storageKey));
  await db.$transaction(async (tx) => {
    await tx.client.delete({ where: { id } });
    if (client.leadId) await tx.lead.deleteMany({ where: { id: client.leadId } });
  });
  return keys; // à supprimer du stockage par l'appelant
}
