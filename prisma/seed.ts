/**
 *   npm run db:seed          → contenu réel de départ (offres, options, FAQ, réglages). Sans risque en production.
 *   npm run db:seed:demo     → + données FICTIVES de démonstration (prospects, clients, projets…)
 *   npm run db:demo:clear    → supprime toutes les données fictives
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { seedContent } from "./seed-content";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  const args = new Set(process.argv.slice(2));
  if (args.has("--clear-demo")) {
    const { clearDemo } = await import("./seed-demo");
    await clearDemo(db);
    console.log("✔ Données fictives supprimées.");
    return;
  }
  await seedContent(db);
  console.log("✔ Contenu de départ en place (offres, options, FAQ, réglages).");
  if (args.has("--demo")) {
    const { seedDemo } = await import("./seed-demo");
    await seedDemo(db);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
