import { describe, expect, it } from "vitest";
import { rm } from "node:fs/promises";
import { db } from "@/server/db";
import { submitLead } from "@/server/services/leads";
import { convertLeadToClient } from "@/server/services/clients";
import { saveBriefDraft, submitBrief, getBrief } from "@/server/services/briefs";
import { uploadProjectFile, getFileForDownload, deleteProjectFile } from "@/server/services/files";
import { postMessage } from "@/server/services/messages";
import { exportOwnData } from "@/server/services/client-account";
import { consoleOutbox } from "@/server/email/mailer";
import { createAdmin, createUser, toActor } from "../support/db";
import { validSubmission } from "../support/fixtures";

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
const PDF = new TextEncoder().encode("%PDF-1.7\n%test");

let n = 0;
async function setup() {
  const admin = await createAdmin();
  const mk = async (email: string) => {
    await submitLead(validSubmission({ email, companyName: email }), { ip: `10.8.0.${++n}`, skipAntiSpam: true });
    const lead = await db.lead.findFirstOrThrow({ where: { email } });
    const { client, projectId } = await convertLeadToClient(admin, lead.id, { createProject: true });
    const actor = toActor(await createUser({ email: `user-${email}`, role: "CLIENT", clientId: client.id }));
    return { client, projectId: projectId!, actor };
  };
  return { admin, a: await mk("a@example.com"), b: await mk("b@example.com") };
}

