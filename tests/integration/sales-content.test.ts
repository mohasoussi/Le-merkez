import { describe, expect, it } from "vitest";
import { db } from "@/server/db";
import { submitLead } from "@/server/services/leads";
import { createQuote, setQuoteStatus, updateQuote, deleteQuote } from "@/server/services/quotes";
import { saveOffer, saveFaq, saveSettings, deleteOffer } from "@/server/services/content";
import { getDashboardKpis, getStatistics } from "@/server/services/stats";
import { convertLeadToClient } from "@/server/services/clients";
import { recordPayment } from "@/server/services/payments";
import { createSubscription } from "@/server/services/subscriptions";
import { quoteTotals } from "@/lib/quote-math";
import { createAdmin, createUser, toActor } from "../support/db";
import { validSubmission } from "../support/fixtures";

async function lead(ip: string) {
  await submitLead(validSubmission(), { ip, skipAntiSpam: true });
  return db.lead.findFirstOrThrow({ orderBy: { createdAt: "desc" } });
}

describe("devis", () => {
  it("calcule HT/TVA/TTC en centimes sans erreur d'arrondi", () => {
    expect(quoteTotals([{ quantity: 1, unitPriceCents: 99000 }, { quantity: 3, unitPriceCents: 3333 }], 2000)).toEqual({ totalHtCents: 108999, totalVatCents: 21800, totalTtcCents: 130799 });
    expect(quoteTotals([{ quantity: 1, unitPriceCents: 59000 }], 0).totalTtcCents).toBe(59000);
  });

  it("numérote, envoie (pipeline + montant), accepte puis verrouille", async () => {
    const admin = await createAdmin();
    const l = await lead("10.5.0.1");
    const q1 = await createQuote(admin, l.id, { validUntil: new Date(Date.now() + 864e5), vatRateBps: 0, items: [{ label: "Site Pro", quantity: 1, unitPriceCents: 99000 }] });
    const q2 = await createQuote(admin, l.id, { validUntil: new Date(Date.now() + 864e5), vatRateBps: 2000, items: [{ label: "Logo", quantity: 1, unitPriceCents: 20000 }] });
    const year = new Date().getFullYear();
    expect(q1.number).toBe(`DEV-${year}-0001`);
    expect(q2.number).toBe(`DEV-${year}-0002`);
    expect(q2.totalTtcCents).toBe(24000);

    await setQuoteStatus(admin, q1.id, "SENT");
    let updated = await db.lead.findUniqueOrThrow({ where: { id: l.id } });
    expect(updated.stage).toBe("QUOTE_SENT");
    expect(updated.dealAmountCents).toBe(99000);

    await setQuoteStatus(admin, q1.id, "ACCEPTED");
    updated = await db.lead.findUniqueOrThrow({ where: { id: l.id } });
    expect(updated.stage).toBe("NEGOTIATION");
    await expect(updateQuote(admin, q1.id, { validUntil: new Date(), vatRateBps: 0, items: [{ label: "x", quantity: 1, unitPriceCents: 1 }] })).rejects.toThrow(/accepté/);
    await expect(deleteQuote(admin, q1.id)).rejects.toThrow(/brouillon/);
    const types = (await db.activity.findMany({ where: { leadId: l.id } })).map((a) => a.type);
    expect(types).toEqual(expect.arrayContaining(["QUOTE_CREATED", "QUOTE_SENT", "QUOTE_ACCEPTED"]));
  });

  it("refuse un devis vide", async () => {
    const admin = await createAdmin();
    const l = await lead("10.5.0.2");
    await expect(createQuote(admin, l.id, { validUntil: new Date(), vatRateBps: 0, items: [] })).rejects.toThrow();
  });
});

describe("contenus administrables", () => {
  it("modifie le prix d'une offre, la FAQ et les réglages ; interdit aux clients", async () => {
    const admin = await createAdmin();
    const offer = await saveOffer(admin, null, { name: "Starter", priceCents: 59000, features: ["1 à 3 pages"], highlighted: false, isActive: true, sortOrder: 0, type: "SITE" });
    await saveOffer(admin, offer.id, { name: "Starter", priceCents: 69000, features: ["1 à 3 pages"], highlighted: false, isActive: true, sortOrder: 0, type: "SITE" });
    expect((await db.offer.findUniqueOrThrow({ where: { id: offer.id } })).priceCents).toBe(69000);
    await saveFaq(admin, null, { question: "Combien coûte un site ?", answer: "À partir de 690 €.", isActive: true, sortOrder: 0 });
    expect(await db.faq.count()).toBe(1);
    await saveSettings(admin, { brandName: "Mon Studio", heroTitle: "T", heroSubtitle: "S", problemQuote: "Q", ctaTitle: "C", ctaSubtitle: "CS", seoTitle: "SEO", seoDescription: "D", vatRateBps: 0, depositPercent: 40, quoteValidityDays: 15, contactEmail: "" });
    expect((await db.siteSettings.findUniqueOrThrow({ where: { id: 1 } })).depositPercent).toBe(40);

    const client = await db.client.create({ data: { firstName: "a", lastName: "b", email: "c@d.fr", companyName: "e" } });
    const user = toActor(await createUser({ email: "cl@test.local", role: "CLIENT", clientId: client.id }));
    await expect(saveOffer(user, offer.id, { name: "Hack", priceCents: 1, features: [], highlighted: false, isActive: true, sortOrder: 0, type: "SITE" })).rejects.toThrow("Accès refusé");
  });

  it("empêche de supprimer une offre utilisée", async () => {
    const admin = await createAdmin();
    const offer = await saveOffer(admin, null, { name: "Pro", priceCents: 99000, features: [], highlighted: false, isActive: true, sortOrder: 0, type: "SITE" });
    await submitLead(validSubmission({ offerSlug: offer.slug }), { ip: "10.5.1.1", skipAntiSpam: true });
    await expect(deleteOffer(admin, offer.id)).rejects.toThrow(/désactivez-la/);
  });
});

describe("statistiques calculées depuis la base", () => {
  it("reflète exactement les données réelles", async () => {
    const admin = await createAdmin();
    const empty = await getDashboardKpis(admin);
    expect(empty).toMatchObject({ totalLeads: 0, clients: 0, signedRevenueCents: 0, collectedCents: 0, maintenanceMrrCents: 0 });

    const plan = await saveOffer(admin, null, { name: "Basic", priceCents: 2900, features: [], highlighted: false, isActive: true, sortOrder: 0, type: "MAINTENANCE" });
    const l1 = await lead("10.6.0.1");
    await lead("10.6.0.2");
    await db.lead.update({ where: { id: l1.id }, data: { dealAmountCents: 100000 } });
    const { client } = await convertLeadToClient(admin, l1.id, { createProject: true });
    await recordPayment(admin, client.id, { kind: "DEPOSIT", amountCents: 50000, paidAt: new Date() });
    await createSubscription(admin, client.id, { offerId: plan.id, startDate: new Date() });

    const k = await getDashboardKpis(admin);
    expect(k).toMatchObject({ totalLeads: 2, newLeads: 1, clients: 1, signedRevenueCents: 100000, collectedCents: 50000, maintenanceMrrCents: 2900, activeSubscriptions: 1 });
    const s = await getStatistics(admin);
    expect(s.acquisition.totalLeads).toBe(2);
    expect(s.acquisition.bySource).toEqual([{ key: "INSTAGRAM", count: 2 }]);
    expect(s.acquisition.perMonth.at(-1)?.count).toBe(2);
    expect(s.commercial.conversionRate).toBe(0.5);
  });
});
