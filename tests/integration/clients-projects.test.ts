import { describe, expect, it } from "vitest";
import { db } from "@/server/db";
import { submitLead } from "@/server/services/leads";
import { convertLeadToClient, createClientAccess } from "@/server/services/clients";
import { changeProjectStatus, createProject, getProjectForClient, listProjectsForClient, updateProject } from "@/server/services/projects";
import { recordPayment } from "@/server/services/payments";
import { setPasswordWithToken, login } from "@/server/services/auth";
import { validateSessionToken } from "@/server/auth/session";
import { consoleOutbox } from "@/server/email/mailer";
import { createAdmin } from "../support/db";
import { validSubmission } from "../support/fixtures";

async function newLead(overrides: Record<string, unknown> = {}) {
  await submitLead(validSubmission(overrides), { ip: `10.9.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`, skipAntiSpam: true });
  return db.lead.findFirstOrThrow({ orderBy: { createdAt: "desc" } });
}

describe("conversion prospect → client", () => {
  it("copie les données sans ressaisie, garde l'historique et crée le projet", async () => {
    const admin = await createAdmin();
    const lead = await newLead();
    await db.lead.update({ where: { id: lead.id }, data: { dealAmountCents: 99000 } });
    const { client, projectId } = await convertLeadToClient(admin, lead.id, { createProject: true });
    expect(client).toMatchObject({ leadId: lead.id, email: lead.email, companyName: lead.companyName, phone: lead.phone, city: lead.city });
    const project = await db.project.findUniqueOrThrow({ where: { id: projectId! }, include: { brief: true } });
    expect(project.priceCents).toBe(99000);
    expect(project.brief?.status).toBe("DRAFT");
    const types = (await db.activity.findMany({ where: { leadId: lead.id } })).map((a) => a.type);
    expect(types).toEqual(expect.arrayContaining(["LEAD_CREATED", "CLIENT_CREATED", "PROJECT_CREATED"]));
    await expect(convertLeadToClient(admin, lead.id)).rejects.toThrow(/déjà client/);
  });
});

describe("projets", () => {
  it("crée un projet, change le statut (historique + pipeline synchronisé + email client)", async () => {
    const admin = await createAdmin();
    const lead = await newLead();
    const { client } = await convertLeadToClient(admin, lead.id);
    const project = await createProject(admin, client.id, { name: "Site vitrine", priceCents: 59000 });
    expect(project.status).toBe("BRIEF");

    const { link } = await createClientAccess(admin, client.id);
    await setPasswordWithToken(new URL(link).searchParams.get("token")!, "MonMotDePasse-1");

    const before = consoleOutbox.length;
    await changeProjectStatus(admin, project.id, "DEVELOPMENT");
    const updated = await db.project.findUniqueOrThrow({ where: { id: project.id } });
    expect(updated.status).toBe("DEVELOPMENT");
    expect((await db.lead.findUniqueOrThrow({ where: { id: lead.id } })).stage).toBe("IN_PRODUCTION");
    expect(consoleOutbox.slice(before).some((m) => m.subject.includes("Développement") && m.to === lead.email)).toBe(true);
    expect(await db.activity.count({ where: { projectId: project.id, type: "PROJECT_STATUS_CHANGED" } })).toBe(1);

    await changeProjectStatus(admin, project.id, "DONE");
    expect((await db.project.findUniqueOrThrow({ where: { id: project.id } })).completedAt).toBeInstanceOf(Date);
  });

  it("la progression suit le statut ou la valeur manuelle", async () => {
    const admin = await createAdmin();
    const { client } = await convertLeadToClient(admin, (await newLead()).id);
    const project = await createProject(admin, client.id, { name: "P" });
    await updateProject(admin, project.id, { name: "P", progressOverride: 42 });
    expect((await db.project.findUniqueOrThrow({ where: { id: project.id } })).progressOverride).toBe(42);
  });

  it("l'acompte ouvre le brief et fait avancer le pipeline", async () => {
    const admin = await createAdmin();
    const lead = await newLead();
    const { client, projectId } = await convertLeadToClient(admin, lead.id, { createProject: true });
    await recordPayment(admin, client.id, { kind: "DEPOSIT", amountCents: 29500, paidAt: new Date() });
    expect((await db.project.findUniqueOrThrow({ where: { id: projectId! } })).briefEnabled).toBe(true);
    expect((await db.lead.findUniqueOrThrow({ where: { id: lead.id } })).stage).toBe("DEPOSIT_RECEIVED");
  });
});

describe("accès client et isolation des données", () => {
  async function setupTwoClients() {
    const admin = await createAdmin();
    const a = await convertLeadToClient(admin, (await newLead({ email: "a@example.com", companyName: "A" })).id, { createProject: true });
    const b = await convertLeadToClient(admin, (await newLead({ email: "b@example.com", companyName: "B" })).id, { createProject: true });
    const tokenA = new URL((await createClientAccess(admin, a.client.id)).link).searchParams.get("token")!;
    await setPasswordWithToken(tokenA, "MotDePasseA-123");
    const { token } = await login({ email: "a@example.com", password: "MotDePasseA-123", ip: "7.7.7.7" });
    const actorA = (await validateSessionToken(token))!.actor;
    return { admin, a, b, actorA };
  }

  it("un client se connecte et ne voit que SES projets", async () => {
    const { a, actorA } = await setupTwoClients();
    expect(actorA.role).toBe("CLIENT");
    const projects = await listProjectsForClient(actorA);
    expect(projects.map((p) => p.id)).toEqual([a.projectId]);
    const detail = await getProjectForClient(actorA, a.projectId!);
    expect(detail).not.toHaveProperty("notes"); // notes internes jamais exposées
  });

  it("un client ne peut PAS accéder au projet d'un autre client (introuvable)", async () => {
    const { b, actorA } = await setupTwoClients();
    await expect(getProjectForClient(actorA, b.projectId!)).rejects.toThrow(/introuvable/);
  });

  it("un client ne peut pas modifier un projet ni changer un statut", async () => {
    const { a, actorA } = await setupTwoClients();
    await expect(changeProjectStatus(actorA, a.projectId!, "DONE")).rejects.toThrow("Accès refusé");
    await expect(updateProject(actorA, a.projectId!, { name: "Piraté" })).rejects.toThrow("Accès refusé");
  });

  it("refuse un email déjà utilisé par un autre compte", async () => {
    const { admin, b } = await setupTwoClients();
    await expect(createClientAccess(admin, b.client.id, "a@example.com")).rejects.toThrow(/déjà utilisée/);
  });
});
