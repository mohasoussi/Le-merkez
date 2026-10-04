import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import Photo from "@/components/ui/Photo";
import { articles, getAction, getArticle } from "@/content/actions";
import { formatDate } from "@/lib/format";

type Block = { type: "p"; text: string } | { type: "list"; items: string[] };

/** Les lignes commençant par « - » sont regroupées en liste à puces ; les autres sont des paragraphes. */
function groupBody(body: string[]): Block[] {
  const out: Block[] = [];
  for (const line of body) {
    if (line.startsWith("- ")) {
      const last = out[out.length - 1];
      if (last?.type === "list") last.items.push(line.slice(2));
      else out.push({ type: "list", items: [line.slice(2)] });
    } else out.push({ type: "p", text: line });
  }
  return out;
}

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
            {groupBody(article.body).map((block, i) =>
              block.type === "list" ? (
                <ul key={i} className="list-none space-y-3 border-l border-umber/15 pl-6">
                  {block.items.map((it) => (
                    <li key={it} className="relative">
                      <span aria-hidden="true" className="absolute -left-[1.85rem] top-[0.62em] h-1.5 w-1.5 rotate-45 bg-saffron" />
                      {it}
                    </li>
                  ))}
                </ul>
              ) : block.text.startsWith("«") ? (
                <blockquote key={i} className="border-l-2 border-saffron pl-6 font-serif text-[1.35em] italic leading-snug text-brown">
                  {block.text}
                </blockquote>
              ) : (
                <p key={i}>{block.text}</p>
              ),
            )}
          </div>
          {article.photos && article.photos.length > 0 && (
            <div className="mt-14 columns-2 gap-3 md:gap-4">
              {article.photos.map((ph, i) => (
                <figure key={ph.src ?? i} className="group mb-3 break-inside-avoid overflow-hidden rounded-[4px] md:mb-4">
                  <Image
                    src={ph.src!}
                    alt={ph.alt}
                    width={ph.width ?? 1600}
                    height={ph.height ?? 1200}
                    sizes="(min-width:760px) 380px, 50vw"
                    className="h-auto w-full transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-[1.04]"
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
