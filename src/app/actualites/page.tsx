import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import ArticlesBoard from "@/components/sections/ArticlesBoard";
import NextEvent from "@/components/sections/NextEvent";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Les rencontres, retraites, conférences et actions humanitaires menées par le Merkez.",
  alternates: { canonical: "/actualites" },
};

export default function NewsPage() {
  return (
    <>
      <PageHeader eyebrow="Actualités" title="Le Merkez sur le terrain" intro="Rencontres, retraites, conférences, actions humanitaires et parutions : le journal des actions menées." seed={33} />
      <NextEvent />
      <section className="bg-cream py-20 md:py-28">
        <div className="gutter mx-auto max-w-[1600px]">
          <ArticlesBoard limit={60} heading={false} />
        </div>
      </section>
    </>
  );
}
