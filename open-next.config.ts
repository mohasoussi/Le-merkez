import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Pas de cache incrémental : les pages sont rendues à la demande depuis la base,
// les modifications faites dans l'administration sont donc visibles immédiatement.
export default defineCloudflareConfig({});
