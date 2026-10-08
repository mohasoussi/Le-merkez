// Libellés et règles métier partagés entre le navigateur et le serveur.
// Ce fichier n'importe PAS le client Prisma : les enums sont redéclarés ici comme tuples
// (et vérifiés contre Prisma dans tests/constants.test.ts).

export const PIPELINE_STAGES = [
  "NEW",
  "TO_QUALIFY",
  "CALL_SCHEDULED",
  "CALL_DONE",
  "QUOTE_SENT",
  "NEGOTIATION",
  "DEPOSIT_RECEIVED",
  "IN_PRODUCTION",
  "CLIENT_REVIEW",
  "COMPLETED",
  "MAINTENANCE",
  "LOST",
] as const;
export type PipelineStageCode = (typeof PIPELINE_STAGES)[number];

export const PIPELINE_STAGE_LABELS: Record<PipelineStageCode, string> = {
  NEW: "Nouveau prospect",
  TO_QUALIFY: "À qualifier",
  CALL_SCHEDULED: "Appel programmé",
  CALL_DONE: "Appel réalisé",
  QUOTE_SENT: "Devis envoyé",
  NEGOTIATION: "Négociation",
  DEPOSIT_RECEIVED: "Acompte reçu",
  IN_PRODUCTION: "En production",
  CLIENT_REVIEW: "Validation client",
  COMPLETED: "Terminé",
  MAINTENANCE: "Maintenance",
  LOST: "Perdu",
};

/** Étapes « ouvertes » : la valeur du pipeline compte pour le CA potentiel. */
export const OPEN_PIPELINE_STAGES: PipelineStageCode[] = [
  "NEW",
  "TO_QUALIFY",
  "CALL_SCHEDULED",
  "CALL_DONE",
  "QUOTE_SENT",
  "NEGOTIATION",
];
/** Étapes où l'affaire est signée (acompte reçu ou au-delà). */
export const WON_PIPELINE_STAGES: PipelineStageCode[] = [
  "DEPOSIT_RECEIVED",
  "IN_PRODUCTION",
  "CLIENT_REVIEW",
  "COMPLETED",
  "MAINTENANCE",
];

export const LEAD_SOURCES = ["TIKTOK", "INSTAGRAM", "FACEBOOK", "GOOGLE", "SEO", "REFERRAL", "ADS", "DIRECT", "OTHER"] as const;
export type LeadSourceCode = (typeof LEAD_SOURCES)[number];
export const LEAD_SOURCE_LABELS: Record<LeadSourceCode, string> = {
  TIKTOK: "TikTok",
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
  GOOGLE: "Google",
  SEO: "Référencement",
  REFERRAL: "Recommandation",
  ADS: "Publicité",
  DIRECT: "Direct",
  OTHER: "Autre",
};

export const PROJECT_TYPES = ["NEW_SITE", "REDESIGN", "LANDING_PAGE", "RESTAURANT_SITE", "SHOWCASE_SITE", "ECOMMERCE", "OTHER"] as const;
export type ProjectTypeCode = (typeof PROJECT_TYPES)[number];
export const PROJECT_TYPE_LABELS: Record<ProjectTypeCode, string> = {
  NEW_SITE: "Nouveau site",
  REDESIGN: "Refonte de site",
  LANDING_PAGE: "Landing page",
  RESTAURANT_SITE: "Site restaurant",
  SHOWCASE_SITE: "Site vitrine",
  ECOMMERCE: "E-commerce",
  OTHER: "Autre",
};

export const SECTORS = [
  "RESTAURANT",
  "RETAIL",
  "CRAFTSMAN",
  "CONSULTANT",
  "FREELANCER",
  "ASSOCIATION",
  "LIBERAL_PROFESSION",
  "SMALL_BUSINESS",
  "OTHER",
] as const;
export type SectorCode = (typeof SECTORS)[number];
export const SECTOR_LABELS: Record<SectorCode, string> = {
  RESTAURANT: "Restaurant",
  RETAIL: "Commerce",
  CRAFTSMAN: "Artisan",
  CONSULTANT: "Consultant",
  FREELANCER: "Indépendant",
  ASSOCIATION: "Association",
  LIBERAL_PROFESSION: "Profession libérale",
  SMALL_BUSINESS: "Petite entreprise",
  OTHER: "Autre",
};
/** Secteurs proposés dans le formulaire public (ordre du cahier des charges). */
export const FORM_SECTORS: SectorCode[] = [
  "RESTAURANT",
  "RETAIL",
  "CRAFTSMAN",
  "CONSULTANT",
  "FREELANCER",
  "ASSOCIATION",
  "LIBERAL_PROFESSION",
  "OTHER",
];

