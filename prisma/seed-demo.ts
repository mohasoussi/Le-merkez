import { hash } from "@node-rs/argon2";
import type { PipelineStage, PrismaClient, ProjectStatus } from "../src/generated/prisma/client";

/**
 * Données de DÉMONSTRATION — toutes FICTIVES.
 *  - prospects et clients marqués isDemo = true, entreprises suffixées « (fictif) » ;
 *  - emails en @example.com (domaine réservé, aucun envoi possible) ;
 *  - réalisations au slug « demo-… » et marquées « Exemple fictif ».
 * Suppression : npm run db:demo:clear
 */

export const DEMO_CLIENT_EMAIL = "client.demo@example.com";
const DEMO_CLIENT_PASSWORD = process.env.DEMO_CLIENT_PASSWORD ?? "ClientDemo-2026!";

const day = 86_400_000;
const ago = (d: number) => new Date(Date.now() - d * day);

interface DemoLead {
  first: string;
  last: string;
  company: string;
  activity: string;
  city: string;
  sector: "RESTAURANT" | "RETAIL" | "CRAFTSMAN" | "CONSULTANT" | "FREELANCER" | "ASSOCIATION" | "LIBERAL_PROFESSION";
  type: "NEW_SITE" | "REDESIGN" | "RESTAURANT_SITE" | "SHOWCASE_SITE" | "LANDING_PAGE" | "ECOMMERCE";
  budget: "UNDER_500" | "FROM_500_TO_1000" | "FROM_1000_TO_1500" | "FROM_1500_TO_3000" | "OVER_3000";
  source: "TIKTOK" | "INSTAGRAM" | "FACEBOOK" | "GOOGLE" | "REFERRAL" | "DIRECT";
  stage: PipelineStage;
  offer: "starter" | "pro" | "premium";
  deal?: number;
  createdDaysAgo: number;
  needs: string[];
  description: string;
  client?: { project: ProjectStatus; deposit?: boolean; balance?: boolean; maintenance?: "maintenance-basic" | "maintenance-pro" };
}

