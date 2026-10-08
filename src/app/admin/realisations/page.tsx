import type { Metadata } from "next";
import { requireAdminPage } from "@/server/auth/guards";
import { db } from "@/server/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { PortfolioForm } from "@/components/admin/content/PortfolioForm";
import { Badge } from "@/components/ui/Badge";
import { SECTOR_LABELS } from "@/lib/constants";
import { mediaUrl } from "@/lib/media";
import { toDateInput } from "@/lib/format";

export const metadata: Metadata = { title: "Réalisations" };

export default async function PortfolioAdminPage() {
  await requireAdminPage();
  const items = await db.portfolioProject.findMany({ orderBy: [{ sortOrder: "asc" }, { date: "desc" }] });
  return (
    <>
      <PageHeader title="Réalisations" description="Galerie de la section « Réalisations ». Sans image, une maquette stylisée est affichée." />
      <div className="flex max-w-4xl flex-col gap-3">
        {items.map((p) => (
          <details key={p.id} className="rounded-2xl border border-line bg-white shadow-soft">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0">
                <span className="block truncate font-medium">{p.name}</span>
                <span className="text-xs text-muted">{SECTOR_LABELS[p.category]}</span>
              </span>
              <Badge tone={p.status === "PUBLISHED" ? "success" : "neutral"}>{p.status === "PUBLISHED" ? "Publié" : "Brouillon"}</Badge>
            </summary>
            <div className="border-t border-line p-5">
              <PortfolioForm
                v={{
                  id: p.id,
                  name: p.name,
                  category: p.category,
                  description: p.description,
                  url: p.url ?? "",
                  imageUrl: p.imageUrl ?? "",
                  imageAlt: p.imageAlt ?? "",
                  imagePreview: p.imageKey ? mediaUrl(p.imageKey) : p.imageUrl,
                  technologies: p.technologies.join(", "),
                  date: toDateInput(p.date),
                  status: p.status,
                  sortOrder: p.sortOrder,
                }}
              />
            </div>
          </details>
        ))}
        <div className="rounded-2xl border border-dashed border-line p-5">
          <p className="mb-3 text-sm font-medium">Nouvelle réalisation</p>
          <PortfolioForm v={{ id: null, name: "", category: "RESTAURANT", description: "", url: "", imageUrl: "", imageAlt: "", imagePreview: null, technologies: "", date: "", status: "DRAFT", sortOrder: items.length }} />
        </div>
      </div>
    </>
  );
}
