import "server-only";
import { AppError } from "@/server/errors";

/**
 * Protection CSRF des routes API mutantes : l'en-tête Origin doit correspondre à APP_URL ou à l'hôte de la requête.
 * (Les Server Actions de Next.js font déjà cette vérification nativement.)
 */
export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) throw new AppError("Requête refusée.", "FORBIDDEN");
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new AppError("Requête refusée.", "FORBIDDEN");
  }
  const allowed = new Set<string>();
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (host) allowed.add(host);
  if (process.env.APP_URL) {
    try {
      allowed.add(new URL(process.env.APP_URL).host);
    } catch {}
  }
  if (!allowed.has(originHost)) throw new AppError("Requête refusée.", "FORBIDDEN");
}
