import Link from "next/link";
import { getAction, type Article } from "@/content/actions";
import { formatDate } from "@/lib/format";
import Photo from "./Photo";

/** Carte d'article (action menée). Image qui se dilate au survol, filet de couleur de l'axe. */
export default function ArticleCard({ article, tone = "light", index = 0 }: { article: Article; tone?: "light" | "dark"; index?: number }) {
  const axis = getAction(article.category);
  const dark = tone === "dark";
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Photo
          media={article.cover}
          seed={index * 3 + 12}
          sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw"
          className="h-full w-full"
          imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-[1.06]"
        />
        <span aria-hidden="true" className="absolute left-0 top-0 h-1 w-full origin-left scale-x-[.25] transition-transform duration-700 ease-[var(--ease-silk)] group-hover:scale-x-100" style={{ backgroundColor: axis?.color }} />
      </div>
      <div className="mt-5 flex items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.22em]">
        <span style={{ color: dark ? axis?.accent : axis?.color }}>{axis?.short}</span>
        <span aria-hidden="true" className={dark ? "text-cream/30" : "text-umber/30"}>
          /
        </span>
        <time dateTime={article.date ?? undefined} className={dark ? "text-cream/55" : "text-umber/55"}>
          {formatDate(article.date)}
        </time>
      </div>
      <h3 className={`mt-3 text-xl font-light leading-snug md:text-2xl ${dark ? "text-cream" : "text-umber"}`}>
        <Link href={`/actions/${article.category}/${article.slug}`} className="after:absolute after:inset-0">
          {article.title}
        </Link>
      </h3>
      <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-cream/65" : "text-umber/70"}`}>{article.excerpt}</p>
    </article>
  );
}
