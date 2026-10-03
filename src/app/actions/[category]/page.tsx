import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import ArticleCard from "@/components/ui/ArticleCard";
import Button from "@/components/ui/Button";
import { actions, getAction, getArticles } from "@/content/actions";

export function generateStaticParams() {
  return actions.map((a) => ({ category: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const action = getAction(category);
  if (!action) return {};
  return {
    title: action.title,
    description: action.summary,
    alternates: { canonical: `/actions/${action.slug}` },
    openGraph: { title: `${action.title} — Le Merkez`, description: action.summary, url: `/actions/${action.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const action = getAction(category);
  if (!action) notFound();
  const list = getArticles(action.slug);

  return (
    <>
      <PageHeader eyebrow={`${action.number} — Nos actions`} title={action.title} intro={action.summary} color={action.color} seed={Number(action.number) * 7} />
      <section className="bg-cream py-20 text-umber md:py-28">
        <div className="gutter mx-auto max-w-[1600px]">
          <nav aria-label="Catégories" className="mb-14 flex flex-wrap gap-2">
            {actions.map((a) => (
              <Link
                key={a.slug}
                href={`/actions/${a.slug}`}
                aria-current={a.slug === action.slug ? "page" : undefined}
                className="rounded-full border border-umber/25 px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] transition-colors hover:border-umber aria-[current=page]:border-umber aria-[current=page]:bg-umber aria-[current=page]:text-cream"
              >
                {a.short}
              </Link>
            ))}
          </nav>

          {action.highlights && (
            <ul className="mb-16 flex flex-wrap gap-x-8 gap-y-3 border-y border-umber/15 py-6 text-sm font-medium uppercase tracking-[0.16em] text-umber/75">
              {action.highlights.map((h) => (
                <li key={h} className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-2 w-2" style={{ backgroundColor: action.color }} />
                  {h}
                </li>
              ))}
            </ul>
          )}

          <h2 className="eyebrow mb-10 text-umber/60">Actions menées</h2>
          {list.length ? (
            <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((a, i) => (
                <ArticleCard key={a.slug} article={a} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-umber/70">Aucune action publiée pour le moment.</p>
          )}

          {action.slug === "librairie" && (
            <div className="mt-16">
              <Button href="/librairie" variant="dark">
                Découvrir les livres
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
