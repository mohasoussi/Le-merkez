import FragmentDivider from "@/components/layout/FragmentDivider";
import ActionChapters from "@/components/sections/ActionChapters";
import ArticlesBoard from "@/components/sections/ArticlesBoard";
import Books from "@/components/sections/Books";
import Donation from "@/components/sections/Donation";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";
import InAction from "@/components/sections/InAction";
import PhysicalPlace from "@/components/sections/PhysicalPlace";
import Vision from "@/components/sections/Vision";

/**
 * Accueil : intro patchwork → hero → le Merkez en action → le patchwork de la vision
 * → nos actions → journal → ouvrages → galerie → le lieu → soutenir.
 * (Le Shaykh a sa propre page : /le-shaykh.)
 */
export default function Home() {
  return (
    <>
      <Hero />
      <InAction />
      <FragmentDivider from="var(--color-night)" to="var(--color-cream)" seed={3} />
      <Vision />
      <FragmentDivider from="var(--color-cream)" to="var(--color-night)" seed={12} />
      <ActionChapters />
      <section aria-label="Les actions menées" className="bg-cream py-28 md:py-36">
        <div className="gutter mx-auto max-w-[1600px]">
          <ArticlesBoard limit={6} />
        </div>
      </section>
      <Books />
      <FragmentDivider from="var(--color-umber)" to="var(--color-cream)" seed={19} />
      <Gallery />
      <PhysicalPlace />
      <Donation />
    </>
  );
}
