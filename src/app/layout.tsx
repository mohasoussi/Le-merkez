import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { getPublicSettings } from "@/server/public-content";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getPublicSettings().catch(() => null);
  const title = s ? `${s.brandName} — ${s.seoTitle}` : "Création de sites internet";
  const description = s?.seoDescription;
  return {
    metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
    title: { default: title, template: `%s — ${s?.brandName ?? "Studio Web"}` },
    description,
    openGraph: { type: "website", locale: "fr_FR", siteName: s?.brandName, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Active les animations d'apparition seulement si le JS est disponible */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
