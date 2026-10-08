import "server-only";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";
import { burnPasswordCheck, hashPassword, PASSWORD_MIN_LENGTH, verifyPassword } from "@/server/auth/password";
import { createSession, invalidateAllUserSessions } from "@/server/auth/session";
import { randomToken, sha256 } from "@/server/security/crypto";
import { enforceRateLimit, RATE_LIMITS } from "@/server/security/rate-limit";
import type { AuthTokenType } from "@/generated/prisma/client";

const INVALID_CREDENTIALS = "Email ou mot de passe incorrect.";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validatePasswordStrength(password: string) {
  if (password.length < PASSWORD_MIN_LENGTH)
    throw new AppError(`Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères.`, "VALIDATION", {
      password: `Au moins ${PASSWORD_MIN_LENGTH} caractères.`,
    });
  if (password.length > 200) throw new AppError("Mot de passe trop long.", "VALIDATION");
  if (!/[a-zA-Z]/.test(password) || !/[0-9\W_]/.test(password))
    throw new AppError("Le mot de passe doit contenir des lettres et au moins un chiffre ou un symbole.", "VALIDATION", {
      password: "Lettres + au moins un chiffre ou symbole.",
    });
}

/** Connexion : rate-limitée par IP et par email ; message identique que l'email existe ou non. */
export async function login(input: { email: string; password: string; ip: string; userAgent?: string }) {
  const email = normalizeEmail(input.email);
  await enforceRateLimit(`login:ip:${input.ip}`, RATE_LIMITS.login);
  await enforceRateLimit(`login:email:${email}`, RATE_LIMITS.login);

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash || !user.isActive) {
    await burnPasswordCheck(input.password);
    throw new AppError(INVALID_CREDENTIALS, "UNAUTHORIZED");
  }
  const ok = await verifyPassword(user.passwordHash, input.password);
  if (!ok) throw new AppError(INVALID_CREDENTIALS, "UNAUTHORIZED");

  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const session = await createSession(user.id, { ipAddress: input.ip, userAgent: input.userAgent });
  return { user, ...session };
}

const TOKEN_TTL: Record<AuthTokenType, number> = {
  INVITATION: 7 * 24 * 60 * 60 * 1000,
  PASSWORD_RESET: 60 * 60 * 1000,
};

/** Crée un jeton à usage unique (invitation ou réinitialisation). Seul le hash est stocké. */
export async function issueAuthToken(userId: string, type: AuthTokenType) {
  const token = randomToken();
  await db.authToken.deleteMany({ where: { userId, type, usedAt: null } });
  await db.authToken.create({
    data: { userId, type, tokenHash: sha256(token), expiresAt: new Date(Date.now() + TOKEN_TTL[type]) },
  });
  return token;
}

export async function findValidAuthToken(token: string) {
  if (!token || token.length > 100) return null;
  const record = await db.authToken.findUnique({ where: { tokenHash: sha256(token) }, include: { user: true } });
  if (!record || record.usedAt || record.expiresAt.getTime() < Date.now() || !record.user.isActive) return null;
  return record;
}

/** Définit le mot de passe via un jeton (activation de compte ou réinitialisation). Révoque les autres sessions. */
export async function setPasswordWithToken(token: string, password: string) {
  const record = await findValidAuthToken(token);
  if (!record) throw new AppError("Ce lien n'est plus valide. Demandez-en un nouveau.", "VALIDATION");
  validatePasswordStrength(password);
  const passwordHash = await hashPassword(password);
  await db.$transaction([
    db.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    db.authToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);
  await invalidateAllUserSessions(record.userId);
  return record.user;
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
  if (!user.passwordHash || !(await verifyPassword(user.passwordHash, currentPassword)))
    throw new AppError("Mot de passe actuel incorrect.", "VALIDATION", { currentPassword: "Mot de passe incorrect." });
  validatePasswordStrength(newPassword);
  await db.user.update({ where: { id: userId }, data: { passwordHash: await hashPassword(newPassword) } });
}

/** Demande de réinitialisation : ne révèle jamais si l'email existe. Retourne le jeton (ou null) pour l'envoi d'email. */
export async function requestPasswordReset(emailInput: string, ip: string) {
  const email = normalizeEmail(emailInput);
  await enforceRateLimit(`reset:ip:${ip}`, RATE_LIMITS.passwordReset);
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.isActive || !user.passwordHash) return null;
  return { user, token: await issueAuthToken(user.id, "PASSWORD_RESET") };
}

/** Création d'un administrateur (script CLI). */
export async function createAdminUser(input: { email: string; password: string; firstName: string; lastName?: string }) {
  validatePasswordStrength(input.password);
  const email = normalizeEmail(input.email);
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) throw new AppError("Un compte existe déjà avec cet email.", "CONFLICT");
  return db.user.create({
    data: {
      email,
      firstName: input.firstName,
      lastName: input.lastName ?? "",
      role: "ADMIN",
      passwordHash: await hashPassword(input.password),
    },
  });
}