const LEADS: DemoLead[] = [
  { first: "Sofia", last: "Benali", company: "Le Petit Comptoir (fictif)", activity: "Bistrot", city: "Lyon", sector: "RESTAURANT", type: "RESTAURANT_SITE", budget: "FROM_1000_TO_1500", source: "INSTAGRAM", stage: "NEW", offer: "pro", createdDaysAgo: 1, needs: ["RESTAURANT_MENU", "RESERVATION", "GOOGLE_MAPS"], description: "Nous voulons un site pour présenter notre carte et prendre des réservations en ligne." },
  { first: "Hugo", last: "Lefèvre", company: "Lefèvre Plomberie (fictif)", activity: "Plombier chauffagiste", city: "Nantes", sector: "CRAFTSMAN", type: "NEW_SITE", budget: "FROM_500_TO_1000", source: "TIKTOK", stage: "TO_QUALIFY", offer: "starter", createdDaysAgo: 3, needs: ["SERVICES", "CONTACT_FORM", "GOOGLE_MAPS"], description: "Je n'ai pas de site, mes clients me trouvent par le bouche-à-oreille. Je veux recevoir des demandes de devis." },
  { first: "Claire", last: "Morel", company: "Morel Conseil (fictif)", activity: "Consultante RH", city: "Paris", sector: "CONSULTANT", type: "SHOWCASE_SITE", budget: "FROM_1500_TO_3000", source: "GOOGLE", stage: "CALL_SCHEDULED", offer: "premium", createdDaysAgo: 6, needs: ["COMPANY_PRESENTATION", "SERVICES", "APPOINTMENTS", "BLOG"], description: "Site vitrine haut de gamme avec prise de rendez-vous et un blog pour publier des articles." },
  { first: "Yanis", last: "Haddad", company: "Atelier Haddad (fictif)", activity: "Menuiserie", city: "Bordeaux", sector: "CRAFTSMAN", type: "REDESIGN", budget: "FROM_1000_TO_1500", source: "FACEBOOK", stage: "QUOTE_SENT", offer: "pro", deal: 1190, createdDaysAgo: 12, needs: ["PHOTO_GALLERY", "SERVICES", "CONTACT_FORM"], description: "Notre site actuel date de 2015 et n'est pas lisible sur mobile. Nous voulons mettre en avant nos réalisations." },
  { first: "Emma", last: "Garnier", company: "Les Amis du Quartier (fictif)", activity: "Association culturelle", city: "Lille", sector: "ASSOCIATION", type: "NEW_SITE", budget: "UNDER_500", source: "REFERRAL", stage: "LOST", offer: "starter", createdDaysAgo: 40, needs: ["COMPANY_PRESENTATION", "BLOG"], description: "Un site simple pour présenter nos événements." },
  { first: "Lucas", last: "Fontaine", company: "Fontaine Ostéopathie (fictif)", activity: "Ostéopathe", city: "Toulouse", sector: "LIBERAL_PROFESSION", type: "SHOWCASE_SITE", budget: "FROM_500_TO_1000", source: "INSTAGRAM", stage: "DEPOSIT_RECEIVED", offer: "starter", deal: 690, createdDaysAgo: 20, needs: ["SERVICES", "APPOINTMENTS", "GOOGLE_MAPS"], description: "Présenter le cabinet, les tarifs et permettre la prise de rendez-vous.", client: { project: "BRIEF", deposit: true } },
  { first: "Inès", last: "Roux", company: "Maison Roux Boulangerie (fictif)", activity: "Boulangerie artisanale", city: "Lyon", sector: "RETAIL", type: "SHOWCASE_SITE", budget: "FROM_1000_TO_1500", source: "TIKTOK", stage: "IN_PRODUCTION", offer: "pro", deal: 990, createdDaysAgo: 35, needs: ["COMPANY_PRESENTATION", "PHOTO_GALLERY", "GOOGLE_MAPS", "SOCIAL_NETWORKS"], description: "Montrer nos produits, nos horaires et notre histoire.", client: { project: "DEVELOPMENT", deposit: true } },
  { first: "Thomas", last: "Petit", company: "TP Coaching (fictif)", activity: "Coach sportif", city: "Marseille", sector: "FREELANCER", type: "LANDING_PAGE", budget: "FROM_500_TO_1000", source: "INSTAGRAM", stage: "CLIENT_REVIEW", offer: "starter", deal: 590, createdDaysAgo: 50, needs: ["SERVICES", "APPOINTMENTS"], description: "Une page pour présenter mes programmes de coaching.", client: { project: "VALIDATION", deposit: true } },
  { first: "Nadia", last: "Chevalier", company: "Chez Nadia Traiteur (fictif)", activity: "Traiteur", city: "Nice", sector: "RESTAURANT", type: "RESTAURANT_SITE", budget: "FROM_1500_TO_3000", source: "GOOGLE", stage: "COMPLETED", offer: "premium", deal: 1490, createdDaysAgo: 90, needs: ["RESTAURANT_MENU", "PHOTO_GALLERY", "CONTACT_FORM", "MULTILINGUAL"], description: "Site bilingue pour présenter nos menus événementiels.", client: { project: "DONE", deposit: true, balance: true } },
  { first: "Paul", last: "Mercier", company: "Mercier Électricité (fictif)", activity: "Électricien", city: "Rennes", sector: "CRAFTSMAN", type: "NEW_SITE", budget: "FROM_500_TO_1000", source: "DIRECT", stage: "MAINTENANCE", offer: "starter", deal: 590, createdDaysAgo: 140, needs: ["SERVICES", "CONTACT_FORM"], description: "Site simple avec formulaire de demande d'intervention.", client: { project: "DONE", deposit: true, balance: true, maintenance: "maintenance-basic" } },
];

const PORTFOLIO = [
  { slug: "demo-bistrot", name: "Bistrot du Marché — Exemple fictif", category: "RESTAURANT", description: "Carte, réservation en ligne et galerie photo pour un bistrot de quartier.", technologies: ["Réservation", "Galerie", "SEO local"] },
  { slug: "demo-artisan", name: "Atelier Bois & Co — Exemple fictif", category: "CRAFTSMAN", description: "Vitrine de réalisations et demande de devis en deux clics.", technologies: ["Galerie", "Formulaire de devis"] },
  { slug: "demo-consultant", name: "Cabinet Horizon — Exemple fictif", category: "CONSULTANT", description: "Site premium avec prise de rendez-vous et articles d'expertise.", technologies: ["Rendez-vous", "Blog"] },
  { slug: "demo-boutique", name: "Fleurs de Saison — Exemple fictif", category: "RETAIL", description: "Présentation des créations, horaires et itinéraire jusqu'à la boutique.", technologies: ["Google Maps", "Réseaux sociaux"] },
] as const;

