import "server-only";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";
import type { Actor } from "@/server/auth/session";
import { assertProjectAccess } from "./projects";
import { logActivity } from "./activity";
import { briefDataSchema, briefSubmitSchema, type BriefData } from "@/lib/validation/brief";
import { notifyBriefSubmitted } from "@/server/email/notifications";
import { assertAdmin } from "@/server/auth/guards";

export async function getBrief(actor: Actor, projectId: string) {
  const project = await assertProjectAccess(actor, projectId);
  const brief = await db.brief.upsert({ where: { projectId }, update: {}, create: { projectId } });
  return { project, brief, data: briefDataSchema.parse(brief.data ?? {}) };
}

function assertClientCanEdit(actor: Actor, project: { briefEnabled: boolean }, status: string) {
  if (actor.role === "ADMIN") return;
  if (!project.briefEnabled) throw new AppError("Le brief sera disponible après la réception de l'acompte.", "FORBIDDEN");
  if (status === "SUBMITTED") throw new AppError("Ce brief a déjà été envoyé. Écrivez-nous un message pour le modifier.", "FORBIDDEN");
}

/** Sauvegarde automatique (brouillon). */
export async function saveBriefDraft(actor: Actor, projectId: string, raw: unknown) {
  const { project, brief } = await getBrief(actor, projectId);
  assertClientCanEdit(actor, project, brief.status);
  const data: BriefData = briefDataSchema.parse(raw);
  const updated = await db.brief.update({ where: { projectId }, data: { data } });
  return updated.updatedAt;
}

export async function submitBrief(actor: Actor, projectId: string, raw: unknown) {
  const { project, brief } = await getBrief(actor, projectId);
  assertClientCanEdit(actor, project, brief.status);
  const data = briefDataSchema.parse(raw);
  const check = briefSubmitSchema.safeParse(data);
  if (!check.success) {
    const fieldErrors = Object.fromEntries(check.error.issues.map((i) => [i.path.join("."), i.message]));
    throw new AppError("Quelques informations essentielles manquent.", "VALIDATION", fieldErrors);
  }
  await db.$transaction(async (tx) => {
    await tx.brief.update({ where: { projectId }, data: { data, status: "SUBMITTED", submittedAt: new Date() } });
    await logActivity(tx, { type: "BRIEF_SUBMITTED", projectId, clientId: project.clientId, actorId: actor.id, message: `Brief envoyé pour « ${project.name} »` });
  });
  const client = await db.client.findUnique({ where: { id: project.clientId }, select: { companyName: true } });
  await notifyBriefSubmitted({ projectId, projectName: project.name, companyName: client?.companyName ?? "" });
}

export async function reopenBrief(actor: Actor, projectId: string) {
  assertAdmin(actor);
  await assertProjectAccess(actor, projectId);
  await db.brief.update({ where: { projectId }, data: { status: "DRAFT", submittedAt: null } });
}
