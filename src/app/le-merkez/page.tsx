import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import Reveal from "@/components/motion/Reveal";
import RevealText from "@/components/motion/RevealText";
import Button from "@/components/ui/Button";
import Emblem from "@/components/ui/Emblem";
import { actions } from "@/content/actions";
import { merkezPage as c } from "@/content/merkez";
import { place } from "@/content/place";
import { donation } from "@/content/donation";

export const metadata: Metadata = {
  title: "Le Merkez",
  description:
    "Le Merkez expliqué : une idée (se connaître), une métaphore (la muraqaa), des actions de terrain, un futur lieu pour se rencontrer.",
  alternates: { canonical: "/le-merkez" },
};

const sectionTitle = "display text-[clamp(2.1rem,4.6vw,4.4rem)]";

export default function MerkezPage() {
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro} seed={21} />

      {/* 1 — L'idée fondatrice */}
      <section id="idee" className="relative bg-cream py-24 text-umber md:py-36">
        <div className="gutter mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-6 flex items-center gap-4 text-madder">
              <span aria-hidden="true" className="stitch inline-block w-10" />
              {c.idea.eyebrow}
            </p>
            <RevealText as="h2" className={sectionTitle}>
              Se connaître pour mieux se comprendre
            </RevealText>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-umber/80">
              {c.idea.text.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
            <div className="mt-8 border-l-2 border-saffron pl-5 font-serif text-2xl italic leading-snug text-brown">
              {c.idea.emphasis.map((e) => (
                <p key={e}>{e}</p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal className="relative overflow-hidden bg-night p-8 text-cream md:p-12">
              <div aria-hidden="true" className="absolute right-0 top-0 h-1.5 w-full bg-gradient-to-r from-madder via-saffron to-indigo" />
              <blockquote>
                <p className="font-serif text-[clamp(1.4rem,2.4vw,2.2rem)] font-light italic leading-snug">« {c.idea.verse} »</p>
                <footer className="mt-6 flex flex-col gap-2">
                  <span lang="ar" dir="rtl" className="font-arabic text-xl text-saffron">
                    {c.idea.ar}
                  </span>
                  <cite className="eyebrow not-italic text-cream/55">{c.idea.reference}</cite>
                </footer>
              </blockquote>
            </Reveal>
            <ol className="mt-6 grid grid-cols-2 gap-px bg-umber/15 sm:grid-cols-5">
              {c.idea.steps.map((s, i) => (
                <li key={s} className="bg-cream px-3 py-5 text-center">
                  <span className="block text-[0.6rem] font-semibold tracking-[0.2em] text-madder">0{i + 1}</span>
                  <span className="mt-2 block text-[0.68rem] font-semibold uppercase tracking-[0.16em]">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 2 — La muraqaa */}
      <section id="muraqaa" className="relative overflow-hidden bg-linen py-24 text-umber md:py-36">
        <div className="gutter mx-auto max-w-[1600px]">
          <p className="eyebrow mb-6 flex items-center gap-4 text-madder">
            <span aria-hidden="true" className="stitch inline-block w-10" />
            {c.muraqaa.eyebrow}
          </p>
          <RevealText as="h2" className={`${sectionTitle} max-w-4xl`}>
            {c.muraqaa.title}
          </RevealText>
          <div className="mt-14 grid gap-10 lg:grid-cols-12">
            <div className="grid grid-cols-2 gap-3 lg:col-span-7 md:gap-5">
              {c.muraqaa.photos.map((ph, i) => (
                <Reveal key={ph.src} mode="clip" parallax className={`relative overflow-hidden ${i === 2 ? "col-span-2 aspect-[16/9]" : "aspect-[3/4]"}`}>
                  <Image src={ph.src!} alt={ph.alt} fill sizes={i === 2 ? "(min-width:1024px) 58vw, 100vw" : "(min-width:1024px) 29vw, 50vw"} className="object-cover" />
                </Reveal>
              ))}
            </div>
            <div className="lg:col-span-5 lg:pl-6">
              <div className="space-y-6 text-[clamp(1.1rem,1.4vw,1.35rem)] leading-relaxed">
                {c.muraqaa.text.map((t, i) => (
                  <p key={t} className={i === 2 ? "text-umber/85" : "font-serif text-[1.3em] italic leading-snug text-brown"}>
                    {t}
                  </p>
                ))}
              </div>
              <p className="mt-10 flex items-start gap-4 border-t border-umber/15 pt-6 text-sm text-umber/70">
                <span aria-hidden="true" className="mt-1 grid h-4 w-4 shrink-0 grid-cols-2 gap-px">
                  <span className="bg-madder" />
                  <span className="bg-saffron" />
                  <span className="bg-indigo" />
                  <span className="bg-moss" />
                </span>
                {c.muraqaa.legend}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 — Les actions */}
      <section id="actions" className="relative bg-night py-24 text-cream md:py-36">
        <div className="gutter mx-auto max-w-[1600px]">
          <p className="eyebrow mb-6 flex items-center gap-4 text-saffron">
            <span aria-hidden="true" className="stitch inline-block w-10" />
            {c.axes.eyebrow}
          </p>
          <div className="grid gap-6 lg:grid-cols-12">
            <RevealText as="h2" className={`${sectionTitle} lg:col-span-7`}>
              {c.axes.title}
            </RevealText>
            <p className="self-end text-lg leading-relaxed text-cream/70 lg:col-span-4 lg:col-start-9">{c.axes.text}</p>
          </div>
          <ul className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {actions.map((a) => (
              <li key={a.slug} className="group relative border border-cream/10 bg-night">
                <Reveal className="flex h-full flex-col p-7 md:p-8">
                  <span aria-hidden="true" className="mb-6 block h-1.5 w-12 transition-all duration-700 group-hover:w-full" style={{ backgroundColor: a.color }} />
                  <span className="text-[0.65rem] font-semibold tracking-[0.3em]" style={{ color: a.accent }}>
                    {a.number}
                  </span>
                  <h3 className="mt-3 text-xl font-light uppercase leading-tight tracking-[0.02em]">{a.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-cream/70">{a.summary}</p>
                  <Link
                    href={a.slug === "librairie" ? "/librairie" : `/actions/${a.slug}`}
                    className="mt-auto pt-8 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-saffron after:absolute after:inset-0"
                  >
                    {a.slug === "librairie" ? "Les ouvrages" : "Découvrir"} →<span className="sr-only"> — {a.title}</span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4 — Le lieu */}
      <section id="lieu" className="relative overflow-hidden bg-moss py-24 text-cream md:py-36">
        <div className="gutter mx-auto max-w-[1600px]">
          <p className="eyebrow mb-6 flex items-center gap-4 text-saffron">
            <span aria-hidden="true" className="stitch inline-block w-10" />
            {c.place.eyebrow}
          </p>
          <div className="grid gap-8 lg:grid-cols-12">
            <RevealText as="h2" className={`${sectionTitle} lg:col-span-6`}>
              {c.place.title}
            </RevealText>
            <div className="space-y-5 text-lg leading-relaxed text-cream/80 lg:col-span-5 lg:col-start-8">
              {c.place.text.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
          </div>

          <ul className="mt-12 flex flex-wrap gap-2">
            {place.spaces.map((s) => (
              <li key={s.label} className="flex items-center gap-2.5 rounded-full border border-cream/25 bg-night/20 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em]">
                <span aria-hidden="true" className="h-2 w-2" style={{ backgroundColor: s.color }} />
                {s.label}
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-3 md:grid-cols-12 md:gap-5">
            {c.place.photos.map((ph, i) => (
              <Reveal key={ph.src} mode="clip" parallax className={`relative overflow-hidden ${i === 0 ? "aspect-[16/10] md:col-span-8 md:row-span-2 md:aspect-auto md:min-h-[420px]" : i === 3 ? "aspect-[4/3] md:col-span-12 md:aspect-[16/6]" : "aspect-[4/3] md:col-span-4"}`}>
                <Image src={ph.src!} alt={ph.alt} fill sizes={i === 0 ? "(min-width:768px) 66vw, 100vw" : i === 3 ? "100vw" : "(min-width:768px) 33vw, 100vw"} className="object-cover" />
              </Reveal>
            ))}
          </div>
          <p className="mt-5 text-xs text-cream/60">{c.place.note}</p>
          <div className="mt-8">
            <Button href="/#lieu" variant="glass">
              Voir le plan du lieu
            </Button>
          </div>
        </div>
      </section>

      {/* 5 — Comment participer */}
      <section id="participer" className="grain relative overflow-hidden bg-madder py-24 text-cream md:py-36">
        <div className="gutter relative z-[2] mx-auto max-w-[1600px]">
          <div className="flex items-center gap-4">
            <Emblem size={34} />
            <p className="eyebrow text-saffron">{c.join.eyebrow}</p>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            <RevealText as="h2" className={`${sectionTitle} lg:col-span-6`}>
              {c.join.title}
            </RevealText>
            <p className="self-end text-lg leading-relaxed text-cream/85 lg:col-span-5 lg:col-start-8">{c.join.text}</p>
          </div>
          <ul className="mt-14 grid gap-4 md:grid-cols-3">
            {c.join.items.map((it) => (
              <li key={it.title} className="glass flex flex-col rounded-[4px] p-7">
                <h3 className="text-xl font-light uppercase tracking-[0.03em]">{it.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/85">{it.text}</p>
                <div className="mt-8">
                  <Button href={it.cta.href} variant="solid">
                    {it.cta.label}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <ul className="mt-12 grid gap-6 border-t border-cream/20 pt-8 md:grid-cols-2">
            {donation.goals.map((g) => (
              <li key={g.id}>
                <p className="eyebrow text-saffron">{g.label}</p>
                <p className="mt-2 text-lg font-light">{g.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
