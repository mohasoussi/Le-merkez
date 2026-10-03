import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import Emblem from "@/components/ui/Emblem";

export const metadata: Metadata = { title: "Merci", robots: { index: false } };

/** Page de retour après un don (success_url des prestataires de paiement). */
export default function ThanksPage() {
  return (
    <section className="grain relative flex min-h-[100svh] flex-col items-center justify-center gap-8 bg-night px-6 text-center text-cream">
      <Emblem size={64} gap={2} />
      <h1 className="text-[clamp(2.2rem,6vw,5rem)] font-extralight uppercase tracking-[0.2em]">Merci</h1>
      <p className="max-w-xl font-serif text-2xl italic text-cream/80">Votre contribution participe à la construction du Merkez.</p>
      <Button href="/" variant="glass">
        Retour à l’accueil
      </Button>
    </section>
  );
}
