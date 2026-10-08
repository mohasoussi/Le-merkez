import "server-only";
import { z } from "@/lib/zod";
import { db } from "@/server/db";
import { AppError, forbidden, notFound } from "@/server/errors";
import { assertAdmin } from "@/server/auth/guards";
import type { Actor } from "@/server/auth/session";
import { logActivity } from "./activity";
import { notifyProjectStatus } from "@/server/email/notifications";
import { PIPELINE_STAGES, PROJECT_STATUSES, PROJECT_STATUS_LABELS, type PipelineStageCode, type ProjectStatusCode } from "@/lib/constants";
import type { ProjectStatus } from "@/generated/prisma/client";

/**
 * Contrôle d'accès central d'un projet : un admin voit tout, un client UNIQUEMENT les projets de son entreprise.
 * Un projet d'un autre client renvoie « introuvable » (on ne confirme pas son existence).
 */
export async function assertProjectAccess(actor: Actor, projectId: string) {
  const project = await db.project.findUnique({ where: { id: projectId }, select: { id: true, clientId: true, name: true, briefEnabled: true } });
  if (!project) throw notFound("Projet");
  if (actor.role === "ADMIN") return project;
  if (actor.role === "CLIENT" && actor.clientId && project.clientId === actor.clientId) return project;
  throw notFound("Projet");
}

export const projectSchema = z.object({
  name: z.string().trim().min(1, "Nom requis.").max(150),
  offerId: z.string().max(40).nullable().optional(),
  priceCents: z.number().int().min(0).max(100_000_000).nullable().optional(),
  startDate: z.coerce.date().nullable().optional(),
  dueDate: z.coerce.date().nullable().optional(),
  previewUrl: z.url("URL invalide.").max(500).nullable().optional().or(z.literal("").transform(() => null)),
  liveUrl: z.url("URL invalide.").max(500).nullable().optional().or(z.literal("").transform(() => null)),
  notes: z.string().max(10_000).nullable().optional(),
  progressOverride: z.number().int().min(0).max(100).nullable().optional(),
  briefEnabled: z.boolean().optional(),
  contentReceived: z.boolean().optional(),
});
export type ProjectInput = z.infer<typeof projectSchema>;

export async function createProject(actor: Actor, clientId: string, input: ProjectInput) {
  assertAdmin(actor);
  const data = projectSchema.parse(input);
  const client = await db.client.findUnique({ where: { id: clientId }, select: { id: true, leadId: true } });
  if (!client) throw notFound("Client");
  const { contentReceived, ...rest } = data;
  return db.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: { ...rest, clientId, contentReceivedAt: contentReceived ? new Date() : null, brief: { create: {} } },
    });
    await logActivity(tx, { type: "PROJECT_CREATED", clientId, leadId: client.leadId, projectId: project.id, actorId: actor.id, message: `Projet « ${project.name} » créé` });
    return project;
  });
}

export async function updateProject(actor: Actor, id: string, input: ProjectInput) {
  assertAdmin(actor);
  const data = projectSchema.parse(input);
  const current = await db.project.findUnique({ where: { id }, select: { contentReceivedAt: true, clientId: true } });
  if (!current) throw notFound("Projet");
  const { contentReceived, ...rest } = data;
  await db.$transaction(async (tx) => {
    await tx.project.update({
      where: { id },
      data: {
        ...rest,
        ...(contentReceived === undefined ? {} : { contentReceivedAt: contentReceived ? (current.contentReceivedAt ?? new Date()) : null }),
      },
    });
    await logActivity(tx, { type: "PROJECT_UPDATED", projectId: id, clientId: current.clientId, actorId: actor.id, message: "Projet mis à jour" });
  });
}

/** Étape du pipeline correspondant à un statut de production (le pipeline ne recule jamais automatiquement). */
const STAGE_FOR_STATUS: Partial<Record<ProjectStatusCode, PipelineStageCode>> = {
  DESIGN: "IN_PRODUCTION",
  DEVELOPMENT: "IN_PRODUCTION",
  REVISION: "IN_PRODUCTION",
  VALIDATION: "CLIENT_REVIEW",
  LAUNCH: "CLIENT_REVIEW",
  DONE: "COMPLETED",
};

