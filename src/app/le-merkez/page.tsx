import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import Reveal from "@/components/motion/Reveal";
import RevealText from "@/components/motion/RevealText";
import WordCascade from "@/components/motion/WordCascade";
import Button from "@/components/ui/Button";
import { merkezPage as c } from "@/content/merkez";

export const metadata: Metadata = {
  title: "Le projet",
  description:
    "Le Merkez : un lieu de lumière, de rencontre et d’union. Une vision, la lumière, le vêtement rapiécé, et cinq façons d’agir : rencontrer, se retrouver, transmettre, servir, cultiver.",
  alternates: { canonical: "/le-merkez" },
};

const sectionTitle = "display text-[clamp(2.1rem,4.6vw,4.4rem)]";
const weave = {
  backgroundImage:
    "repeating-linear-gradient(0deg, rgba(0,0,0,.075) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(255,255,255,.055) 0 1px, transparent 1px 3px)",
};

function Eyebrow({ children, className = "text-madder" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`eyebrow mb-6 flex items-center gap-4 ${className}`}>
      <span aria-hidden="true" className="stitch inline-block w-10" />
      {children}
    </p>
  );
}

export default function MerkezPage() {
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro} seed={21} />

      {/* 1 — Le verset et « il existe déjà » */}
      <section id="idee" className="relative bg-cream py-24 text-umber md:py-36">
        <div className="gutter mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow>{c.existence.eyebrow}</Eyebrow>
            <RevealText as="h2" className={sectionTitle}>
              {c.existence.title}
            </RevealText>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-umber/80">
              {c.existence.text.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
            <div className="mt-8 border-l-2 border-saffron pl-5 font-serif text-2xl italic leading-snug text-brown">
              {c.existence.emphasis.map((e) => (
                <p key={e}>{e}</p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal className="relative overflow-hidden bg-night p-8 text-cream md:p-12">
              <div aria-hidden="true" className="absolute right-0 top-0 h-1.5 w-full bg-gradient-to-r from-madder via-saffron to-indigo" />
              <blockquote>
                <p className="font-serif text-[clamp(1.4rem,2.4vw,2.2rem)] font-light italic leading-snug">« {c.verse.text} »</p>
                <footer className="mt-6 flex flex-col gap-2">
                  <span lang="ar" dir="rtl" className="font-arabic text-xl text-saffron">
                    {c.verse.ar}
                  </span>
                  <cite className="eyebrow not-italic text-cream/55">{c.verse.reference}</cite>
                </footer>
              </blockquote>
            </Reveal>
            <ol className="mt-6 grid grid-cols-2 gap-px bg-umber/15 sm:grid-cols-5">
              {c.existence.steps.map((s, i) => (
                <li key={s} className="bg-cream px-3 py-5 text-center">
                  <span className="block text-[0.6rem] font-semibold tracking-[0.2em] text-madder">0{i + 1}</span>
                  <span className="mt-2 block text-[0.68rem] font-semibold uppercase tracking-[0.16em]">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 2 — Une vision */}
      <section id="vision" className="relative overflow-hidden bg-linen py-24 text-umber md:py-36">
        <div className="gutter mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow>{c.vision.eyebrow}</Eyebrow>
            <RevealText as="h2" className={sectionTitle}>
              {c.vision.title}
            </RevealText>
          </div>
          <div className="space-y-6 text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-umber/85 lg:col-span-6 lg:col-start-7">
            {c.vision.text.map((t) => (
              <RevealText key={t}>{t}</RevealText>
            ))}
            <Reveal className="!mt-10 border-t border-umber/15 pt-8 font-serif text-[clamp(1.5rem,2.4vw,2.2rem)] italic leading-snug text-brown">
              {c.vision.emphasis}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3 — La lumière */}
      <section id="lumiere" className="grain relative overflow-hidden bg-night py-28 text-cream md:py-40">
        <span aria-hidden="true" className="animate-drift pointer-events-none absolute left-1/2 top-1/2 h-[90vmax] w-[90vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40" style={{ background: "radial-gradient(circle, rgba(201,154,62,.55), rgba(201,154,62,.12) 38%, transparent 66%)", ["--dur" as string]: "16s", ["--dx" as string]: "30px", ["--dy" as string]: "-24px" }} />
        <div className="gutter relative z-[2] mx-auto grid max-w-[1600px] gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow className="text-saffron">{c.light.eyebrow}</Eyebrow>
            <RevealText as="h2" className={sectionTitle}>
              {c.light.title}
            </RevealText>
            <WordCascade lines={c.light.lines} className="mt-10 space-y-1" lineClassName="font-serif text-[clamp(1.3rem,2.2vw,2rem)] italic leading-snug text-cream/90" accentLast={false} />
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-cream/80 lg:col-span-5 lg:col-start-8 lg:pt-14">
            {c.light.text.map((t) => (
              <RevealText key={t}>{t}</RevealText>
            ))}
            <Reveal className="!mt-10 border-l-2 border-saffron pl-5 font-serif text-[clamp(1.3rem,2vw,1.8rem)] italic leading-snug text-sand">{c.light.emphasis}</Reveal>
          </div>
        </div>
      </section>

      {/* 4 — Le vêtement rapiécé */}
      <section id="vetement" className="relative overflow-hidden bg-linen py-24 text-umber md:py-36">
        <div className="gutter mx-auto max-w-[1600px]">
          <Eyebrow>{c.garment.eyebrow}</Eyebrow>
          <RevealText as="h2" className={`${sectionTitle} max-w-4xl`}>
            {c.garment.title}
          </RevealText>
          <div className="mt-14 grid gap-10 lg:grid-cols-12">
            <div className="grid grid-cols-2 gap-3 md:gap-5 lg:col-span-7">
              {c.garment.photos.map((ph, i) => (
                <Reveal key={ph.src} mode="clip" parallax className={`relative overflow-hidden ${i === 2 ? "col-span-2 aspect-[16/9]" : "aspect-[3/4]"}`}>
                  <Image src={ph.src!} alt={ph.alt} fill sizes={i === 2 ? "(min-width:1024px) 58vw, 100vw" : "(min-width:1024px) 29vw, 50vw"} className="object-cover" />
                </Reveal>
              ))}
            </div>
            <div className="space-y-6 lg:col-span-5 lg:pl-6">
              {c.garment.text.map((t, i) => (
                <RevealText key={t} className={i === 0 ? "font-serif text-[clamp(1.25rem,1.8vw,1.7rem)] italic leading-snug text-brown" : "text-[clamp(1.05rem,1.3vw,1.25rem)] leading-relaxed text-umber/85"}>
                  {t}
                </RevealText>
              ))}
              <p className="!mt-10 flex items-start gap-4 border-t border-umber/15 pt-6 text-sm text-umber/70">
                <span aria-hidden="true" className="mt-1 grid h-4 w-4 shrink-0 grid-cols-2 gap-px">
                  <span className="bg-madder" />
                  <span className="bg-saffron" />
                  <span className="bg-indigo" />
                  <span className="bg-moss" />
                </span>
                Chaque carré : une personne, une culture, une communauté, une tradition, un peuple.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 — Le Merkez en action */}
      <section id="action" className="relative bg-night text-cream">
        <div className="gutter mx-auto max-w-[1600px] pb-14 pt-24 md:pt-36">
          <Eyebrow className="text-saffron">{c.action.eyebrow}</Eyebrow>
          <RevealText as="h2" className={`${sectionTitle} max-w-5xl`}>
            {c.action.title}
          </RevealText>
        </div>
        <div>
          {c.action.items.map((it, i) => (
            <article key={it.word} className="relative grid overflow-hidden md:grid-cols-12" aria-labelledby={`g-${i}`}>
              {/* tissu */}
              <div className="relative p-8 md:col-span-5 md:p-12 lg:p-16" style={{ background: it.color, color: it.ink, ...weave }}>
                <span aria-hidden="true" className="absolute inset-y-0 right-0 w-px" style={{ borderRight: `2px dashed ${it.thread}` }} />
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px" style={{ borderBottom: `2px dashed ${it.thread}` }} />
                <Reveal className="md:sticky md:top-28">
                  <p className="text-[0.65rem] font-semibold tracking-[0.3em] opacity-70">0{i + 1}</p>
                  <h3 id={`g-${i}`} className="mt-3 text-[clamp(1.9rem,4vw,3.6rem)] font-semibold uppercase leading-[0.98] tracking-[0.02em]">
                    {it.word}
                  </h3>
                  <p className="mt-3 max-w-[26ch] text-lg leading-snug opacity-85">{it.subtitle}</p>
                </Reveal>
              </div>
              {/* texte */}
              <div className="bg-night p-8 md:col-span-7 md:p-12 lg:p-16">
                <div className="max-w-2xl space-y-5 text-[clamp(1.05rem,1.25vw,1.2rem)] leading-relaxed text-cream/85">
                  {it.text.map((t) => (
                    <RevealText key={t}>{t}</RevealText>
                  ))}
                  {"list" in it && it.list && (
                    <Reveal>
                      <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                        {it.list.map((l) => (
                          <li key={l} className="flex items-center gap-3 border-b border-cream/15 py-2.5 text-base">
                            <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-saffron" />
                            {l}
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  )}
                  {"after" in it && it.after && <RevealText>{it.after}</RevealText>}
                  {"motto" in it && it.motto && (
                    <Reveal className="!mt-8 border-l-2 pl-5 font-serif text-[clamp(1.25rem,1.9vw,1.7rem)] italic leading-snug" >
                      <span style={{ borderColor: it.thread }} className="block text-sand">
                        {it.motto}
                      </span>
                    </Reveal>
                  )}
                  {it.href && (
                    <p className="!mt-8">
                      <Link href={it.href} className="inline-flex items-center gap-3 border-b border-saffron pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-saffron">
                        {it.hrefLabel} <span aria-hidden="true">→</span>
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6 — De l'espace immatériel à l'espace physique */}
      <section id="espace-physique" className="grain relative overflow-hidden bg-moss py-24 text-cream md:py-36">
        <div className="gutter mx-auto max-w-[1600px]">
          <Eyebrow className="text-saffron">{c.bridge.eyebrow}</Eyebrow>
          <div className="grid gap-8 lg:grid-cols-12">
            <RevealText as="h2" className={`${sectionTitle} lg:col-span-7`}>
              {c.bridge.title}
            </RevealText>
            <div className="space-y-5 text-lg leading-relaxed text-cream/85 lg:col-span-5 lg:col-start-8">
              {c.bridge.text.map((t) => (
                <RevealText key={t}>{t}</RevealText>
              ))}
              <RevealText className="font-serif text-2xl italic text-sand">{c.bridge.exists}</RevealText>
              <RevealText>{c.bridge.next}</RevealText>
            </div>
          </div>

          <WordCascade lines={c.bridge.places} className="mt-16 space-y-1" lineClassName="text-[clamp(1.6rem,4.2vw,3.8rem)] font-extralight uppercase leading-[1.05] tracking-[0.02em]" />

          <div className="mt-14 grid gap-3 md:grid-cols-12 md:gap-5">
            {c.bridge.photos.map((ph, i) => (
              <Reveal key={ph.src} mode="clip" parallax className={`relative overflow-hidden ${i === 0 ? "aspect-[16/10] md:col-span-8 md:row-span-2 md:aspect-auto md:min-h-[420px]" : i === 3 ? "aspect-[4/3] md:col-span-12 md:aspect-[16/6]" : "aspect-[4/3] md:col-span-4"}`}>
                <Image src={ph.src!} alt={ph.alt} fill sizes={i === 0 ? "(min-width:768px) 66vw, 100vw" : i === 3 ? "100vw" : "(min-width:768px) 33vw, 100vw"} className="object-cover" />
              </Reveal>
            ))}
          </div>
          <p className="mt-5 text-xs text-cream/60">{c.bridge.note}</p>
          <div className="mt-10">
            <Button href={c.bridge.cta.href} variant="glass">
              {c.bridge.cta.label}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
