import { defineConfig, devices } from "@playwright/test";

// Tests de bout en bout : serveur Next dédié (port 3100) sur une base dédiée (agence_e2e).
const E2E_DATABASE_URL = process.env.E2E_DATABASE_URL ?? "postgresql://agence:agence@localhost:5432/agence_e2e?schema=public";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: { baseURL: "http://localhost:3100", trace: "retain-on-failure", launchOptions: { executablePath } },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"], launchOptions: { executablePath } } },
  ],
  webServer: {
    command: "node tests/e2e/prepare.mjs && npx next dev --port 3100",
    url: "http://localhost:3100/connexion",
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      DATABASE_URL: E2E_DATABASE_URL,
      APP_URL: "http://localhost:3100",
      APP_SECRET: "e2e-secret-e2e-secret-e2e-secret-e2e-secret",
      EMAIL_DRIVER: "console",
      STORAGE_DRIVER: "local",
      STORAGE_LOCAL_DIR: "./.e2e-storage",
      TRUST_PROXY: "false",
      NEXT_DIST_DIR: ".next-e2e",
    },
  },
});
