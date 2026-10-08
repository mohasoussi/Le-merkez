/** Erreur métier dont le message peut être montré tel quel à l'utilisateur. */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: "NOT_FOUND" | "FORBIDDEN" | "UNAUTHORIZED" | "VALIDATION" | "CONFLICT" | "RATE_LIMITED" = "VALIDATION",
    public readonly fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const notFound = (what = "Élément") => new AppError(`${what} introuvable.`, "NOT_FOUND");
export const forbidden = () => new AppError("Accès refusé.", "FORBIDDEN");

export const GENERIC_ERROR = "Une erreur est survenue. Veuillez réessayer.";
