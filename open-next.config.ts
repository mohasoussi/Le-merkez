import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Toutes les pages du site sont pré-générées : aucun cache incrémental (R2) n'est nécessaire.
export default defineCloudflareConfig({});
