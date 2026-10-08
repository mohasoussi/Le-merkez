import { createFormToken } from "@/server/security/antispam";

export function validSubmission(overrides: Record<string, unknown> = {}) {
  return {
    projectType: "SHOWCASE_SITE",
    sector: "RESTAURANT",
    budget: "FROM_1000_TO_1500",
    timeline: "WITHIN_MONTH",
    needs: ["RESTAURANT_MENU", "RESERVATION", "GOOGLE_MAPS"],
    description: "Nous ouvrons un restaurant et voulons un site avec la carte et la réservation.",
    companyName: "Chez Test",
    activity: "Restaurant",
    city: "Lyon",
    country: "France",
    firstName: "Camille",
    lastName: "Martin",
    email: "Camille@Example.com",
    phone: "06 12 34 56 78",
    consent: true,
    attribution: { utmSource: "instagram", utmMedium: "social", utmCampaign: "lancement" },
    formToken: createFormToken(Date.now() - 60_000),
    ...overrides,
  };
}
