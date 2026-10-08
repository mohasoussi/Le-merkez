import "server-only";
import { randomBytes } from "node:crypto";

/** Identifiant aléatoire non devinable (utilisé pour les clés de stockage). */
export function createId() {
  return randomBytes(16).toString("hex");
}
