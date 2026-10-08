import type { Metadata } from "next";
import { requireAdminPage } from "@/server/auth/guards";
import { db } from "@/server/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { FaqForm } from "@/components/admin/content/FaqForm";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "FAQ" };

export default async function FaqAdminPage() {
  await requireAdminPage();
  const faqs = await db.faq.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  return (
    <>
      <PageHeader title="FAQ" description="Questions affichées sur la page d'accueil (et dans les données structurées Google)." />
      <div className="flex max-w-3xl flex-col gap-3">
        {faqs.map((f) => (
          <details key={f.id} className="rounded-2xl border border-line bg-white shadow-soft">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
              <span>
                <span className="mr-2 font-mono text-xs text-muted">{f.sortOrder}</span>
                {f.question}
              </span>
              {!f.isActive && <Badge>masquée</Badge>}
            </summary>
            <div className="border-t border-line p-5">
              <FaqForm v={{ id: f.id, question: f.question, answer: f.answer, isActive: f.isActive, sortOrder: f.sortOrder }} />
            </div>
          </details>
        ))}
        <div className="rounded-2xl border border-dashed border-line p-5">
          <p className="mb-3 text-sm font-medium">Nouvelle question</p>
          <FaqForm v={{ id: null, question: "", answer: "", isActive: true, sortOrder: faqs.length }} />
        </div>
      </div>
    </>
  );
}
