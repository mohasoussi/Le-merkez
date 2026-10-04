import type { Metadata } from "next";
import Shaykh from "@/components/sections/Shaykh";
import { shaykh } from "@/content/shaykh";

export const metadata: Metadata = {
  title: "Le Shaykh",
  description: `${shaykh.title} — biographie, enseignements, conférences, vidéos et publications.`,
  alternates: { canonical: "/le-shaykh" },
};

/** La Vision → Le Shaykh : même section que celle qui figurait sur l'accueil. */
export default function ShaykhPage() {
  return <Shaykh headingAs="h1" />;
}
