import FragmentDivider from "@/components/layout/FragmentDivider";
import ActionChapters from "@/components/sections/ActionChapters";
import Activities from "@/components/sections/Activities";
import ArticlesBoard from "@/components/sections/ArticlesBoard";
import Books from "@/components/sections/Books";
import Convergence from "@/components/sections/Convergence";
import Donation from "@/components/sections/Donation";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";
import InAction from "@/components/sections/InAction";
import Muraqaa from "@/components/sections/Muraqaa";
import PhysicalPlace from "@/components/sections/PhysicalPlace";
import Shaykh from "@/components/sections/Shaykh";
import Vision from "@/components/sections/Vision";

/**
 * Le récit de la page :
 * des peuples différents → des histoires différentes → des rencontres → des liens
 * → une communauté → un lieu → le Merkez.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <FragmentDivider from="var(--color-night)" to="var(--color-cream)" seed={3} />
      <Vision />
      <Convergence />
      <FragmentDivider from="var(--color-night)" to="var(--color-linen)" seed={8} />
      <Muraqaa />
      <FragmentDivider from="var(--color-linen)" to="var(--color-night)" seed={12} />
      <Activities />
      <ActionChapters />
      <section aria-label="Les actions menées" className="bg-cream py-28 md:py-36">
        <div className="gutter mx-auto max-w-[1600px]">
          <ArticlesBoard limit={6} />
        </div>
      </section>
      <Books />
      <InAction />
      <FragmentDivider from="var(--color-night)" to="var(--color-cream)" seed={19} />
      <Gallery />
      <PhysicalPlace />
      <Shaykh />
      <Donation />
    </>
  );
}
