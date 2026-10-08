import { execSync } from "node:child_process";

/** Applique les migrations sur la base de test avant la suite. */
export default function setup() {
  const url = process.env.TEST_DATABASE_URL ?? "postgresql://agence:agence@localhost:5432/agence_test?schema=public";
  execSync("npx prisma migrate deploy", { stdio: "inherit", env: { ...process.env, DATABASE_URL: url } });
}
