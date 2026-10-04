import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import Reveal from "@/components/motion/Reveal";
import RevealText from "@/components/motion/RevealText";
import WordCascade from "@/components/motion/WordCascade";
import PhysicalPlace from "@/components/sections/PhysicalPlace";
import Button from "@/components/ui/Button";
import Emblem from "@/components/ui/Emblem";
import { futurLieu as c } from "@/content/futurLieu";

export const metadata: Metadata = {
  title: "Le futur lieu",
  description:
    "Le futur lieu du Merkez : la matérialisation d’une œuvre déjà en mouvement, un espace permanent pour la retraite, la rencontre, la spiritualité, la nature, les livres et les actions solidaires.",
  alternates: { canonical: "/le-futur-lieu" },
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

export default function FuturLieuPage() {
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro} seed={37} />

      {/* Plan du lieu + maquette */}
      <PhysicalPlace headless />

      {/* Un réseau de lieux */}
      <section id="reseau" className="relative bg-cream py-24 text-umber md:py-36">
        <div className="gutter mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow>{c.network.eyebrow}</Eyebrow>
            <RevealText as="h2" className={sectionTitle}>
              {c.network.title}
            </RevealText>
            {c.network.text.map((t) => (
              <RevealText key={t} className="mt-8 max-w-xl text-lg leading-relaxed text-umber/80">
                {t}
              </RevealText>
            ))}
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="eyebrow mb-5 text-umber/60">{c.network.lead}</p>
            <ol className="space-y-px bg-umber/15">
              {c.network.steps.map((s, i) => (
                <li key={s} className="bg-cream">
                  <Reveal className="flex gap-5 py-5">
                    <span className="mt-1 text-[0.62rem] font-semibold tracking-[0.2em] text-madder">0{i + 1}</span>
                    <span className="text-lg font-light leading-snug">{s}</span>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Une réponse à la division */}
      <section id="division" className="grain relative overflow-hidden bg-night py-24 text-cream md:py-36">
        <div className="gutter relative z-[2] mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow className="text-saffron">{c.division.eyebrow}</Eyebrow>
            <RevealText as="h2" className={sectionTitle}>
              {c.division.title}
            </RevealText>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-cream/80">
              {c.division.text.map((t) => (
                <RevealText key={t}>{t}</RevealText>
              ))}
            </div>
          </div>
          <WordCascade
            lines={c.division.places}
            className="space-y-4 lg:col-span-6 lg:col-start-7 lg:pt-6"
            lineClassName="font-serif text-[clamp(1.3rem,2.2vw,2rem)] italic leading-snug text-cream/90"
          />
        </div>
      </section>

      {/* Contribuer au Merkez */}
      <section id="contribuer" className="grain relative overflow-hidden bg-madder py-24 text-cream md:py-36">
        <div className="gutter relative z-[2] mx-auto max-w-[1600px]">
          <Eyebrow className="text-saffron">{c.contribute.eyebrow}</Eyebrow>
          <div className="grid gap-8 lg:grid-cols-12">
            <RevealText as="h2" className={`${sectionTitle} lg:col-span-6`}>
              {c.contribute.title}
            </RevealText>
            <div className="space-y-5 text-lg leading-relaxed text-cream/90 lg:col-span-5 lg:col-start-8">
              {c.contribute.text.map((t) => (
                <RevealText key={t}>{t}</RevealText>
              ))}
            </div>
          </div>
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.contribute.items.map((it) => (
              <li key={it.label} className="glass flex flex-col rounded-[4px] p-7">
                <span aria-hidden="true" className="mb-5 block h-1.5 w-12" style={{ backgroundColor: it.color === "#8f2d22" ? "#c99a3e" : it.color }} />
                <h3 className="text-2xl font-light uppercase tracking-[0.04em]">{it.label}</h3>
                <div className="mt-8">
                  <Button href={it.cta.href} variant="solid">
                    {it.cta.label}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* La librairie + le Shaykh */}
      <section id="librairie-shaykh" className="relative bg-linen py-24 text-umber md:py-32">
        <div className="gutter mx-auto grid max-w-[1600px] gap-6 md:grid-cols-2 md:gap-10">
          <Reveal className="bg-umber p-8 text-cream md:p-12">
            <Eyebrow className="text-saffron">{c.library.eyebrow}</Eyebrow>
            <h2 className="display text-[clamp(1.8rem,3.2vw,3rem)]">{c.library.title}</h2>
            <p className="mt-6 text-base leading-relaxed text-cream/80 md:text-lg">{c.library.text}</p>
            <div className="mt-8">
              <Button href={c.library.cta.href} variant="glass">
                {c.library.cta.label}
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="border border-umber/15 bg-cream p-8 md:p-12">
            <Eyebrow>{c.shaykh.eyebrow}</Eyebrow>
            <h2 className="display text-[clamp(1.8rem,3.2vw,3rem)]">{c.shaykh.title}</h2>
            <p className="mt-6 text-base leading-relaxed text-umber/80 md:text-lg">{c.shaykh.text}</p>
            <div className="mt-8">
              <Button href={c.shaykh.cta.href} variant="dark">
                {c.shaykh.cta.label}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Notre ambition */}
      <section id="ambition" className="grain relative overflow-hidden bg-night py-28 text-center text-cream md:py-40">
        <span aria-hidden="true" className="animate-drift pointer-events-none absolute left-1/2 top-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30" style={{ background: "radial-gradient(circle, rgba(201,154,62,.5), transparent 62%)", ["--dur" as string]: "18s" }} />
        <div className="gutter relative z-[2] mx-auto max-w-4xl">
          <Eyebrow className="justify-center text-saffron">{c.ambition.eyebrow}</Eyebrow>
          <RevealText as="h2" className="display text-[clamp(2rem,4.4vw,4rem)]">
            {c.ambition.lines[0]}
          </RevealText>
          <RevealText className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-cream/80">{c.ambition.lines[1]}</RevealText>
          <div className="mt-14 space-y-3 font-serif text-[clamp(1.3rem,2.4vw,2.2rem)] italic text-sand">
            <RevealText>{c.ambition.today}</RevealText>
            <RevealText>{c.ambition.tomorrow}</RevealText>
          </div>
          <WordCascade
            lines={c.ambition.words}
            className="mt-14 flex flex-col items-center gap-1"
            lineClassName="text-[clamp(1.4rem,3.4vw,3rem)] font-extralight uppercase tracking-[0.3em]"
          />
          <Reveal className="mt-16 flex flex-col items-center gap-5">
            <Emblem size={52} gap={2} />
            <p className="pl-[0.3em] text-[clamp(1.6rem,4vw,3.4rem)] font-extralight uppercase tracking-[0.3em]">{c.ambition.name}</p>
            <p className="max-w-xl font-serif text-xl italic text-cream/80">{c.ambition.tagline}</p>
            <Link href="/#soutenir" className="eyebrow mt-4 border-b border-saffron pb-1 text-saffron">
              Nous soutenir →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
