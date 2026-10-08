import { db } from "@/server/db";
import { hashPassword } from "@/server/auth/password";
import type { Actor } from "@/server/auth/session";

/** Vide toutes les tables (sauf l'historique des migrations). */
export async function resetDatabase() {
  const tables = await db.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'`;
  if (tables.length === 0) return;
  await db.$executeRawUnsafe(`TRUNCATE ${tables.map((t) => `"${t.tablename}"`).join(", ")} RESTART IDENTITY CASCADE`);
}

let hashCache: string | null = null;
export const TEST_PASSWORD = "Motdepasse-123";

export async function createUser(data: { email: string; role: "ADMIN" | "CLIENT"; clientId?: string }) {
  hashCache ??= await hashPassword(TEST_PASSWORD);
  return db.user.create({
    data: { email: data.email, role: data.role, clientId: data.clientId, firstName: "Test", passwordHash: hashCache },
  });
}

export function toActor(u: { id: string; role: "ADMIN" | "CLIENT"; clientId: string | null; email: string; firstName: string; lastName: string }): Actor {
  return { id: u.id, role: u.role, clientId: u.clientId, email: u.email, firstName: u.firstName, lastName: u.lastName };
}

export async function createAdmin(email = "admin@test.local") {
  return toActor(await createUser({ email, role: "ADMIN" }));
}
