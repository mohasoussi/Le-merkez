import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader";
import Reveal from "@/components/motion/Reveal";
import RevealText from "@/components/motion/RevealText";
import WordCascade from "@/components/motion/WordCascade";
import FabricStory, { type StoryItem } from "@/components/sections/FabricStory";
import Button from "@/components/ui/Button";
import { merkezPage as c } from "@/content/merkez";

export const metadata: Metadata = {
  title: "Le projet",
  description:
    "Le Merkez : un lieu de lumière, de rencontre et d’union. Une vision, la lumière, le vêtement rapiécé, et cinq façons d’agir : rencontrer, se retrouver, transmettre, servir, cultiver.",
  alternates: { canonical: "/le-merkez" },
};

const sectionTitle = "display text-[clamp(2.1rem,4.6vw,4.4rem)]";

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
            <ol className="mt-6 flex flex-wrap gap-2">
              {c.existence.steps.map((st, i) => (
                <li key={st} className="flex items-center gap-3 border border-umber/20 bg-cream px-4 py-3">
                  <span className="text-[0.6rem] font-semibold tracking-[0.2em] text-madder">0{i + 1}</span>
                  <span className="whitespace-nowrap text-[0.68rem] font-semibold uppercase tracking-[0.16em]">{st}</span>
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
            <Reveal mode="clip" parallax className="relative mt-12 aspect-[3/4] w-full max-w-[460px] overflow-hidden shadow-[0_30px_60px_-30px_rgba(20,16,12,.5)]">
              <Image src={c.vision.photo.src!} alt={c.vision.photo.alt} fill sizes="(min-width:1024px) 460px, 90vw" className="object-cover object-[50%_30%]" />
            </Reveal>
          </div>
          <div className="space-y-6 text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-umber/85 lg:col-span-6 lg:col-start-7 lg:pt-6">
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

      {/* 5 — Le Merkez en action : bandes de tissu rapiécé */}
      <section id="action" className="relative bg-night text-cream">
        <div className="gutter mx-auto max-w-[1600px] pb-14 pt-24 md:pt-36">
          <Eyebrow className="text-saffron">{c.action.eyebrow}</Eyebrow>
          <RevealText as="h2" className={`${sectionTitle} max-w-5xl`}>
            {c.action.title}
          </RevealText>
        </div>
        <FabricStory items={c.action.items as StoryItem[]} />
      </section>

      {/* 6 — De l'espace immatériel à l'espace physique */}
      <section id="espace-physique" className="grain relative overflow-hidden bg-moss py-24 text-cream md:py-36">
        <div className="gutter mx-auto max-w-[1600px]">
          <Eyebrow className="text-saffron">{c.bridge.eyebrow}</Eyebrow>
          <RevealText as="h2" className={`${sectionTitle} max-w-5xl`}>
            {c.bridge.title}
          </RevealText>

          <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Le texte */}
            <div className="space-y-6 text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-cream/85 lg:col-span-5">
              {c.bridge.text.map((t) => (
                <RevealText key={t}>{t}</RevealText>
              ))}
              <Reveal className="!mt-8 border-l-2 border-saffron pl-5 font-serif text-[clamp(1.5rem,2.4vw,2.2rem)] italic leading-snug text-sand">{c.bridge.exists}</Reveal>
              <RevealText>{c.bridge.next}</RevealText>
            </div>

            {/* Les « Un lieu de… » */}
            <div className="lg:col-span-6 lg:col-start-7">
              <WordCascade
                lines={c.bridge.places}
                className="divide-y divide-cream/15 border-y border-cream/15"
                lineClassName="py-3.5 text-[clamp(1.2rem,2.1vw,1.9rem)] font-light leading-tight md:py-4"
              />
            </div>
          </div>

          {/* Les maquettes : grille régulière */}
          <div className="mt-20 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5">
            {c.bridge.photos.map((ph) => (
              <Reveal key={ph.src} mode="clip" parallax className="relative aspect-[16/10] overflow-hidden">
                <Image src={ph.src!} alt={ph.alt} fill sizes="(min-width:640px) 50vw, 100vw" className="object-cover" />
              </Reveal>
            ))}
          </div>
          <div className="mt-5 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <p className="max-w-xl text-xs text-cream/60">{c.bridge.note}</p>
            <Button href={c.bridge.cta.href} variant="glass">
              {c.bridge.cta.label}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
