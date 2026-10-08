import "server-only";
import { z } from "@/lib/zod";
import { db } from "@/server/db";
import { AppError, notFound } from "@/server/errors";
import { assertAdmin } from "@/server/auth/guards";
import type { Actor } from "@/server/auth/session";
import { SECTORS } from "@/lib/constants";
import { slugify } from "@/lib/format";
import { storage } from "@/server/storage";
import { detectFileType } from "@/server/storage/file-types";
import { createId } from "./ids";
import { env } from "@/server/env";

// Contenus du site public modifiables sans toucher au code : offres, options, réalisations, FAQ, réglages.

const optionalUrl = z.union([z.url("URL invalide (commencez par https://)."), z.literal("")]).optional().transform((v) => v || null);

export const offerSchema = z.object({
  name: z.string().trim().min(1, "Nom requis.").max(80),
  tagline: z.string().trim().max(200).optional().transform((v) => v || null),
  priceCents: z.number().int().min(0).max(100_000_000),
  priceLabel: z.string().trim().max(40).optional().transform((v) => v || null),
  features: z.array(z.string().trim().min(1).max(200)).max(30),
  highlighted: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0).max(1000),
  type: z.enum(["SITE", "MAINTENANCE"]),
});

export async function saveOffer(actor: Actor, id: string | null, input: z.input<typeof offerSchema>) {
  assertAdmin(actor);
  const data = offerSchema.parse(input);
  if (id) return db.offer.update({ where: { id }, data });
  let slug = slugify(data.name) || "offre";
  if (await db.offer.findUnique({ where: { slug } })) slug = `${slug}-${Date.now().toString(36)}`;
  return db.offer.create({ data: { ...data, slug } });
}

export async function deleteOffer(actor: Actor, id: string) {
  assertAdmin(actor);
  const used = await db.offer.findUnique({ where: { id }, include: { _count: { select: { leads: true, projects: true, subscriptions: true } } } });
  if (!used) throw notFound("Offre");
  if (used._count.leads + used._count.projects + used._count.subscriptions > 0) throw new AppError("Cette offre est utilisée par des prospects, projets ou abonnements : désactivez-la plutôt que de la supprimer.", "CONFLICT");
  await db.offer.delete({ where: { id } });
}

export const optionSchema = z.object({
  name: z.string().trim().min(1, "Nom requis.").max(120),
  description: z.string().trim().max(500).optional().transform((v) => v || null),
  priceCents: z.number().int().min(0).max(100_000_000).nullable(),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0).max(1000),
});

export async function saveOption(actor: Actor, id: string | null, input: z.input<typeof optionSchema>) {
  assertAdmin(actor);
  const data = optionSchema.parse(input);
  return id ? db.offerOption.update({ where: { id }, data }) : db.offerOption.create({ data });
}

export async function deleteOption(actor: Actor, id: string) {
  assertAdmin(actor);
  await db.offerOption.delete({ where: { id } });
}

export const faqSchema = z.object({
  question: z.string().trim().min(3, "Question requise.").max(300),
  answer: z.string().trim().min(3, "Réponse requise.").max(3000),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0).max(1000),
});

export async function saveFaq(actor: Actor, id: string | null, input: z.input<typeof faqSchema>) {
  assertAdmin(actor);
  const data = faqSchema.parse(input);
  return id ? db.faq.update({ where: { id }, data }) : db.faq.create({ data });
}

export async function deleteFaq(actor: Actor, id: string) {
  assertAdmin(actor);
  await db.faq.delete({ where: { id } });
}

export const portfolioSchema = z.object({
  name: z.string().trim().min(1, "Nom requis.").max(120),
  category: z.enum(SECTORS),
  description: z.string().trim().min(1, "Description requise.").max(600),
  url: optionalUrl,
  imageUrl: optionalUrl,
  imageAlt: z.string().trim().max(200).optional().transform((v) => v || null),
  technologies: z.array(z.string().trim().min(1).max(60)).max(15),
  date: z.coerce.date().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  sortOrder: z.number().int().min(0).max(1000),
});

/** Image d'une réalisation : stockée sous « public/ » (servie par /media), uniquement JPG/PNG/WebP/AVIF/GIF. */
async function storePortfolioImage(file: { name: string; bytes: Uint8Array }) {
  const type = detectFileType(file.name, file.bytes);
  if (!type?.image) throw new AppError("Image invalide (JPG, PNG, WebP, AVIF ou GIF).", "VALIDATION", { image: "Image invalide." });
  if (file.bytes.byteLength > env().UPLOAD_MAX_MB * 1024 * 1024) throw new AppError("Image trop volumineuse.", "VALIDATION", { image: "Image trop volumineuse." });
  const key = `public/portfolio/${createId()}.${type.ext}`;
  await storage().put(key, file.bytes, type.mime);
  return key;
}

export async function savePortfolio(actor: Actor, id: string | null, input: z.input<typeof portfolioSchema>, image?: { name: string; bytes: Uint8Array } | null, removeImage?: boolean) {
  assertAdmin(actor);
  const data = portfolioSchema.parse(input);
  const existing = id ? await db.portfolioProject.findUnique({ where: { id } }) : null;
  if (id && !existing) throw notFound("Réalisation");
  let imageKey = existing?.imageKey ?? null;
  if (image) imageKey = await storePortfolioImage(image);
  else if (removeImage) imageKey = null;
  if (existing?.imageKey && existing.imageKey !== imageKey) await storage().delete(existing.imageKey).catch(() => {});
  if (id) return db.portfolioProject.update({ where: { id }, data: { ...data, imageKey } });
  let slug = slugify(data.name) || "realisation";
  if (await db.portfolioProject.findUnique({ where: { slug } })) slug = `${slug}-${Date.now().toString(36)}`;
  return db.portfolioProject.create({ data: { ...data, imageKey, slug } });
}

export async function deletePortfolio(actor: Actor, id: string) {
  assertAdmin(actor);
  const p = await db.portfolioProject.findUnique({ where: { id } });
  if (!p) throw notFound("Réalisation");
  await db.portfolioProject.delete({ where: { id } });
  if (p.imageKey) await storage().delete(p.imageKey).catch(() => {});
}

const text = (max: number) => z.string().trim().max(max).optional().transform((v) => v || null);
export const settingsSchema = z.object({
  brandName: z.string().trim().min(1, "Nom requis.").max(60),
  heroTitle: z.string().trim().min(1).max(160),
  heroSubtitle: z.string().trim().min(1).max(300),
  problemQuote: z.string().trim().min(1).max(300),
  ctaTitle: z.string().trim().min(1).max(160),
  ctaSubtitle: z.string().trim().min(1).max(300),
  seoTitle: z.string().trim().min(1).max(120),
  seoDescription: z.string().trim().min(1).max(300),
  contactEmail: z.union([z.email("Email invalide."), z.literal("")]).optional().transform((v) => v || null),
  phone: text(40),
  address: text(300),
  city: text(100),
  instagramUrl: optionalUrl,
  tiktokUrl: optionalUrl,
  facebookUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  legalName: text(150),
  legalForm: text(100),
  siret: text(20),
  vatNumber: text(30),
  hostingInfo: text(500),
  vatRateBps: z.number().int().min(0).max(10_000),
  vatMention: text(200),
  depositPercent: z.number().int().min(0).max(100),
  quoteValidityDays: z.number().int().min(1).max(365),
});

export async function saveSettings(actor: Actor, input: z.input<typeof settingsSchema>) {
  assertAdmin(actor);
  const data = settingsSchema.parse(input);
  await db.siteSettings.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
}
