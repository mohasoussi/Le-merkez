/**
 * Création d'un administrateur.
 *   npm run admin:create -- --email vous@exemple.fr --name "Prénom Nom"
 *   npm run admin:create -- --email vous@exemple.fr --reset     (nouveau mot de passe pour un admin existant)
 * Le mot de passe est demandé de façon interactive (jamais passé en argument → pas d'historique shell),
 * ou lu depuis ADMIN_PASSWORD pour un usage non interactif (CI, Docker).
 */
import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { parseArgs } from "node:util";
import { createAdminUser, validatePasswordStrength, normalizeEmail } from "@/server/services/auth";
import { hashPassword } from "@/server/auth/password";
import { invalidateAllUserSessions } from "@/server/auth/session";
import { db } from "@/server/db";

async function askHidden(question: string) {
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  const out = rl as unknown as { _writeToOutput: (s: string) => void; output: NodeJS.WriteStream };
  let muted = false;
  out._writeToOutput = (s: string) => {
    if (!muted) out.output.write(s);
  };
  const p = rl.question(question);
  muted = true;
  const answer = await p;
  rl.close();
  process.stdout.write("\n");
  return answer;
}

async function main() {
  const { values } = parseArgs({ options: { email: { type: "string" }, name: { type: "string" }, reset: { type: "boolean" } } });
  const email = values.email ?? process.env.ADMIN_EMAIL;
  if (!email) throw new Error('Usage : npm run admin:create -- --email vous@exemple.fr --name "Prénom Nom"');
  const [firstName = "Admin", ...rest] = (values.name ?? process.env.ADMIN_NAME ?? "Admin").split(" ");
  const password = process.env.ADMIN_PASSWORD ?? (await askHidden("Mot de passe (10 caractères min.) : "));
  if (values.reset) {
    validatePasswordStrength(password);
    const user = await db.user.findUnique({ where: { email: normalizeEmail(email) } });
    if (!user || user.role !== "ADMIN") throw new Error("Aucun administrateur avec cet email.");
    await db.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(password), isActive: true } });
    await invalidateAllUserSessions(user.id);
    console.log(`✔ Mot de passe réinitialisé : ${user.email}`);
    return;
  }
  const user = await createAdminUser({ email, password, firstName, lastName: rest.join(" ") });
  console.log(`✔ Administrateur créé : ${user.email}`);
}

main()
  .catch((e) => {
    console.error(`✖ ${e instanceof Error ? e.message : e}`);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
