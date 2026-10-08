// Prépare la base e2e sans rien détruire : migrations, contenu de départ, admin de test (s'il n'existe pas).
// Les tests utilisent des données uniques à chaque exécution, aucune remise à zéro n'est nécessaire.
import { execSync } from "node:child_process";

const run = (cmd, extra = {}) => execSync(cmd, { stdio: "inherit", env: { ...process.env, ...extra } });
run("npx prisma migrate deploy");
run("npm run db:seed");
try {
  run('npm run admin:create -- --email admin-e2e@example.com --name "Admin E2E"', { ADMIN_PASSWORD: "AdminE2E-2026!" });
} catch {
  console.log("ℹ Admin e2e déjà présent.");
}
