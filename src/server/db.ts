import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

type Client = InstanceType<typeof PrismaClient>;

const isCloudflare = typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";

function createClient(connectionString: string, opts: { maxUses?: number } = {}) {
  return new PrismaClient({ adapter: new PrismaPg({ connectionString, ...opts }) });
}

// ── Node.js (dev, tests, Docker) : un client unique, réutilisé.
const globalForPrisma = globalThis as unknown as { prisma?: Client };
function nodeClient() {
  globalForPrisma.prisma ??= createClient(process.env.DATABASE_URL ?? "");
  return globalForPrisma.prisma;
}

// ── Cloudflare Workers : une connexion ne peut pas servir à deux requêtes différentes.
// Un client par requête (clé = contexte d'exécution de la requête), via Hyperdrive s'il est configuré.
const perRequest = new WeakMap<object, Client>();
function cloudflareClient() {
  const { env, ctx } = getCloudflareContext();
  const key = ctx as object;
  let client = perRequest.get(key);
  if (!client) {
    const hyperdrive = (env as { HYPERDRIVE?: { connectionString: string } }).HYPERDRIVE;
    client = createClient(hyperdrive?.connectionString ?? process.env.DATABASE_URL ?? "", { maxUses: 1 });
    perRequest.set(key, client);
  }
  return client;
}

function getClient(): Client {
  return isCloudflare ? cloudflareClient() : nodeClient();
}

/** Client Prisma : même API partout, la bonne connexion est choisie selon l'environnement d'exécution. */
export const db: Client = new Proxy({} as Client, {
  get(_target, prop) {
    const client = getClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
