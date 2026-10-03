import type { MetadataRoute } from "next";
import { actions, articles } from "@/content/actions";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const pages = ["", "/actualites", "/librairie"].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
  const categories = actions.map((a) => ({ url: `${base}/actions/${a.slug}`, changeFrequency: "weekly" as const, priority: 0.6 }));
  // Les articles modèles (placeholder) ne sont pas listés.
  const posts = articles
    .filter((a) => !a.placeholder)
    .map((a) => ({ url: `${base}/actions/${a.category}/${a.slug}`, lastModified: a.date ?? undefined, priority: 0.5 }));
  return [...pages, ...categories, ...posts];
}
