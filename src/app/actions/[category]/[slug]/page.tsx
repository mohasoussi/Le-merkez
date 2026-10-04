import type { Metadata } from "next";
import Image from "next/image";
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
            <p className={`mb-8 ${article.location ? "eyebrow text-earth" : "ph-label text-umber/55"}`}>{article.location ?? "[LIEU À AJOUTER]"}</p>
          )}
          <div className="space-y-6 text-lg leading-relaxed text-umber/85">
            {article.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {article.photos && article.photos.length > 0 && (
            <div className="mt-14 grid grid-cols-2 gap-3 md:gap-4">
              {article.photos.map((ph, i) => (
                <figure
                  key={ph.src ?? i}
                  className={`group relative overflow-hidden rounded-[4px] ${(ph.height ?? 0) > (ph.width ?? 1) ? "row-span-2" : ""} ${i === 0 ? "col-span-2" : ""}`}
                >
                  <Image
                    src={ph.src!}
                    alt={ph.alt}
                    width={ph.width ?? 1600}
                    height={ph.height ?? 1200}
                    sizes={i === 0 ? "(min-width:760px) 760px, 100vw" : "(min-width:760px) 380px, 50vw"}
                    className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-[1.04]"
                  />
                </figure>
              ))}
            </div>
          )}
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
