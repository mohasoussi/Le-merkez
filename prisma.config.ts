import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx --conditions=react-server prisma/seed.ts",
  },
  datasource: {
    // Pas de `env()` strict ici : `prisma generate` doit fonctionner sans base (CI, build Docker).
    url: process.env.DATABASE_URL ?? "",
  },
});
