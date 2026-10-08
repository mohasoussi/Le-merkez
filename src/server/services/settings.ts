import "server-only";
import { db } from "@/server/db";

/** Réglages du site (ligne unique id=1, créée avec les valeurs par défaut si absente). */
export async function getSettings() {
  return (await db.siteSettings.findUnique({ where: { id: 1 } })) ?? db.siteSettings.create({ data: { id: 1 } });
}
