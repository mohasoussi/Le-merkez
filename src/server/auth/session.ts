import "server-only";
import { db } from "@/server/db";
import { randomToken, sha256 } from "@/server/security/crypto";
import type { Role } from "@/generated/prisma/client";

export const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 jours
const RENEW_THRESHOLD_MS = 15 * 24 * 60 * 60 * 1000; // renouvelée s'il reste moins de 15 jours

/** Utilisateur authentifié, tel que transmis aux services métier. */
export interface Actor {
  id: string;
  role: Role;
  clientId: string | null;
  email: string;
  firstName: string;
  lastName: string;
}

export async function createSession(userId: string, meta: { ipAddress?: string; userAgent?: string } = {}) {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await db.session.create({
    data: {
      id: sha256(token),
      userId,
      expiresAt,
      ipAddress: meta.ipAddress?.slice(0, 64),
      userAgent: meta.userAgent?.slice(0, 255),
    },
  });
  return { token, expiresAt };
}

/** Valide un jeton de session. Retourne l'utilisateur et la date d'expiration (éventuellement prolongée). */
export async function validateSessionToken(token: string): Promise<{ actor: Actor; expiresAt: Date; renewed: boolean } | null> {
  if (!token || token.length > 100) return null;
  const id = sha256(token);
  const session = await db.session.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expiresAt.getTime() <= Date.now() || !session.user.isActive) {
    await db.session.deleteMany({ where: { id } });
    return null;
  }
  let expiresAt = session.expiresAt;
  let renewed = false;
  if (expiresAt.getTime() - Date.now() < RENEW_THRESHOLD_MS) {
    expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    await db.session.update({ where: { id }, data: { expiresAt } });
    renewed = true;
  }
  const u = session.user;
  return {
    actor: { id: u.id, role: u.role, clientId: u.clientId, email: u.email, firstName: u.firstName, lastName: u.lastName },
    expiresAt,
    renewed,
  };
}

export async function invalidateSession(token: string) {
  await db.session.deleteMany({ where: { id: sha256(token) } });
}

export async function invalidateAllUserSessions(userId: string) {
  await db.session.deleteMany({ where: { userId } });
}