describe("brief client", () => {
  it("est verrouillé avant l'acompte, puis sauvegardé, puis envoyé (notification admin)", async () => {
    process.env.ADMIN_NOTIFICATION_EMAIL = "admin@test.local";
    const { a } = await setup();
    await expect(saveBriefDraft(a.actor, a.projectId, { identity: { name: "X" } })).rejects.toThrow(/après la réception de l'acompte/);
    await db.project.update({ where: { id: a.projectId }, data: { briefEnabled: true } });

    await saveBriefDraft(a.actor, a.projectId, { identity: { name: "Chez A" } });
    expect((await getBrief(a.actor, a.projectId)).data.identity.name).toBe("Chez A");

    await expect(submitBrief(a.actor, a.projectId, { identity: { name: "Chez A" } })).rejects.toMatchObject({ fieldErrors: expect.objectContaining({ "identity.description": expect.any(String) }) });

    const before = consoleOutbox.length;
    await submitBrief(a.actor, a.projectId, { identity: { name: "Chez A", description: "Restaurant de quartier" }, goal: { mainAction: "Réserver une table" } });
    expect((await db.brief.findUniqueOrThrow({ where: { projectId: a.projectId } })).status).toBe("SUBMITTED");
    expect(consoleOutbox.slice(before).some((m) => m.subject.startsWith("Brief reçu"))).toBe(true);
    await expect(saveBriefDraft(a.actor, a.projectId, {})).rejects.toThrow(/déjà été envoyé/);
  });

  it("rejette les champs trop longs (validation serveur)", async () => {
    const { admin, a } = await setup();
    await expect(saveBriefDraft(admin, a.projectId, { identity: { name: "x".repeat(500) } })).rejects.toThrow();
  });

  it("un client ne peut pas lire ni écrire le brief d'un autre client", async () => {
    const { a, b } = await setup();
    await expect(getBrief(a.actor, b.projectId)).rejects.toThrow(/introuvable/);
    await expect(saveBriefDraft(a.actor, b.projectId, {})).rejects.toThrow(/introuvable/);
  });
});

describe("fichiers", () => {
  it("accepte un PNG/PDF valide, le stocke et le restitue au propriétaire et à l'admin", async () => {
    const { admin, a } = await setup();
    const file = await uploadProjectFile(a.actor, a.projectId, { name: "logo.png", bytes: PNG, category: "LOGO" });
    expect(file.mimeType).toBe("image/png");
    expect(file.storageKey).not.toContain("logo");
    await uploadProjectFile(a.actor, a.projectId, { name: "charte.pdf", bytes: PDF, category: "BRAND" });
    const dl = await getFileForDownload(admin, file.id);
    expect(dl.file.originalName).toBe("logo.png");
    await dl.obj.body.cancel();
    expect(await db.activity.count({ where: { type: "FILE_UPLOADED", projectId: a.projectId } })).toBe(2);
  });

  it("refuse les types dangereux ou falsifiés et les fichiers trop gros", async () => {
    const { a } = await setup();
    await expect(uploadProjectFile(a.actor, a.projectId, { name: "x.svg", bytes: new TextEncoder().encode("<svg onload=alert(1)>"), category: "LOGO" })).rejects.toThrow(/non autorisé/);
    await expect(uploadProjectFile(a.actor, a.projectId, { name: "faux.png", bytes: new TextEncoder().encode("<html>"), category: "PHOTOS" })).rejects.toThrow(/non autorisé/);
    await expect(uploadProjectFile(a.actor, a.projectId, { name: "virus.exe", bytes: new Uint8Array([0x4d, 0x5a]), category: "OTHER" })).rejects.toThrow(/non autorisé/);
    const big = new Uint8Array(16 * 1024 * 1024);
    big.set(PNG);
    await expect(uploadProjectFile(a.actor, a.projectId, { name: "big.png", bytes: big, category: "PHOTOS" })).rejects.toThrow(/trop volumineux/);
    await expect(uploadProjectFile(a.actor, a.projectId, { name: "a.png", bytes: PNG, category: "HACK" })).rejects.toThrow(/Catégorie/);
  });

  it("un client ne peut ni téléverser ni télécharger ni supprimer sur le projet d'un autre", async () => {
    const { a, b } = await setup();
    const fileB = await uploadProjectFile(b.actor, b.projectId, { name: "b.png", bytes: PNG, category: "LOGO" });
    await expect(uploadProjectFile(a.actor, b.projectId, { name: "a.png", bytes: PNG, category: "LOGO" })).rejects.toThrow(/introuvable/);
    await expect(getFileForDownload(a.actor, fileB.id)).rejects.toThrow(/introuvable/);
    await expect(deleteProjectFile(a.actor, fileB.id)).rejects.toThrow(/introuvable/);
  });

  it("un client ne peut supprimer que ses propres fichiers", async () => {
    const { admin, a } = await setup();
    const fromAdmin = await uploadProjectFile(admin, a.projectId, { name: "maquette.pdf", bytes: PDF, category: "DOCUMENTS" });
    await expect(deleteProjectFile(a.actor, fromAdmin.id)).rejects.toThrow(/propres fichiers/);
    const mine = await uploadProjectFile(a.actor, a.projectId, { name: "photo.png", bytes: PNG, category: "PHOTOS" });
    await deleteProjectFile(a.actor, mine.id);
    expect(await db.projectFile.count({ where: { id: mine.id } })).toBe(0);
  });
});

describe("messages", () => {
  it("enregistre auteur, date et projet ; refuse l'accès croisé", async () => {
    const { admin, a, b } = await setup();
    await postMessage(admin, a.projectId, "Votre première version est prête.");
    const m = await postMessage(a.actor, a.projectId, "Merci, j'aimerais modifier la section Services.");
    expect(m).toMatchObject({ projectId: a.projectId, authorId: a.actor.id });
    expect(m.createdAt).toBeInstanceOf(Date);
    await expect(postMessage(a.actor, b.projectId, "intrusion")).rejects.toThrow(/introuvable/);
    await expect(postMessage(a.actor, a.projectId, "   ")).rejects.toThrow(/vide/);
  });
});

describe("export RGPD par le client", () => {
  it("ne contient que ses données, sans notes internes", async () => {
    const { a } = await setup();
    await db.project.update({ where: { id: a.projectId }, data: { notes: "NOTE INTERNE SECRÈTE" } });
    const data = await exportOwnData(a.actor);
    const json = JSON.stringify(data);
    expect(json).toContain("a@example.com");
    expect(json).not.toContain("b@example.com");
    expect(json).not.toContain("NOTE INTERNE");
  });
});

// Nettoyage du stockage de test
import { afterAll } from "vitest";
afterAll(async () => {
  await rm("./.test-storage", { recursive: true, force: true });
});
