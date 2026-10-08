import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { isProduction } from "@/server/env";
import { validateSessionToken, type Actor } from "./session";

// En production (HTTPS), le préfixe __Host- interdit tout cookie posé par un sous-domaine ou sans Secure.
export const SESSION_COOKIE = isProduction() ? "__Host-session" : "session";

export async function setSessionCookie(token: string, expiresAt: Date) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSessionCookie() {
  (await cookies()).set(SESSION_COOKIE, "", { httpOnly: true, secure: isProduction(), sameSite: "lax", path: "/", maxAge: 0 });
}

export async function getSessionToken() {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

/** Utilisateur courant (mis en cache pour la durée d'une requête). */
export const getCurrentActor = cache(async (): Promise<Actor | null> => {
  const token = await getSessionToken();
  if (!token) return null;
  const result = await validateSessionToken(token);
  if (!result) return null;
  if (result.renewed) {
    // Impossible de poser un cookie pendant le rendu d'une page : ignoré silencieusement,
    // il sera renouvelé lors de la prochaine Server Action / route API.
    try {
      await setSessionCookie(token, result.expiresAt);
    } catch {}
  }
  return result.actor;
});
