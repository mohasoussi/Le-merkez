import FragmentDivider from "@/components/layout/FragmentDivider";
import ActionChapters from "@/components/sections/ActionChapters";
import Books from "@/components/sections/Books";
import Donation from "@/components/sections/Donation";
import FabricBands from "@/components/sections/FabricBands";
import FilmFrame from "@/components/sections/FilmFrame";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";
import InAction from "@/components/sections/InAction";
import PhysicalPlace from "@/components/sections/PhysicalPlace";
import Vision from "@/components/sections/Vision";

/**
 * Accueil : hero → vidéo dans son cadre en patchwork → le Merkez en action → le patchwork de la vision
 * → nos actions → ouvrages → galerie → le lieu → soutenir.
 * (Le Shaykh a sa propre page : /le-shaykh.)
 */
export default function Home() {
  return (
    <>
      <Hero />
      <FilmFrame />
      <FragmentDivider from="var(--color-night)" to="var(--color-cream)" seed={3} />
      <InAction />
      <FabricBands />
      <Vision />
      <FragmentDivider from="var(--color-cream)" to="var(--color-night)" seed={12} />
      <ActionChapters />
      <Books />
      <FragmentDivider from="var(--color-umber)" to="var(--color-cream)" seed={19} />
      <Gallery />
      <PhysicalPlace />
      <Donation />
    </>
  );
}
