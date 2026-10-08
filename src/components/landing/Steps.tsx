import { Reveal } from "./Reveal";
import { Section } from "./Section";

const STEPS = [
  { title: "Vous présentez votre projet", text: "Vous remplissez le formulaire en quelques minutes." },
  { title: "Nous échangeons", text: "Nous analysons votre projet et vos besoins, puis vous recevez un devis clair." },
  { title: "Nous créons votre site", text: "Le site est développé sur mesure. Vous suivez l'avancement depuis votre espace client." },
  { title: "Votre site est en ligne", text: "Après votre validation, votre site est mis en ligne." },
];

export function Steps() {
  return (
    <Section id="methode" tone="canvas" eyebrow="Comment ça marche ?" title="Simple, de A à Z" intro="Vous vous concentrez sur votre métier. On s'occupe du reste.">
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal as="li" key={s.title} delay={i * 80} className="relative rounded-3xl border border-line bg-white p-6">
            <span className="font-mono text-sm font-medium text-brand">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-6 text-lg font-semibold leading-snug">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
