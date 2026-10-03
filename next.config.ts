import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Hébergement Cloudflare Workers : les images sont servies telles quelles.
    // Fournir des fichiers déjà optimisés (WebP/AVIF, ~2000 px max).
    unoptimized: true,
  },
};

export default nextConfig;

// Permet d'utiliser les bindings Cloudflare pendant `next dev`.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
