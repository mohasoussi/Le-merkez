import { Briefcase, Building2, HandHeart, Hammer, Store, User, UtensilsCrossed } from "lucide-react";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

const AUDIENCES = [
  { icon: UtensilsCrossed, title: "Restaurants", text: "Menu, photos, horaires et réservation : donnez envie de venir." },
  { icon: Store, title: "Commerces", text: "Présentez vos produits et guidez vos clients jusqu'à votre boutique." },
  { icon: Hammer, title: "Artisans", text: "Montrez vos réalisations et recevez des demandes de devis qualifiées." },
  { icon: User, title: "Indépendants", text: "Une vitrine professionnelle qui inspire confiance dès le premier regard." },
  { icon: Briefcase, title: "Consultants", text: "Valorisez votre expertise et facilitez la prise de rendez-vous." },
  { icon: HandHeart, title: "Associations", text: "Faites connaître vos actions, vos événements et mobilisez." },
  { icon: Building2, title: "Petites entreprises", text: "Un site clair et moderne, à l'image de votre sérieux." },
];

export function Audience() {
  return (
    <Section id="pour-qui" eyebrow="Pour qui ?" title="Un site pensé pour votre métier" intro="Chaque activité a ses codes. Votre site est conçu pour parler à vos clients, pas à des développeurs.">
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {AUDIENCES.map((a, i) => (
          <Reveal as="li" key={a.title} delay={i * 50} className="group rounded-2xl border border-line bg-white p-4 last:col-span-2 sm:p-5 lg:last:col-span-1 transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-ink/10 hover:shadow-lift">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
              <a.icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-3 font-semibold sm:mt-4">{a.title}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-muted sm:mt-1.5 sm:text-sm">{a.text}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
