import { describe, expect, it } from "vitest";
import { db } from "@/server/db";
import { submitLead, changeLeadStage, listLeads, parseLeadFilters, addLeadNote, getLead, deleteLead } from "@/server/services/leads";
import { createFormToken } from "@/server/security/antispam";
import { consoleOutbox } from "@/server/email/mailer";
import { resolveLeadSource } from "@/lib/attribution";
import { createAdmin, createUser, toActor } from "../support/db";
import { validSubmission } from "../support/fixtures";

describe("création d'un prospect depuis le formulaire", () => {
  it("crée le prospect avec UTM, source, consentement et historique, et notifie l'admin", async () => {
    process.env.ADMIN_NOTIFICATION_EMAIL = "admin@test.local";
    const before = consoleOutbox.length;
    const res = await submitLead(validSubmission(), { ip: "10.0.0.1" });
    expect(res.status).toBe("created");
    const lead = await db.lead.findFirstOrThrow({ include: { activities: true } });
    expect(lead.email).toBe("camille@example.com");
    expect(lead.stage).toBe("NEW");
    expect(lead.source).toBe("INSTAGRAM");
    expect(lead.utmCampaign).toBe("lancement");
    expect(lead.consentAt).toBeInstanceOf(Date);
    expect(lead.ipHash).not.toContain("10.0.0.1");
    expect(lead.activities.map((a) => a.type)).toEqual(["LEAD_CREATED"]);
    expect(consoleOutbox.length).toBe(before + 1);
    expect(consoleOutbox.at(-1)?.subject).toContain("Chez Test");
  });

  it("refuse une soumission invalide (validation backend) avec des erreurs par champ", async () => {
    await expect(submitLead(validSubmission({ email: "pas-un-email", consent: false, description: "court" }), { ip: "10.0.0.2" })).rejects.toMatchObject({
      issues: expect.arrayContaining([
        expect.objectContaining({ path: ["email"] }),
        expect.objectContaining({ path: ["consent"] }),
        expect.objectContaining({ path: ["description"] }),
      ]),
    });
    expect(await db.lead.count()).toBe(0);
  });

  it("refuse les valeurs hors liste (budget inventé)", async () => {
    await expect(submitLead(validSubmission({ budget: "ONE_MILLION" }), { ip: "10.0.0.3" })).rejects.toThrow();
  });

  it("écarte silencieusement le spam : honeypot rempli, envoi trop rapide, jeton falsifié", async () => {
    expect(await submitLead(validSubmission({ website2: "http://spam" }), { ip: "10.0.1.1" })).toEqual({ status: "discarded" });
    expect(await submitLead(validSubmission({ formToken: createFormToken() }), { ip: "10.0.1.2" })).toEqual({ status: "discarded" });
    expect(await submitLead(validSubmission({ formToken: `${Date.now() - 60_000}.faux` }), { ip: "10.0.1.3" })).toEqual({ status: "discarded" });
    expect(await db.lead.count()).toBe(0);
  });

  it("limite le nombre de soumissions par IP", async () => {
    for (let i = 0; i < 5; i++) await submitLead(validSubmission(), { ip: "10.0.2.1" });
    await expect(submitLead(validSubmission(), { ip: "10.0.2.1" })).rejects.toThrow(/Trop de tentatives/);
    expect(await db.lead.count()).toBe(5);
  });

  it("déduit correctement la source", () => {
    expect(resolveLeadSource({ utmSource: "tiktok" })).toBe("TIKTOK");
    expect(resolveLeadSource({ utmSource: "facebook", utmMedium: "cpc" })).toBe("ADS");
    expect(resolveLeadSource({ referrer: "https://www.google.com/" })).toBe("SEO");
    expect(resolveLeadSource({}, "REFERRAL")).toBe("REFERRAL");
    expect(resolveLeadSource({})).toBe("DIRECT");
  });
});

describe("CRM — prospects", () => {
  it("change le statut, l'enregistre et l'historise", async () => {
    const admin = await createAdmin();
    await submitLead(validSubmission(), { ip: "10.1.0.1", skipAntiSpam: true });
    const lead = await db.lead.findFirstOrThrow();
    await changeLeadStage(admin, lead.id, "CALL_SCHEDULED");
    const updated = await getLead(admin, lead.id);
    expect(updated.stage).toBe("CALL_SCHEDULED");
    expect(updated.activities[0]?.message).toBe("Statut : Nouveau prospect → Appel programmé");
  });

  it("recherche et filtre", async () => {
    const admin = await createAdmin();
    await submitLead(validSubmission(), { ip: "10.1.1.1", skipAntiSpam: true });
    await submitLead(validSubmission({ companyName: "Garage Dupont", sector: "CRAFTSMAN", email: "dupont@example.com", phone: "0700000000" }), { ip: "10.1.1.2", skipAntiSpam: true });
    expect((await listLeads(admin, parseLeadFilters({ q: "dupont" }))).total).toBe(1);
    expect((await listLeads(admin, parseLeadFilters({ q: "0700000000" }))).total).toBe(1);
    expect((await listLeads(admin, parseLeadFilters({ sector: "RESTAURANT" }))).total).toBe(1);
    expect((await listLeads(admin, parseLeadFilters({ sector: "INVALIDE" }))).total).toBe(2); // filtre invalide ignoré
  });

  it("ajoute une note et supprime un prospect (RGPD) avec ses données liées", async () => {
    const admin = await createAdmin();
    await submitLead(validSubmission(), { ip: "10.1.2.1", skipAntiSpam: true });
    const lead = await db.lead.findFirstOrThrow();
    await addLeadNote(admin, lead.id, "Rappeler mardi");
    expect(await db.note.count()).toBe(1);
    await deleteLead(admin, lead.id);
    expect(await db.lead.count()).toBe(0);
    expect(await db.note.count()).toBe(0);
    expect(await db.activity.count()).toBe(0);
  });

  it("interdit toute opération CRM à un client", async () => {
    const client = await db.client.create({ data: { firstName: "A", lastName: "B", email: "a@b.fr", companyName: "X" } });
    const user = toActor(await createUser({ email: "client@test.local", role: "CLIENT", clientId: client.id }));
    await expect(listLeads(user, parseLeadFilters({}))).rejects.toThrow("Accès refusé");
    await expect(changeLeadStage(user, "x", "LOST")).rejects.toThrow("Accès refusé");
  });
});

describe("messages de validation", () => {
  it("sont en français, y compris pour un champ absent", async () => {
    const { leadSubmissionSchema } = await import("@/lib/validation/lead");
    const r = leadSubmissionSchema.safeParse({});
    expect(r.success).toBe(false);
    const messages = r.error!.issues.map((i) => i.message).join(" ");
    expect(messages).not.toMatch(/Invalid|expected/);
    expect(messages).toContain("Ce champ est requis.");
  });
});