const PROJECT_PROGRESS_DAYS: Record<ProjectStatus, number> = { BRIEF: 0, DESIGN: 5, DEVELOPMENT: 12, REVISION: 18, VALIDATION: 22, LAUNCH: 25, DONE: 28 };

export async function seedDemo(db: PrismaClient) {
  if (await db.lead.count({ where: { isDemo: true } })) {
    console.log("ℹ Des données fictives existent déjà (npm run db:demo:clear pour les supprimer).");
    return;
  }
  const offers = Object.fromEntries((await db.offer.findMany()).map((o) => [o.slug, o]));
  const admin = await db.user.findFirst({ where: { role: "ADMIN" } });
  let quoteCounter = 1;
  let firstClientId: string | null = null;

  for (const l of LEADS) {
    const offer = offers[l.offer];
    const createdAt = ago(l.createdDaysAgo);
    const lead = await db.lead.create({
      data: {
        firstName: l.first,
        lastName: l.last,
        email: `${l.first}.${l.last}`.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "") + "@example.com",
        phone: `06 00 00 ${String(10 + LEADS.indexOf(l)).padStart(2, "0")} ${String(20 + LEADS.indexOf(l)).padStart(2, "0")}`,
        companyName: l.company,
        activity: l.activity,
        city: l.city,
        projectType: l.type,
        sector: l.sector,
        budget: l.budget,
        needs: l.needs,
        description: l.description,
        timeline: "WITHIN_MONTH",
        source: l.source,
        utmSource: l.source === "INSTAGRAM" ? "instagram" : l.source === "TIKTOK" ? "tiktok" : null,
        utmMedium: ["INSTAGRAM", "TIKTOK"].includes(l.source) ? "social" : null,
        utmCampaign: ["INSTAGRAM", "TIKTOK"].includes(l.source) ? "lancement" : null,
        consentAt: createdAt,
        consentVersion: "demo",
        stage: l.stage,
        stageChangedAt: ago(Math.max(0, l.createdDaysAgo - 2)),
        offerId: offer?.id,
        dealAmountCents: l.deal ? l.deal * 100 : null,
        nextCallAt: l.stage === "CALL_SCHEDULED" ? new Date(Date.now() + 2 * day) : null,
        lastInteractionAt: ago(Math.max(0, l.createdDaysAgo - 2)),
        lostReason: l.stage === "LOST" ? "Budget insuffisant pour le moment" : null,
        isDemo: true,
        createdAt,
        activities: { create: [{ type: "LEAD_CREATED", message: "Prospect créé depuis le formulaire (donnée fictive).", createdAt }] },
        notes: admin ? { create: [{ authorId: admin.id, body: "Note de démonstration : premier contact positif.", createdAt: ago(Math.max(0, l.createdDaysAgo - 1)) }] } : undefined,
      },
    });

    if (l.deal && l.stage !== "LOST") {
      const ttc = l.deal * 100;
      await db.quote.create({
        data: {
          number: `DEMO-${String(quoteCounter++).padStart(4, "0")}`,
          leadId: lead.id,
          issueDate: ago(l.createdDaysAgo - 3),
          validUntil: new Date(ago(l.createdDaysAgo - 3).getTime() + 30 * day),
          status: l.stage === "QUOTE_SENT" ? "SENT" : "ACCEPTED",
          vatRateBps: 0,
          totalHtCents: ttc,
          totalVatCents: 0,
          totalTtcCents: ttc,
          sentAt: ago(l.createdDaysAgo - 3),
          items: { create: [{ label: `Site ${offer?.name ?? ""}`, quantity: 1, unitPriceCents: ttc, offerId: offer?.id }] },
        },
      });
    }

    if (!l.client) continue;
    const client = await db.client.create({
      data: { leadId: lead.id, firstName: l.first, lastName: l.last, email: lead.email, phone: lead.phone, companyName: l.company, activity: l.activity, city: l.city, isDemo: true, createdAt: ago(l.createdDaysAgo - 5) },
    });
    firstClientId ??= client.id;
    const started = ago(l.createdDaysAgo - 6);
    const done = l.client.project === "DONE";
    const project = await db.project.create({
      data: {
        clientId: client.id,
        name: `Site ${l.company.replace(" (fictif)", "")}`,
        offerId: offer?.id,
        priceCents: (l.deal ?? 0) * 100,
        status: l.client.project,
        startDate: started,
        dueDate: new Date(started.getTime() + 30 * day),
        completedAt: done ? new Date(started.getTime() + PROJECT_PROGRESS_DAYS.DONE * day) : null,
        previewUrl: ["DEVELOPMENT", "VALIDATION"].includes(l.client.project) ? "https://example.com/preview" : null,
        liveUrl: done ? "https://example.com" : null,
        briefEnabled: true,
        contentReceivedAt: l.client.project === "BRIEF" ? null : started,
        brief:
          l.client.project === "BRIEF"
            ? { create: {} }
            : {
                create: {
                  status: "SUBMITTED",
                  submittedAt: started,
                  data: { identity: { name: l.company.replace(" (fictif)", ""), description: l.description }, goal: { mainAction: "Nous contacter" } },
                },
              },
        activities: { create: [{ type: "PROJECT_CREATED", clientId: client.id, message: "Projet créé (donnée fictive)", createdAt: started }] },
      },
    });
    if (l.client.deposit) {
      await db.payment.create({ data: { clientId: client.id, projectId: project.id, kind: "DEPOSIT", method: "TRANSFER", amountCents: Math.round(((l.deal ?? 0) * 100) / 2), paidAt: started, reference: "DEMO" } });
    }
    if (l.client.balance) {
      await db.payment.create({ data: { clientId: client.id, projectId: project.id, kind: "BALANCE", method: "TRANSFER", amountCents: Math.round(((l.deal ?? 0) * 100) / 2), paidAt: new Date(started.getTime() + 28 * day), reference: "DEMO" } });
    }
    if (l.client.project !== "BRIEF" && admin) {
      await db.message.createMany({
        data: [
          { projectId: project.id, authorId: admin.id, body: "Bonjour ! Votre première version est prête, vous pouvez la consulter via le lien de preview.", createdAt: ago(3) },
        ],
      });
    }
    if (l.client.maintenance) {
      const plan = offers[l.client.maintenance];
      if (plan) {
        await db.maintenanceSubscription.create({
          data: { clientId: client.id, offerId: plan.id, planName: plan.name, priceCents: plan.priceCents, startDate: ago(100), nextDueDate: new Date(Date.now() + 10 * day) },
        });
        await db.payment.create({ data: { clientId: client.id, kind: "MAINTENANCE", amountCents: plan.priceCents, paidAt: ago(20), reference: "DEMO" } });
      }
    }
  }

  // Compte client de démonstration (lié au premier client fictif : projet au stade « Brief »)
  if (firstClientId && !(await db.user.findUnique({ where: { email: DEMO_CLIENT_EMAIL } }))) {
    const client = await db.client.findUniqueOrThrow({ where: { id: firstClientId } });
    await db.user.create({
      data: { email: DEMO_CLIENT_EMAIL, role: "CLIENT", clientId: firstClientId, firstName: client.firstName, lastName: client.lastName, passwordHash: await hash(DEMO_CLIENT_PASSWORD, { memoryCost: 19456, timeCost: 2, parallelism: 1 }) },
    });
  }

  for (const [i, p] of PORTFOLIO.entries()) {
    await db.portfolioProject.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, technologies: [...p.technologies], status: "PUBLISHED", sortOrder: i, date: ago(30 * (i + 1)) },
    });
  }

  console.log(`✔ Données fictives créées : ${LEADS.length} prospects, ${LEADS.filter((l) => l.client).length} clients et projets, ${PORTFOLIO.length} réalisations.`);
  console.log(`  Compte client de démonstration : ${DEMO_CLIENT_EMAIL} / ${process.env.DEMO_CLIENT_PASSWORD ? "(DEMO_CLIENT_PASSWORD)" : DEMO_CLIENT_PASSWORD}`);
}

export async function clearDemo(db: PrismaClient) {
  await db.user.deleteMany({ where: { email: DEMO_CLIENT_EMAIL } });
  await db.client.deleteMany({ where: { isDemo: true } });
  await db.lead.deleteMany({ where: { isDemo: true } });
  await db.portfolioProject.deleteMany({ where: { slug: { startsWith: "demo-" } } });
}
