import "server-only";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";

export interface RateLimitRule {
  limit: number;
  windowSeconds: number;
}

export const RATE_LIMITS = {
  leadForm: { limit: 5, windowSeconds: 10 * 60 },
  login: { limit: 10, windowSeconds: 15 * 60 },
  passwordReset: { limit: 5, windowSeconds: 60 * 60 },
  upload: { limit: 60, windowSeconds: 10 * 60 },
  message: { limit: 30, windowSeconds: 10 * 60 },
} satisfies Record<string, RateLimitRule>;

/**
 * Fenêtre fixe stockée dans PostgreSQL (fonctionne avec plusieurs instances, sans Redis).
 * Requête unique et atomique : INSERT … ON CONFLICT … RETURNING.
 */
export async function hitRateLimit(key: string, rule: RateLimitRule): Promise<{ allowed: boolean; remaining: number }> {
  const rows = await db.$queryRaw<{ count: number }[]>`
    INSERT INTO "RateLimit" ("key", "count", "windowStart")
    VALUES (${key}, 1, NOW())
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "RateLimit"."windowStart" < NOW() - make_interval(secs => ${rule.windowSeconds}) THEN 1 ELSE "RateLimit"."count" + 1 END,
      "windowStart" = CASE WHEN "RateLimit"."windowStart" < NOW() - make_interval(secs => ${rule.windowSeconds}) THEN NOW() ELSE "RateLimit"."windowStart" END
    RETURNING "count"`;
  const count = Number(rows[0]?.count ?? 1);
  return { allowed: count <= rule.limit, remaining: Math.max(0, rule.limit - count) };
}

export async function enforceRateLimit(key: string, rule: RateLimitRule) {
  const { allowed } = await hitRateLimit(key, rule);
  if (!allowed) throw new AppError("Trop de tentatives. Merci de patienter quelques minutes avant de réessayer.", "RATE_LIMITED");
}

/** Nettoyage des fenêtres expirées (appelé de temps en temps, sans impact si oublié). */
export async function purgeRateLimits() {
  await db.$executeRaw`DELETE FROM "RateLimit" WHERE "windowStart" < NOW() - INTERVAL '1 day'`;
}
