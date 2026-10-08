import "server-only";
import { z } from "zod";
import { AppError, GENERIC_ERROR } from "@/server/errors";
import { logger } from "@/server/logger";

export type ActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/** Succès explicite d'une action (message affiché à l'utilisateur et/ou données). */
export class Ok<T = undefined> {
  constructor(
    public readonly message?: string,
    public readonly data?: T,
  ) {}
}
export const ok = (message?: string) => new Ok<undefined>(message);
export const okData = <T,>(data: T, message?: string) => new Ok<T>(message, data);

export function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

/**
 * Exécute une action et convertit les erreurs :
 *  - AppError / ZodError → message compréhensible pour l'utilisateur ;
 *  - toute autre erreur → journalisée, message générique (jamais de détail technique affiché).
 */
export async function runAction<T = undefined>(name: string, fn: () => Promise<Ok<T> | void>): Promise<ActionResult<T>> {
  try {
    const result = await fn();
    return result instanceof Ok ? { ok: true, data: result.data, message: result.message } : { ok: true };
  } catch (error) {
    // Les redirections Next.js (redirect()) doivent remonter
    if (error && typeof error === "object" && "digest" in error && String((error as { digest: unknown }).digest).startsWith("NEXT_")) throw error;
    if (error instanceof AppError) return { ok: false, error: error.message, fieldErrors: error.fieldErrors };
    if (error instanceof z.ZodError) return { ok: false, error: "Certains champs sont invalides.", fieldErrors: zodFieldErrors(error) };
    logger.error(`action.${name}.failed`, { error });
    return { ok: false, error: GENERIC_ERROR };
  }
}
