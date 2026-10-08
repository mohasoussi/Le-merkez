import type { PrismaClient } from "../src/generated/prisma/client";

/**
 * Contenu RÉEL de départ (issu du cahier des charges) : offres, options, FAQ, réglages.
 * Idempotent et non destructif : n'écrase jamais une valeur déjà modifiée dans l'administration.
 * Les réponses de la FAQ sont des propositions à relire et ajuster dans /admin/faq.
 */

const SITE_OFFERS = [
  {
    slug: "starter",
    name: "Starter",
    tagline: "L'essentiel pour être visible et rassurer vos clients.",
    priceCents: 59000,
    features: ["1 à 3 pages", "Design personnalisé", "Responsive mobile", "Formulaire de contact", "Google Maps si nécessaire", "Mise en ligne"],
  },
  {
    slug: "pro",
    name: "Pro",
    tagline: "Un site complet pour présenter toute votre activité.",
    priceCents: 99000,
    highlighted: true,
    features: ["5 à 7 pages", "Design personnalisé", "Responsive", "Animations", "Formulaire", "Google Maps", "SEO de base", "Galerie", "Mise en ligne"],
  },
  {
    slug: "premium",
    name: "Premium",
    tagline: "Un site entièrement sur mesure, pensé pour convertir.",
    priceCents: 149000,
    features: [
      "Site entièrement sur mesure",
      "Design avancé",
      "Animations avancées",
      "SEO",
      "Fonctionnalités spécifiques",
      "Blog ou actualités si nécessaire",
      "Accompagnement personnalisé",
      "Mise en ligne",
    ],
  },
];

const MAINTENANCE_PLANS = [
  { slug: "maintenance-basic", name: "Basic", priceCents: 2900, features: ["Mises à jour de sécurité", "Sauvegardes", "Surveillance du site"] },
  { slug: "maintenance-pro", name: "Pro", priceCents: 5900, features: ["Tout Basic", "Petites modifications de contenu chaque mois", "Support prioritaire"] },
  { slug: "maintenance-premium", name: "Premium", priceCents: 9900, features: ["Tout Pro", "Évolutions régulières", "Suivi SEO", "Rapport mensuel"] },
];

const OPTIONS = [
  "Rédaction des textes",
  "Création de logo",
  "Traduction",
  "Réservation en ligne",
  "Système de commande",
  "E-commerce",
  "Fonctionnalités personnalisées",
  "Maintenance",
  "Hébergement",
  "Référencement avancé",
];

const FAQS: [string, string][] = [
  ["Combien coûte un site ?", "Nos offres démarrent à partir du prix indiqué pour chaque formule (Starter, Pro, Premium). Le prix final dépend du nombre de pages et des fonctionnalités : après notre échange, vous recevez un devis clair, sans surprise."],
  ["Combien de temps faut-il pour créer le site ?", "Le délai dépend de la formule et de la rapidité à réunir vos contenus (textes, photos, logo). Nous vous indiquons un planning précis dans le devis, et vous suivez l'avancement en temps réel depuis votre espace client."],
  ["Dois-je fournir les textes ?", "Vous pouvez fournir vos textes, ou nous confier leur rédaction grâce à l'option « Rédaction des textes ». Dans tous les cas, nous vous guidons avec un brief simple à remplir."],
  ["Dois-je fournir les photos ?", "Idéalement oui : vos propres photos rassurent davantage vos clients. Si vous n'en avez pas encore, nous pouvons utiliser des images libres de droits de qualité en attendant."],
  ["Le site est-il adapté au mobile ?", "Oui, toujours. La majorité de vos visiteurs arrivent depuis leur téléphone : chaque site est conçu d'abord pour le mobile, puis adapté aux tablettes et ordinateurs."],
  ["Puis-je modifier mon site ?", "Oui. Selon vos besoins, nous pouvons prévoir un espace pour modifier vous-même certains contenus, ou nous charger des modifications dans le cadre d'une formule de maintenance."],
  ["Est-ce que vous vous occupez du nom de domaine ?", "Oui, nous pouvons vous accompagner dans le choix et la réservation de votre nom de domaine. Il reste à votre nom : vous en êtes propriétaire."],
  ["Est-ce que vous vous occupez de l'hébergement ?", "Oui, nous pouvons prendre en charge l'hébergement pour que vous n'ayez rien à gérer. Les conditions sont précisées dans le devis."],
  ["Proposez-vous une maintenance ?", "Oui, avec trois formules mensuelles (Basic, Pro, Premium) : mises à jour, sauvegardes, sécurité et, selon la formule, modifications et suivi du référencement."],
  ["Puis-je demander des fonctionnalités spécifiques ?", "Bien sûr : réservation, prise de rendez-vous, boutique en ligne, espace membre… Décrivez votre besoin dans le formulaire, nous étudions sa faisabilité et l'intégrons au devis."],
];

export async function seedContent(db: PrismaClient) {
  await db.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });

  let order = 0;
  for (const o of SITE_OFFERS) {
    await db.offer.upsert({
      where: { slug: o.slug },
      update: {},
      create: { ...o, type: "SITE", priceLabel: "à partir de", sortOrder: order++ },
    });
  }
  order = 0;
  for (const m of MAINTENANCE_PLANS) {
    await db.offer.upsert({
      where: { slug: m.slug },
      update: {},
      create: { ...m, type: "MAINTENANCE", tagline: null, sortOrder: order++ },
    });
  }
  if ((await db.offerOption.count()) === 0) {
    await db.offerOption.createMany({ data: OPTIONS.map((name, i) => ({ name, sortOrder: i, priceCents: null })) });
  }
  if ((await db.faq.count()) === 0) {
    await db.faq.createMany({ data: FAQS.map(([question, answer], i) => ({ question, answer, sortOrder: i })) });
  }
}
