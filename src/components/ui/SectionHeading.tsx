import RevealText from "@/components/motion/RevealText";

/** Sur-titre + titre animé, utilisés en tête de chaque section. */
export default function SectionHeading({
  eyebrow,
  title,
  className = "",
  titleClassName = "",
  as = "h2",
  id,
}: {
  eyebrow?: string;
  title: string;
  className?: string;
  titleClassName?: string;
  as?: "h1" | "h2" | "h3";
  id?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && (
        <p className="eyebrow mb-6 flex items-center gap-4 opacity-80">
          <span aria-hidden="true" className="stitch inline-block w-10" />
          {eyebrow}
        </p>
      )}
      <RevealText as={as} id={id} className={`display text-balance ${titleClassName}`}>
        {title}
      </RevealText>
    </div>
  );
}
