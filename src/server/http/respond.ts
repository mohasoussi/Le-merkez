import "server-only";
import { NextResponse } from "next/server";
import { z } from "@/lib/zod";
import { AppError, GENERIC_ERROR } from "@/server/errors";
import { logger } from "@/server/logger";
import { zodFieldErrors } from "@/server/actions/result";

const STATUS: Record<AppError["code"], number> = { NOT_FOUND: 404, FORBIDDEN: 403, UNAUTHORIZED: 401, VALIDATION: 400, CONFLICT: 409, RATE_LIMITED: 429 };

/** Convertit une erreur en réponse JSON propre (jamais de détail technique côté client). */
export function errorResponse(error: unknown, context: string) {
  if (error instanceof AppError) return NextResponse.json({ error: error.message, fieldErrors: error.fieldErrors }, { status: STATUS[error.code] });
  if (error instanceof z.ZodError) return NextResponse.json({ error: "Certains champs sont invalides.", fieldErrors: zodFieldErrors(error) }, { status: 400 });
  logger.error(`${context}.failed`, { error });
  return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
}