export const BUDGETS = ["UNDER_500", "FROM_500_TO_1000", "FROM_1000_TO_1500", "FROM_1500_TO_3000", "OVER_3000"] as const;
export type BudgetCode = (typeof BUDGETS)[number];
export const BUDGET_LABELS: Record<BudgetCode, string> = {
  UNDER_500: "Moins de 500 €",
  FROM_500_TO_1000: "500 – 1 000 €",
  FROM_1000_TO_1500: "1 000 – 1 500 €",
  FROM_1500_TO_3000: "1 500 – 3 000 €",
  OVER_3000: "Plus de 3 000 €",
};

export const TIMELINES = ["ASAP", "WITHIN_MONTH", "ONE_TO_THREE_MONTHS", "LATER"] as const;
export type TimelineCode = (typeof TIMELINES)[number];
export const TIMELINE_LABELS: Record<TimelineCode, string> = {
  ASAP: "Dès que possible",
  WITHIN_MONTH: "Dans le mois",
  ONE_TO_THREE_MONTHS: "Dans 1 à 3 mois",
  LATER: "Plus tard",
};

export const NEEDS = [
  "COMPANY_PRESENTATION",
  "SERVICES",
  "PHOTO_GALLERY",
  "RESTAURANT_MENU",
  "RESERVATION",
  "APPOINTMENTS",
  "CONTACT_FORM",
  "GOOGLE_MAPS",
  "BLOG",
  "ECOMMERCE",
  "ONLINE_PAYMENT",
  "MULTILINGUAL",
  "SOCIAL_NETWORKS",
  "OTHER",
] as const;
export type NeedCode = (typeof NEEDS)[number];
export const NEED_LABELS: Record<NeedCode, string> = {
  COMPANY_PRESENTATION: "Présentation de l'entreprise",
  SERVICES: "Présentation des services",
  PHOTO_GALLERY: "Galerie photos",
  RESTAURANT_MENU: "Menu restaurant",
  RESERVATION: "Réservation",
  APPOINTMENTS: "Prise de rendez-vous",
  CONTACT_FORM: "Formulaire de contact",
  GOOGLE_MAPS: "Google Maps",
  BLOG: "Blog",
  ECOMMERCE: "E-commerce",
  ONLINE_PAYMENT: "Paiement en ligne",
  MULTILINGUAL: "Multilingue",
  SOCIAL_NETWORKS: "Réseaux sociaux",
  OTHER: "Autre",
};

// ─────────────────────────────── Projets

export const PROJECT_STATUSES = ["BRIEF", "DESIGN", "DEVELOPMENT", "REVISION", "VALIDATION", "LAUNCH", "DONE"] as const;
export type ProjectStatusCode = (typeof PROJECT_STATUSES)[number];
export const PROJECT_STATUS_LABELS: Record<ProjectStatusCode, string> = {
  BRIEF: "Brief",
  DESIGN: "Design",
  DEVELOPMENT: "Développement",
  REVISION: "Révision",
  VALIDATION: "Validation",
  LAUNCH: "Mise en ligne",
  DONE: "Terminé",
};
/** Progression par défaut associée à chaque statut (modifiable projet par projet). */
export const PROJECT_STATUS_PROGRESS: Record<ProjectStatusCode, number> = {
  BRIEF: 10,
  DESIGN: 30,
  DEVELOPMENT: 55,
  REVISION: 75,
  VALIDATION: 85,
  LAUNCH: 95,
  DONE: 100,
};

export function projectProgress(p: { status: ProjectStatusCode; progressOverride: number | null }) {
  return p.progressOverride ?? PROJECT_STATUS_PROGRESS[p.status];
}

