import "server-only";
import { sha256 } from "./crypto";

/** IP du visiteur. Les en-têtes de proxy ne sont lus que si TRUST_PROXY=true (sinon ils sont falsifiables). */
export function getClientIp(headers: Headers): string {
  const trust = process.env.TRUST_PROXY === "true" || process.env.TRUST_PROXY === "1";
  if (!trust) return "unknown";
  const candidate =
    headers.get("cf-connecting-ip") ?? headers.get("x-forwarded-for")?.split(",")[0] ?? headers.get("x-real-ip");
  return candidate?.trim() || "unknown";
}

/** Empreinte non réversible de l'IP (traçabilité anti-abus sans stocker l'IP en clair). */
export function hashIp(ip: string) {
  return sha256(`${process.env.APP_SECRET ?? ""}:${ip}`).slice(0, 32);
}
