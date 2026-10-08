import { db } from "@/server/db";

export const dynamic = "force-dynamic";

/** Sonde de santé pour l'hébergeur (vérifie aussi la connexion à la base). */
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ status: "error" }, { status: 503 });
  }
}
