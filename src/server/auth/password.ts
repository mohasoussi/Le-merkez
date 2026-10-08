import "server-only";
import { hash, verify } from "@node-rs/argon2";

// Paramètres Argon2id recommandés par l'OWASP (19 Mio, 2 itérations, 1 thread).
const OPTIONS = { memoryCost: 19456, timeCost: 2, parallelism: 1 } as const;

export const PASSWORD_MIN_LENGTH = 10;

export function hashPassword(password: string) {
  return hash(password, OPTIONS);
}

export async function verifyPassword(passwordHash: string, password: string) {
  try {
    return await verify(passwordHash, password);
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
