import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/** Jeton aléatoire de 256 bits, encodé base64url. */
export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function hmac(value: string, secret = process.env.APP_SECRET ?? "") {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}
