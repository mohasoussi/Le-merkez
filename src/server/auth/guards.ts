import "server-only";
import { redirect } from "next/navigation";
import { AppError } from "@/server/errors";
import { getCurrentActor } from "./cookies";
import type { Actor } from "./session";

/** Pour les pages : redirige vers la connexion si non authentifié, ou vers le bon espace si mauvais rôle. */
export async function requireAdminPage(): Promise<Actor> {
  const actor = await getCurrentActor();
  if (!actor) redirect("/connexion?next=/admin");
  if (actor.role !== "ADMIN") redirect("/client");
  return actor;
}

export async function requireClientPage(): Promise<Actor> {
  const actor = await getCurrentActor();
  if (!actor) redirect("/connexion?next=/client");
  if (actor.role !== "CLIENT") redirect("/admin");
  return actor;
}

/** Pour les Server Actions / routes API : lève une erreur au lieu de rediriger. */
export async function requireActor(): Promise<Actor> {
  const actor = await getCurrentActor();
  if (!actor) throw new AppError("Votre session a expiré. Veuillez vous reconnecter.", "UNAUTHORIZED");
  return actor;
}

export async function requireAdmin(): Promise<Actor> {
  const actor = await requireActor();
  assertAdmin(actor);
  return actor;
}

export function assertAdmin(actor: Actor) {
  if (actor.role !== "ADMIN") throw new AppError("Accès refusé.", "FORBIDDEN");
}
