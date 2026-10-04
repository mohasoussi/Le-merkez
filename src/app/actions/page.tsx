import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import ArticlesBoard from "@/components/sections/ArticlesBoard";
import { actions, getArticles } from "@/content/actions";

export const metadata: Metadata = {
  title: "Nos actions",
  description: "Les actions menées par le Merkez : rencontres interreligieuses, retraites, conférences, actions humanitaires et solidaires, marches, ouvrages.",
  alternates: { canonical: "/actions" },
};

/** Page « Nos actions » : les axes, puis toutes les actions menées (filtrables par catégorie). */
export default function ActionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Nos actions"
        title="Les actions menées"
        intro="Se rencontrer, dialoguer, se retirer, marcher, servir et transmettre : retrouvez ici chaque action du Merkez, par catégorie."
        seed={52}
      />

      <section className="bg-cream py-20 text-umber md:py-28">
        <div className="gutter mx-auto max-w-[1600px]">
          <h2 className="eyebrow mb-8 text-umber/60">Les axes</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {actions.map((a) => {
              const n = getArticles(a.slug).filter((x) => !x.placeholder).length;
              return (
                <li key={a.slug} className="group relative overflow-hidden rounded-[6px] p-6 text-cream transition-transform duration-500 ease-[var(--ease-silk)] hover:-translate-y-1" style={{ background: `linear-gradient(160deg, color-mix(in oklab, ${a.color} 80%, white), ${a.color} 50%, color-mix(in oklab, ${a.color} 70%, black))` }}>
                  <span className="text-[0.62rem] font-semibold tracking-[0.3em]" style={{ color: a.accent }}>
                    {a.number}
                  </span>
                  <h3 className="mt-3 text-xl font-light uppercase leading-tight tracking-[0.02em]">
                    <Link href={a.slug === "librairie" ? "/librairie" : `/actions/${a.slug}`} className="after:absolute after:inset-0">
                      {a.title}
                    </Link>
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-cream/85">{a.summary}</p>
                  <p className="mt-5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-cream/80">
                    {a.slug === "librairie" ? "Les ouvrages" : n > 0 ? `${n} action${n > 1 ? "s" : ""}` : "Bientôt"} <span aria-hidden="true">→</span>
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="mt-24">
            <ArticlesBoard limit={60} heading={false} />
          </div>
        </div>
      </section>
    </>
  );
}
