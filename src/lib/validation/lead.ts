import { z } from "zod";
import { BUDGETS, LEAD_SOURCES, NEEDS, PROJECT_TYPES, SECTORS, TIMELINES } from "@/lib/constants";

// Schéma partagé navigateur / serveur : mêmes règles et mêmes messages des deux côtés.

const text = (max: number) => z.string().trim().max(max, `${max} caractères maximum.`);
const required = (label: string, max = 120) => text(max).min(1, `${label} requis.`);
const optional = (max = 300) =>
  text(max)
    .optional()
    .transform((v) => (v ? v : undefined));

const phoneRegex = /^\+?[0-9 ().-]{6,25}$/;

export const leadStepSchemas = {
  project: z.object({
    projectType: z.enum(PROJECT_TYPES, "Choisissez un type de projet."),
    sector: z.enum(SECTORS, "Choisissez votre secteur."),
    budget: z.enum(BUDGETS, "Choisissez une fourchette de budget."),
    timeline: z.enum(TIMELINES, "Choisissez un délai."),
  }),
  needs: z.object({
    needs: z.array(z.enum(NEEDS)).max(NEEDS.length).default([]),
    needsOther: optional(300),
    description: text(5000).min(20, "Décrivez votre projet en quelques phrases (20 caractères minimum)."),
    references: optional(1000),
  }),
  company: z.object({
    companyName: required("Nom de l'entreprise"),
    activity: required("Activité"),
    city: required("Ville", 100),
    country: text(100).min(1, "Pays requis.").default("France"),
    currentWebsite: optional(300),
    instagram: optional(200),
    facebook: optional(300),
    otherSocial: optional(300),
  }),
  contact: z.object({
    firstName: required("Prénom", 80),
    lastName: required("Nom", 80),
    email: z.string().trim().toLowerCase().pipe(z.email("Adresse email invalide.")).pipe(z.string().max(200)),
    phone: text(25).regex(phoneRegex, "Numéro de téléphone invalide."),
    heardFrom: z.enum(LEAD_SOURCES).optional(),
    consent: z.literal(true, "Votre accord est nécessaire pour que nous puissions traiter votre demande."),
  }),
};

export const LEAD_STEPS = ["project", "needs", "company", "contact"] as const;
export type LeadStep = (typeof LEAD_STEPS)[number];

export const attributionSchema = z
  .object({
    utmSource: optional(100),
    utmMedium: optional(100),
    utmCampaign: optional(150),
    utmTerm: optional(150),
    utmContent: optional(150),
    referrer: optional(500),
    landingPath: optional(300),
  })
  .partial()
  .default({});

export const leadSubmissionSchema = leadStepSchemas.project
  .extend(leadStepSchemas.needs.shape)
  .extend(leadStepSchemas.company.shape)
  .extend(leadStepSchemas.contact.shape)
  .extend({
    offerSlug: optional(60),
    attribution: attributionSchema,
    // Anti-spam
    // Honeypot : doit rester vide. Contrôlé par le service, sans message d'erreur (aucun indice pour les robots).
    website2: z.string().max(2000).optional(),
    formToken: z.string().max(200).optional(),
    turnstileToken: z.string().max(4096).optional(),
  });

export type LeadSubmission = z.infer<typeof leadSubmissionSchema>;
export type LeadSubmissionInput = z.input<typeof leadSubmissionSchema>;
