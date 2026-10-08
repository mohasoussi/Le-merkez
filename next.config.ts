import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
// `npm run cf:build` : build pour Cloudflare Workers (OpenNext)
const isCloudflare = process.env.NEXT_BUILD_TARGET === "cloudflare";

// CSP : uniquement nos propres ressources (+ Cloudflare Turnstile si activé).
// 'unsafe-inline' est nécessaire aux scripts d'hydratation de Next.js sans nonce (qui imposerait un rendu 100 % dynamique).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://challenges.cloudflare.com${isDev ? " ws:" : ""}`,
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

// Outils de build / test / CLI : jamais utiles à l'exécution. Exclus du bundle Cloudflare (limite de taille des Workers).
const cloudflareTracingExcludes = [
  "node_modules/prisma/**",
  "node_modules/@prisma/dev/**",
  "node_modules/@prisma/client/runtime/query_compiler_*",
  "node_modules/@electric-sql/**",
  "node_modules/{@playwright,playwright,playwright-core,@axe-core,axe-core,vitest,@vitest,chai}/**",
  "node_modules/{wrangler,workerd,miniflare,@cloudflare,cloudflare}/**",
  "node_modules/{esbuild,@esbuild,rolldown,@rolldown,@ast-grep,@oxc-project,typescript,tsx,@types}/**",
  "node_modules/{tailwindcss,@tailwindcss,lightningcss,lightningcss-*,@next/swc-*,effect,@dotenvx,dotenv}/**",
  "node_modules/sharp/**",
  "node_modules/@img/**",
];

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Dossier de build séparé pour les tests e2e (permet un 2e serveur en parallèle du dev)
  distDir: process.env.NEXT_DIST_DIR || ".next",
  output: isCloudflare ? undefined : "standalone",
  outputFileTracingExcludes: isCloudflare ? { "*": cloudflareTracingExcludes } : undefined,
  // Images des réalisations envoyées via Server Action (les fichiers clients passent par une route API dédiée)
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  images: {
    formats: ["image/avif", "image/webp"],
    // Sur Workers, pas d'optimiseur d'images Node : les images sont servies telles quelles (pensez à les compresser).
    unoptimized: isCloudflare,
  },
  // Sur Workers, le client Prisma « workerd » charge son moteur WebAssembly comme un module.
  turbopack: isCloudflare ? { resolveAlias: { "@/generated/prisma/client": "./src/generated/prisma-workerd/client.ts" } } : undefined,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Les espaces privés ne doivent jamais être indexés ni mis en cache partagé
      { source: "/(admin|client)/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Cache-Control", value: "private, no-store" }] },
    ];
  },
};

export default nextConfig;