export type TimelineState = "done" | "current" | "upcoming";
export interface TimelineStep {
  key: string;
  label: string;
  state: TimelineState;
}

/** Timeline affichée au client, dérivée de l'état réel du projet. */
export function clientTimeline(p: {
  status: ProjectStatusCode;
  briefSubmitted: boolean;
  contentReceived: boolean;
}): TimelineStep[] {
  const order = PROJECT_STATUSES.indexOf(p.status);
  const at = (s: ProjectStatusCode) => PROJECT_STATUSES.indexOf(s);
  const phase = (from: ProjectStatusCode, to: ProjectStatusCode): TimelineState =>
    order > at(to) ? "done" : order >= at(from) ? "current" : "upcoming";

  return [
    { key: "brief", label: "Brief reçu", state: p.briefSubmitted || order > at("BRIEF") ? "done" : "current" },
    {
      key: "content",
      label: "Contenus reçus",
      state: p.contentReceived ? "done" : order > at("BRIEF") || p.briefSubmitted ? "current" : "upcoming",
    },
    { key: "design", label: "Design", state: phase("DESIGN", "DESIGN") },
    { key: "development", label: "Développement", state: phase("DEVELOPMENT", "REVISION") },
    { key: "validation", label: "Validation", state: phase("VALIDATION", "VALIDATION") },
    { key: "launch", label: "Mise en ligne", state: p.status === "DONE" ? "done" : p.status === "LAUNCH" ? "current" : "upcoming" },
  ];
}

// ─────────────────────────────── Fichiers

export const FILE_CATEGORIES = ["LOGO", "PHOTOS", "TEXTS", "BRAND", "DOCUMENTS", "OTHER"] as const;
export type FileCategoryCode = (typeof FILE_CATEGORIES)[number];
export const FILE_CATEGORY_LABELS: Record<FileCategoryCode, string> = {
  LOGO: "Logo",
  PHOTOS: "Photos",
  TEXTS: "Textes",
  BRAND: "Charte graphique",
  DOCUMENTS: "Documents",
  OTHER: "Autres",
};

// ─────────────────────────────── Devis, paiements, maintenance

export const QUOTE_STATUSES = ["DRAFT", "SENT", "ACCEPTED", "REFUSED", "EXPIRED"] as const;
export type QuoteStatusCode = (typeof QUOTE_STATUSES)[number];
export const QUOTE_STATUS_LABELS: Record<QuoteStatusCode, string> = {
  DRAFT: "Brouillon",
  SENT: "Envoyé",
  ACCEPTED: "Accepté",
  REFUSED: "Refusé",
  EXPIRED: "Expiré",
};

export const PAYMENT_KINDS = ["DEPOSIT", "BALANCE", "MAINTENANCE", "OTHER"] as const;
export type PaymentKindCode = (typeof PAYMENT_KINDS)[number];
export const PAYMENT_KIND_LABELS: Record<PaymentKindCode, string> = {
  DEPOSIT: "Acompte",
  BALANCE: "Solde",
  MAINTENANCE: "Maintenance",
  OTHER: "Autre",
};

export const PAYMENT_METHODS = ["TRANSFER", "CARD", "CASH", "CHECK", "OTHER"] as const;
export type PaymentMethodCode = (typeof PAYMENT_METHODS)[number];
export const PAYMENT_METHOD_LABELS: Record<PaymentMethodCode, string> = {
  TRANSFER: "Virement",
  CARD: "Carte",
  CASH: "Espèces",
  CHECK: "Chèque",
  OTHER: "Autre",
};

export const SUBSCRIPTION_STATUSES = ["ACTIVE", "PAUSED", "CANCELLED"] as const;
export type SubscriptionStatusCode = (typeof SUBSCRIPTION_STATUSES)[number];
export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatusCode, string> = {
  ACTIVE: "Actif",
  PAUSED: "En pause",
  CANCELLED: "Résilié",
};

/** Version du texte de consentement affiché sous le formulaire. À incrémenter si le texte change. */
export const CONSENT_VERSION = "2026-10-v1";
