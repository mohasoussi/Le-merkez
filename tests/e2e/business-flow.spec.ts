import { expect, test, type Page } from "@playwright/test";
import { E2E_ADMIN } from "./constants";

// Parcours complet : formulaire → CRM → conversion → accès client → brief → fichiers → statut → vue client.

const PNG = Buffer.from("89504e470d0a1a0a0000000d4948445200000001000000010806000000", "hex");
const exact = (page: Page, text: string) => page.locator("label").filter({ hasText: new RegExp(`^\\s*${text}\\s*$`) }).first();

async function login(page: Page, email: string, password: string) {
  await page.goto("/connexion");
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click("button[type=submit]");
}

const RUN = Date.now().toString(36);
const COMPANY = `Bistrot E2E ${RUN}`;
const EMAIL = `alice.${RUN}@example.com`;

test("parcours commercial et opérationnel de bout en bout", async ({ page, browser }) => {
  // 1. Visiteur venant d'Instagram → formulaire
  await page.goto("/?utm_source=instagram&utm_medium=social&utm_campaign=e2e");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Votre site internet professionnel");
  await page.getByRole("link", { name: "Choisir Pro" }).click();
  await expect(page).toHaveURL(/\/demande\?offre=pro/);
  for (const t of ["Site vitrine", "Restaurant", "1 000 – 1 500 €", "Dans le mois"]) await exact(page, t).click();
  await page.getByRole("button", { name: "Continuer" }).click();
  await exact(page, "Menu restaurant").click();
  await page.fill("#description", "Restaurant de quartier, nous voulons montrer la carte et prendre des réservations.");
  await page.getByRole("button", { name: "Continuer" }).click();
  await page.fill("#companyName", COMPANY);
  await page.fill("#activity", "Restaurant");
  await page.fill("#city", "Lyon");
  await page.getByRole("button", { name: "Continuer" }).click();
  await page.fill("#firstName", "Alice");
  await page.fill("#lastName", "Durand");
  await page.fill("#email", EMAIL);
  await page.fill("#phone", "0611223344");
  await page.check("input[name=consent]");
  await page.waitForTimeout(3200); // délai anti-robot
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();
  await expect(page.getByText("Votre demande a bien été reçue.")).toBeVisible();

  // 2. Admin : le prospect est dans le CRM
  const adminCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const admin = await adminCtx.newPage();
  await login(admin, E2E_ADMIN.email, E2E_ADMIN.password);
  await expect(admin).toHaveURL(/\/admin$/);
  await admin.goto(`/admin/prospects?q=${encodeURIComponent(COMPANY)}`);
  await admin.getByRole("link", { name: COMPANY }).first().click();
  await expect(admin.getByText("Instagram").first()).toBeVisible();
  await expect(admin.getByText("e2e", { exact: true })).toBeVisible(); // utm_campaign

  // 3. Changement de statut + note
  await admin.selectOption("#stage", "CALL_SCHEDULED");
  await admin.getByRole("button", { name: "Changer" }).click();
  await expect(admin.getByText("Statut mis à jour.")).toBeVisible();
  await admin.fill("#note-body", "Appel prévu jeudi, très motivée.");
  await admin.getByRole("button", { name: "Ajouter la note" }).click();
  await expect(admin.getByText("Appel prévu jeudi, très motivée.")).toBeVisible();
  await expect(admin.getByText("Statut : Nouveau prospect → Appel programmé")).toBeVisible();

  // 4. Conversion en client (+ projet)
  await admin.getByRole("button", { name: "Convertir en client" }).click();
  await expect(admin).toHaveURL(/\/admin\/clients\//);
  await expect(admin.getByRole("link", { name: new RegExp(`Site ${COMPANY}`) })).toBeVisible();

  // 5. Acompte reçu → brief ouvert
  await admin.fill("#pay-amount", "495");
  await admin.getByRole("button", { name: "Enregistrer le paiement" }).click();
  await expect(admin.getByText("Paiement enregistré.")).toBeVisible();

  // 6. Création de l'accès client
  await admin.getByRole("button", { name: "Créer l'accès client" }).click();
  const link = await admin.locator("code").first().textContent();
  expect(link).toContain("/activation?token=");

  // 7. Le client active son compte
  const clientCtx = await browser.newContext();
  const client = await clientCtx.newPage();
  await client.goto(link!.replace("http://localhost:3100", ""));
  await client.fill("#password", "AliceSecret-2026");
  await client.fill("#confirm", "AliceSecret-2026");
  await client.getByRole("button", { name: "Activer mon espace" }).click();
  await expect(client).toHaveURL(/\/client$/);
  await expect(client.getByRole("heading", { name: "Bonjour Alice" })).toBeVisible();
  await expect(client.getByText("Votre brief vous attend")).toBeVisible();

  // 8. Brief (sauvegarde automatique puis envoi)
  await client.getByRole("link", { name: "Remplir mon brief" }).click();
  await client.fill("#brief-identity-name", COMPANY);
  await client.fill("#brief-identity-description", "Cuisine maison et produits de saison.");
  await expect(client.getByText("Enregistré automatiquement")).toBeVisible({ timeout: 10_000 });
  await client.fill("#brief-goal-mainAction", "Réserver une table");
  await client.getByRole("button", { name: "Envoyer mon brief" }).click();
  await expect(client).toHaveURL(/\/client\/projets\/[^/]+$/, { timeout: 15_000 });
  await expect(client.getByText("Étape actuelle :")).toBeVisible();

  // 9. Dépôt d'un fichier + message
  const projectUrl = client.url();
  await client.goto(`${projectUrl}?onglet=fichiers`);
  await client.selectOption("#file-category", "LOGO");
  await client.setInputFiles("#file-input", { name: "logo.png", mimeType: "image/png", buffer: PNG });
  await expect(client.getByRole("link", { name: "Télécharger logo.png" })).toBeVisible({ timeout: 15_000 });
  await client.goto(`${projectUrl}?onglet=messages`);
  await client.getByLabel("Votre message").fill("Bonjour, voici notre logo !");
  await client.getByRole("button", { name: "Envoyer" }).click();
  await expect(client.getByText("Bonjour, voici notre logo !")).toBeVisible();

  // 10. Admin : brief + fichier visibles, passage en Design
  const projectId = projectUrl.split("/").pop();
  await admin.goto(`/admin/projets/${projectId}?onglet=brief`);
  await expect(admin.getByText("Cuisine maison et produits de saison.")).toBeVisible();
  await admin.goto(`/admin/projets/${projectId}?onglet=fichiers`);
  await expect(admin.getByRole("link", { name: "Télécharger logo.png" })).toBeVisible();
  await admin.goto(`/admin/projets/${projectId}`);
  await admin.locator("label").filter({ hasText: "Design" }).click();
  await admin.getByRole("button", { name: "Mettre à jour le statut" }).click();
  await expect(admin.getByText("Statut mis à jour.")).toBeVisible();

  // 11. Le client voit l'avancement
  await client.goto(projectUrl);
  await expect(client.getByText("Étape actuelle :")).toContainText("Design");
  await expect(client.getByRole("progressbar", { name: "Avancement du projet" })).toHaveAttribute("aria-valuenow", "30");

  // 12. Isolation : le client ne peut pas ouvrir l'admin
  await client.goto("/admin");
  await expect(client).toHaveURL(/\/client$/);
  const res = await client.request.get("/api/admin/leads/export");
  expect(res.status()).toBe(403);
});
