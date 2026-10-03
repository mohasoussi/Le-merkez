import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Amiri, Cormorant_Garamond, Montserrat } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import SmoothScroll from "@/components/motion/SmoothScroll";
import { site, socials } from "@/content/site";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin", "latin-ext"], variable: "--font-montserrat", display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400"],
  style: ["italic", "normal"],
  variable: "--font-cormorant",
  display: "swap",
});
const amiri = Amiri({ subsets: ["arabic"], weight: "400", variable: "--font-amiri", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s — Le Merkez" },
  description: site.description,
  applicationName: site.name,
  keywords: ["Le Merkez", "rencontre", "dialogue interreligieux", "retraites spirituelles", "conférences", "actions humanitaires", "transmission", "spiritualité"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#14100c",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      description: site.description,
      slogan: site.tagline,
      logo: `${site.url}/icon.svg`,
      sameAs: socials.map((s) => s.href).filter(Boolean),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      inLanguage: "fr-FR",
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};

/**
 * Pose la classe `js` avant le rendu (pour masquer les éléments du hero animés),
 * avec un filet de sécurité : si l'hydratation échoue, le contenu redevient visible.
 */
const jsFlag = `document.documentElement.classList.add('js');setTimeout(function(){if(!window.__merkezReady)document.documentElement.classList.remove('js')},4000);`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${cormorant.variable} ${amiri.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-saffron focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-night"
        >
          Aller au contenu
        </a>
        <SmoothScroll />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
