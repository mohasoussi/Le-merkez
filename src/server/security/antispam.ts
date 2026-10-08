import "server-only";
import { hmac, safeEqual } from "./crypto";
import { logger } from "@/server/logger";

const MIN_FILL_MS = 3_000; // un humain met plus de 3 s à remplir le formulaire
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

/** Jeton horodaté et signé, généré au rendu du formulaire. */
export function createFormToken(now = Date.now()) {
  const ts = String(now);
  return `${ts}.${hmac(`form:${ts}`)}`;
}

export function checkFormToken(token: string | undefined | null, now = Date.now()): "ok" | "too_fast" | "invalid" {
  if (!token) return "invalid";
  const [ts, sig] = token.split(".");
  if (!ts || !sig || !safeEqual(sig, hmac(`form:${ts}`))) return "invalid";
  const age = now - Number(ts);
  if (!Number.isFinite(age) || age > MAX_AGE_MS || age < 0) return "invalid";
  if (age < MIN_FILL_MS) return "too_fast";
  return "ok";
}

/** Vérification Cloudflare Turnstile — uniquement si TURNSTILE_SECRET_KEY est configurée. */
export async function verifyTurnstile(token: string | undefined | null, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, ...(ip !== "unknown" ? { remoteip: ip } : {}) }),
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    logger.error("turnstile.verify_failed", { error });
    return false;
  }
}