export async function changeProjectStatus(actor: Actor, id: string, status: ProjectStatus, opts: { notifyClient?: boolean } = {}) {
  assertAdmin(actor);
  if (!PROJECT_STATUSES.includes(status)) throw new AppError("Statut invalide.");
  const project = await db.project.findUnique({
    where: { id },
    include: { client: { include: { lead: { select: { id: true, stage: true } }, users: { where: { isActive: true, passwordHash: { not: null } } } } } },
  });
  if (!project) throw notFound("Projet");
  if (project.status === status) return;

  await db.$transaction(async (tx) => {
    await tx.project.update({
      where: { id },
      data: { status, completedAt: status === "DONE" ? new Date() : null, ...(status !== "BRIEF" && !project.startDate ? { startDate: new Date() } : {}) },
    });
    await logActivity(tx, {
      type: "PROJECT_STATUS_CHANGED",
      projectId: id,
      clientId: project.clientId,
      leadId: project.client.lead?.id,
      actorId: actor.id,
      message: `${project.name} : ${PROJECT_STATUS_LABELS[project.status]} → ${PROJECT_STATUS_LABELS[status]}`,
      metadata: { from: project.status, to: status },
    });
    const lead = project.client.lead;
    const target = STAGE_FOR_STATUS[status];
    if (lead && target && lead.stage !== "LOST" && lead.stage !== "MAINTENANCE" && PIPELINE_STAGES.indexOf(lead.stage) < PIPELINE_STAGES.indexOf(target)) {
      await tx.lead.update({ where: { id: lead.id }, data: { stage: target, stageChangedAt: new Date() } });
      await logActivity(tx, { type: "STAGE_CHANGED", leadId: lead.id, actorId: actor.id, message: `Statut mis à jour automatiquement (projet ${PROJECT_STATUS_LABELS[status]})`, metadata: { to: target } });
    }
  });

  if (opts.notifyClient !== false) {
    await Promise.all(
      project.client.users.map((u) => notifyProjectStatus({ to: u.email, firstName: u.firstName, projectId: id, projectName: project.name, statusLabel: PROJECT_STATUS_LABELS[status] })),
    );
  }
}

export async function listProjects(actor: Actor, filters: { status?: ProjectStatus } = {}) {
  assertAdmin(actor);
  return db.project.findMany({
    where: filters.status ? { status: filters.status } : undefined,
    orderBy: [{ updatedAt: "desc" }],
    include: { client: { select: { id: true, companyName: true } }, offer: { select: { name: true } }, brief: { select: { status: true } }, _count: { select: { files: true, messages: true } } },
  });
}

/** Détail d'un projet pour l'administrateur. */
export async function getProjectForAdmin(actor: Actor, id: string) {
  assertAdmin(actor);
  const project = await db.project.findUnique({
    where: { id },
    include: {
      client: { include: { users: { select: { id: true, email: true, passwordHash: true } } } },
      offer: true,
      brief: true,
      files: { orderBy: { createdAt: "desc" }, include: { uploadedBy: { select: { firstName: true, role: true } } } },
      messages: { orderBy: { createdAt: "asc" }, include: { author: { select: { id: true, firstName: true, lastName: true, role: true } } } },
      payments: { orderBy: { paidAt: "desc" } },
      activities: { orderBy: { createdAt: "desc" }, take: 50, include: { actor: { select: { firstName: true } } } },
    },
  });
  if (!project) throw notFound("Projet");
  return project;
}

/** Vue client : uniquement ses projets, sans les notes internes ni les données d'autres clients. */
export async function listProjectsForClient(actor: Actor) {
  if (actor.role !== "CLIENT" || !actor.clientId) throw forbidden();
  return db.project.findMany({
    where: { clientId: actor.clientId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, status: true, progressOverride: true, dueDate: true, previewUrl: true, liveUrl: true, briefEnabled: true, contentReceivedAt: true, brief: { select: { status: true } } },
  });
}

export async function getProjectForClient(actor: Actor, id: string) {
  await assertProjectAccess(actor, id);
  const project = await db.project.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      status: true,
      progressOverride: true,
      startDate: true,
      dueDate: true,
      previewUrl: true,
      liveUrl: true,
      briefEnabled: true,
      contentReceivedAt: true,
      offer: { select: { name: true } },
      brief: { select: { status: true, submittedAt: true, updatedAt: true } },
      files: { orderBy: { createdAt: "desc" }, select: { id: true, originalName: true, category: true, sizeBytes: true, mimeType: true, createdAt: true, uploadedBy: { select: { firstName: true, role: true } } } },
      messages: { orderBy: { createdAt: "asc" }, select: { id: true, body: true, createdAt: true, author: { select: { id: true, firstName: true, lastName: true, role: true } } } },
    },
  });
  if (!project) throw notFound("Projet");
  return project;
}

export async function deleteProject(actor: Actor, id: string) {
  assertAdmin(actor);
  const project = await db.project.findUnique({ where: { id }, include: { files: { select: { storageKey: true } } } });
  if (!project) throw notFound("Projet");
  await db.project.delete({ where: { id } });
  return project.files.map((f) => f.storageKey);
}
