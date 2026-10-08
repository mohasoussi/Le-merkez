import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ?? "postgresql://agence:agence@localhost:5432/agence_test?schema=public";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // `server-only` lève une erreur hors du runtime React Server : neutralisé pour les tests.
      "server-only": fileURLToPath(new URL("./tests/support/empty.ts", import.meta.url)),
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/e2e/**"],
    globalSetup: ["tests/support/global-setup.ts"],
    setupFiles: ["tests/support/setup.ts"],
    fileParallelism: false,
    testTimeout: 20_000,
    hookTimeout: 60_000,
    env: {
      NODE_ENV: "test",
      DATABASE_URL: TEST_DATABASE_URL,
      APP_URL: "http://localhost:3000",
      APP_SECRET: "test-secret-test-secret-test-secret-123456",
      EMAIL_DRIVER: "console",
      STORAGE_DRIVER: "local",
      STORAGE_LOCAL_DIR: "./.test-storage",
      TRUST_PROXY: "false",
    },
  },
});
