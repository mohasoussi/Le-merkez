import Image from "next/image";
import Link from "next/link";
import { getAction, type Article } from "@/content/actions";
import { formatDate } from "@/lib/format";
import Photo from "./Photo";
import UpcomingBadge from "./UpcomingBadge";

/**
 * Grande carte d'une action : photo, date, lieu, extrait et lien vers l'article.
 * Une carte par action (retraite, rencontre…), en alternant la photo à gauche / à droite.
 */
export default function ArticleFeature({ article, index = 0 }: { article: Article; index?: number }) {
  const axis = getAction(article.category);
  const href = `/actions/${article.category}/${article.slug}`;
  const portrait = (article.cover.height ?? 0) > (article.cover.width ?? 1);
  const flip = index % 2 === 1;
  return (
    <article className="group relative grid overflow-hidden bg-night text-cream shadow-[0_30px_70px_-35px_rgba(20,16,12,.6)] md:grid-cols-12">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-1.5" style={{ backgroundColor: axis?.color }} />

      <div className={`relative min-h-[260px] overflow-hidden md:col-span-6 md:min-h-[420px] ${flip ? "md:order-2" : ""} ${portrait ? "bg-umber" : ""}`}>
        {portrait && article.cover.src ? (
          <>
            {/* Affiche (portrait) : fond flouté + affiche entière */}
            <Image src={article.cover.src} alt="" fill sizes="50vw" aria-hidden="true" className="scale-125 object-cover opacity-40 blur-2xl" />
            <div className="relative mx-auto my-8 h-[min(440px,70vw)] w-[calc(min(440px,70vw)*var(--r))] max-w-[80%]" style={{ ["--r" as string]: (article.cover.width ?? 3) / (article.cover.height ?? 4) }}>
              <Image
                src={article.cover.src}
                alt={article.cover.alt}
                fill
                sizes="(min-width:768px) 30vw, 70vw"
                className="object-contain shadow-[0_20px_50px_-15px_rgba(0,0,0,.7)] transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-[1.04]"
              />
            </div>
          </>
        ) : (
          <Photo
            media={article.cover}
            seed={index * 5 + 7}
            sizes="(min-width:768px) 50vw, 100vw"
            className="absolute inset-0 h-full w-full"
            imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-[1.05]"
          />
        )}
      </div>

      <div className={`flex flex-col justify-center p-7 md:col-span-6 md:p-12 ${flip ? "md:order-1" : ""}`}>
        <div className="flex flex-wrap items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.2em]">
          <UpcomingBadge date={article.date} />
          <time dateTime={article.date ?? undefined} className="text-saffron">
            {formatDate(article.date)}
          </time>
          {article.location && (
            <>
              <span aria-hidden="true" className="text-cream/30">
                /
              </span>
              <span className="text-cream/65">{article.location}</span>
            </>
          )}
        </div>
        <h3 className="mt-5 text-[clamp(1.6rem,2.8vw,2.6rem)] font-light leading-[1.08] tracking-tight">
          <Link href={href} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h3>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-cream/75">{article.excerpt}</p>
        <span className="mt-8 inline-flex items-center gap-3 self-start text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-saffron">
          <span aria-hidden="true" className="stitch inline-block w-8 transition-all duration-500 group-hover:w-14" />
          Lire l’article
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </article>
  );
}
