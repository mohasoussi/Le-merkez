import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "@/server/db";
import { getSettings } from "@/server/services/settings";

/** Tag de cache du contenu public : invalidé à chaque modification dans l'administration. */
export const PUBLIC_CONTENT_TAG = "public-content";

const opts = { tags: [PUBLIC_CONTENT_TAG], revalidate: 3600 };

export const getPublicSettings = unstable_cache(() => getSettings(), ["settings"], opts);

export const getPublicOffers = unstable_cache(
  () =>
    db.offer.findMany({
      where: { isActive: true },
      orderBy: [{ type: "asc" }, { sortOrder: "asc" }, { priceCents: "asc" }],
    }),
  ["offers"],
  opts,
);

export const getPublicOptions = unstable_cache(
  () => db.offerOption.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
  ["options"],
  opts,
);

export const getPublicFaqs = unstable_cache(
  () => db.faq.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
  ["faqs"],
  opts,
);

export const getPublicPortfolio = unstable_cache(
  () => db.portfolioProject.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ sortOrder: "asc" }, { date: "desc" }] }),
  ["portfolio"],
  opts,
);
