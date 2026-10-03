import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import Photo from "@/components/ui/Photo";
import { articles, getAction, getArticle } from "@/content/actions";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return articles.map((a) => ({ category: a.category, slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/actions/${category}/${slug}` },
    // Les modèles de démonstration ne doivent pas être indexés.
    robots: article.placeholder ? { index: false, follow: true } : undefined,
    openGraph: { type: "article", title: article.title, description: article.excerpt, publishedTime: article.date ?? undefined },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  const action = getAction(category);
  if (!article || !action) notFound();

  return (
    <article>
      <PageHeader eyebrow={`${action.short} — ${formatDate(article.date)}`} title={article.title} color={action.color} seed={slug.length * 3} />
      <div className="bg-cream text-umber">
        <div className="gutter mx-auto max-w-[1100px] -translate-y-12">
          <Photo media={article.cover} seed={5} priority sizes="(min-width:1100px) 1100px, 100vw" className="aspect-[16/9] w-full shadow-[0_40px_80px_-30px_rgba(20,16,12,.5)]" />
        </div>
        <div className="gutter mx-auto max-w-[760px] pb-28">
          {article.location !== undefined && (
            <p className="ph-label mb-8 text-umber/55">{article.location ?? "[LIEU À AJOUTER]"}</p>
          )}
          <div className="space-y-6 text-lg leading-relaxed text-umber/85">
            {article.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <Link
            href={`/actions/${action.slug}`}
            className="mt-16 inline-flex items-center gap-3 border-b border-current pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em]"
          >
            <span aria-hidden="true">←</span> {action.title}
          </Link>
        </div>
      </div>
    </article>
  );
}
