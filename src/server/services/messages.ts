import "server-only";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";
import type { Actor } from "@/server/auth/session";
import { assertProjectAccess } from "./projects";
import { logActivity } from "./activity";
import { enforceRateLimit, RATE_LIMITS } from "@/server/security/rate-limit";
import { notifyAdminMessageToClient, notifyClientMessage } from "@/server/email/notifications";

/**
 * Messages d'un projet (V1 : fil de commentaires). Chaque message garde auteur, date/heure et projet.
 * Évolution possible : notifications en temps réel, pièces jointes, statut « lu ».
 */
export async function postMessage(actor: Actor, projectId: string, rawBody: string) {
  const project = await assertProjectAccess(actor, projectId);
  await enforceRateLimit(`message:${actor.id}`, RATE_LIMITS.message);
  const body = rawBody.replace(/\r\n/g, "\n").trim();
  if (!body) throw new AppError("Le message est vide.");
  if (body.length > 5000) throw new AppError("Message trop long (5 000 caractères maximum).");

  const message = await db.$transaction(async (tx) => {
    const m = await tx.message.create({ data: { projectId, authorId: actor.id, body } });
    await logActivity(tx, { type: "MESSAGE_POSTED", projectId, clientId: project.clientId, actorId: actor.id, message: `Message de ${actor.firstName}` });
    return m;
  });

  if (actor.role === "CLIENT") {
    await notifyClientMessage({ projectId, projectName: project.name, authorName: `${actor.firstName} ${actor.lastName}`.trim(), excerpt: body.slice(0, 200) });
  } else {
    const users = await db.user.findMany({ where: { clientId: project.clientId, isActive: true, passwordHash: { not: null } } });
    await Promise.all(users.map((u) => notifyAdminMessageToClient({ to: u.email, firstName: u.firstName, projectId, projectName: project.name })));
  }
  return message;
}
