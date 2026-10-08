import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

// scrypt (paramètres OWASP : N=2^14, r=8, p=5 → 16 Mio) via node:crypto :
// natif sous Node.js ET disponible sur Cloudflare Workers (nodejs_compat), sans module compilé.
// Format stocké : scrypt$N$r$p$selBase64$hashBase64
const N = 16384;
const R = 8;
const P = 5;
const KEYLEN = 64;

export const PASSWORD_MIN_LENGTH = 10;

function derive(password: string, salt: Buffer, n: number, r: number, p: number) {
  return new Promise<Buffer>((resolve, reject) =>
    scrypt(password.normalize("NFKC"), salt, KEYLEN, { N: n, r, p, maxmem: 128 * n * r * p + 4 * 1024 * 1024 }, (err, key) => (err ? reject(err) : resolve(key))),
  );
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await derive(password, salt, N, R, P);
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64")}$${key.toString("base64")}`;
}

export async function verifyPassword(stored: string, password: string) {
  try {
    const [algo, n, r, p, salt, hash] = stored.split("$");
    if (algo !== "scrypt" || !n || !r || !p || !salt || !hash) return false;
    const expected = Buffer.from(hash, "base64");
    const key = await derive(password, Buffer.from(salt, "base64"), Number(n), Number(r), Number(p));
    return key.length === expected.length && timingSafeEqual(key, expected);
  } catch {
    return false;
  }
}

// Hash factice pour que la durée de réponse soit identique quand l'email n'existe pas.
let dummyHash: Promise<string> | null = null;
export async function burnPasswordCheck(password: string) {
  dummyHash ??= hashPassword("dummy-password-for-timing");
  await verifyPassword(await dummyHash, password);
}
