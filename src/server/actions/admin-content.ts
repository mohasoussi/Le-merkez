"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "@/lib/zod";
import { requireAdmin } from "@/server/auth/guards";
import * as content from "@/server/services/content";
import { PUBLIC_CONTENT_TAG } from "@/server/public-content";
import { AppError } from "@/server/errors";
import { parseEuroToCents } from "@/lib/format";
import { ok, runAction } from "./result";

const id = z.string().min(1).max(40);

/** Le site public est mis en cache : chaque modification invalide immédiatement ce cache. */
function refreshPublic(path: string) {
  updateTag(PUBLIC_CONTENT_TAG);
  revalidatePath(path);
}

const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
const bool = (v: FormDataEntryValue | null) => v === "on";
const num = (v: FormDataEntryValue | null, d = 0) => (v === null || v === "" ? d : Number(v));
function euros(v: FormDataEntryValue | null, field: string, nullable = false) {
  const c = parseEuroToCents(String(v ?? ""));
  if (c === null && nullable) return null;
  if (c === null || Number.isNaN(c)) throw new AppError("Prix invalide.", "VALIDATION", { [field]: "Prix invalide." });
  return c;
}

export async function saveOfferAction(offerId: string | null, _: unknown, fd: FormData) {
  return runAction("saveOffer", async () => {
    const actor = await requireAdmin();
    await content.saveOffer(actor, offerId ? id.parse(offerId) : null, {
      name: String(fd.get("name") ?? ""),
      tagline: String(fd.get("tagline") ?? ""),
      priceCents: euros(fd.get("price"), "price")!,
      priceLabel: String(fd.get("priceLabel") ?? ""),
      features: lines(fd.get("features")),
      highlighted: bool(fd.get("highlighted")),
      isActive: bool(fd.get("isActive")),
      sortOrder: num(fd.get("sortOrder")),
      type: fd.get("type") === "MAINTENANCE" ? "MAINTENANCE" : "SITE",
    });
    refreshPublic("/admin/offres");
    return ok("Offre enregistrée. Le site public est à jour.");
  });
}

export async function deleteOfferAction(offerId: string) {
  return runAction("deleteOffer", async () => {
    await content.deleteOffer(await requireAdmin(), id.parse(offerId));
    refreshPublic("/admin/offres");
  });
}

export async function saveOptionAction(optionId: string | null, _: unknown, fd: FormData) {
  return runAction("saveOption", async () => {
    const actor = await requireAdmin();
    await content.saveOption(actor, optionId ? id.parse(optionId) : null, {
      name: String(fd.get("name") ?? ""),
      description: String(fd.get("description") ?? ""),
      priceCents: euros(fd.get("price"), "price", true),
      isActive: bool(fd.get("isActive")),
      sortOrder: num(fd.get("sortOrder")),
    });
    refreshPublic("/admin/offres");
    return ok("Option enregistrée.");
  });
}

export async function deleteOptionAction(optionId: string) {
  return runAction("deleteOption", async () => {
    await content.deleteOption(await requireAdmin(), id.parse(optionId));
    refreshPublic("/admin/offres");
  });
}

export async function saveFaqAction(faqId: string | null, _: unknown, fd: FormData) {
  return runAction("saveFaq", async () => {
    const actor = await requireAdmin();
    await content.saveFaq(actor, faqId ? id.parse(faqId) : null, {
      question: String(fd.get("question") ?? ""),
      answer: String(fd.get("answer") ?? ""),
      isActive: bool(fd.get("isActive")),
      sortOrder: num(fd.get("sortOrder")),
    });
    refreshPublic("/admin/faq");
    return ok("Question enregistrée.");
  });
}

export async function deleteFaqAction(faqId: string) {
  return runAction("deleteFaq", async () => {
    await content.deleteFaq(await requireAdmin(), id.parse(faqId));
    refreshPublic("/admin/faq");
  });
}

export async function savePortfolioAction(itemId: string | null, _: unknown, fd: FormData) {
  return runAction("savePortfolio", async () => {
    const actor = await requireAdmin();
    const file = fd.get("image");
    const image = file instanceof File && file.size > 0 ? { name: file.name, bytes: new Uint8Array(await file.arrayBuffer()) } : null;
    await content.savePortfolio(
      actor,
      itemId ? id.parse(itemId) : null,
      {
        name: String(fd.get("name") ?? ""),
        category: String(fd.get("category") ?? "OTHER") as never,
        description: String(fd.get("description") ?? ""),
        url: String(fd.get("url") ?? ""),
        imageUrl: String(fd.get("imageUrl") ?? ""),
        imageAlt: String(fd.get("imageAlt") ?? ""),
        technologies: String(fd.get("technologies") ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        date: fd.get("date") ? new Date(String(fd.get("date"))) : null,
        status: fd.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
        sortOrder: num(fd.get("sortOrder")),
      },
      image,
      bool(fd.get("removeImage")),
    );
    refreshPublic("/admin/realisations");
    return ok("Réalisation enregistrée.");
  });
}

export async function deletePortfolioAction(itemId: string) {
  return runAction("deletePortfolio", async () => {
    await content.deletePortfolio(await requireAdmin(), id.parse(itemId));
    refreshPublic("/admin/realisations");
  });
}

export async function saveSettingsAction(_: unknown, fd: FormData) {
  return runAction("saveSettings", async () => {
    const actor = await requireAdmin();
    const f = Object.fromEntries([...fd.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;
    await content.saveSettings(actor, {
      ...f,
      brandName: f.brandName ?? "",
      heroTitle: f.heroTitle ?? "",
      heroSubtitle: f.heroSubtitle ?? "",
      problemQuote: f.problemQuote ?? "",
      ctaTitle: f.ctaTitle ?? "",
      ctaSubtitle: f.ctaSubtitle ?? "",
      seoTitle: f.seoTitle ?? "",
      seoDescription: f.seoDescription ?? "",
      vatRateBps: Math.round(Number((f.vatRate ?? "0").replace(",", ".")) * 100),
      depositPercent: num(fd.get("depositPercent"), 50),
      quoteValidityDays: num(fd.get("quoteValidityDays"), 30),
    });
    updateTag(PUBLIC_CONTENT_TAG);
    revalidatePath("/", "layout");
    return ok("Paramètres enregistrés. Le site public est à jour.");
  });
}
