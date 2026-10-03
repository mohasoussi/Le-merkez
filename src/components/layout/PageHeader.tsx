import RevealText from "@/components/motion/RevealText";
import PatchField from "@/components/ui/PatchField";

/** En-tête des pages intérieures : bande textile + titre révélé. */
export default function PageHeader({
  eyebrow,
  title,
  intro,
  color,
  seed = 9,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  color?: string;
  seed?: number;
}) {
  return (
    <header className="grain relative overflow-hidden bg-night pb-20 pt-[calc(var(--nav-h)+5rem)] text-cream md:pb-28 md:pt-[calc(var(--nav-h)+8rem)]">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-1/2 opacity-30"
        style={{ maskImage: "linear-gradient(to left, black, transparent)", WebkitMaskImage: "linear-gradient(to left, black, transparent)" }}
      >
        <PatchField cols={6} rows={8} seed={seed} gap={3} />
      </div>
      {color && <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1.5" style={{ backgroundColor: color }} />}
      <div className="gutter relative z-[2] mx-auto max-w-[1600px]">
        <p className="eyebrow mb-6 flex items-center gap-4 text-saffron">
          <span aria-hidden="true" className="stitch inline-block w-10" />
          {eyebrow}
        </p>
        <RevealText as="h1" className="display max-w-5xl text-[clamp(2.4rem,6.4vw,6.2rem)]">
          {title}
        </RevealText>
        {intro && <RevealText className="mt-8 max-w-2xl text-lg leading-relaxed text-cream/75 md:text-xl">{intro}</RevealText>}
      </div>
    </header>
  );
}
