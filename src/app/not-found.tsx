import Button from "@/components/ui/Button";
import PatchField from "@/components/ui/PatchField";

export default function NotFound() {
  return (
    <section className="grain relative flex min-h-[100svh] flex-col items-center justify-center gap-8 overflow-hidden bg-night px-6 text-center text-cream">
      <div aria-hidden="true" className="absolute inset-0 opacity-15">
        <PatchField cols={12} rows={8} seed={404} gap={4} />
      </div>
      <p className="eyebrow relative text-saffron">Erreur 404</p>
      <h1 className="relative text-[clamp(2rem,5vw,4rem)] font-extralight uppercase tracking-[0.12em]">Ce morceau manque</h1>
      <p className="relative max-w-md text-cream/70">La page que vous cherchez n’existe pas ou a été déplacée.</p>
      <Button href="/" variant="glass" className="relative">
        Retour à l’accueil
      </Button>
    </section>
  );
}
