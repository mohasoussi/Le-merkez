import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Storage, StoredObject } from "./index";

interface R2Bucket {
  put(key: string, value: ArrayBuffer | Uint8Array, opts?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  get(key: string): Promise<{ body: ReadableStream<Uint8Array>; size: number } | null>;
  delete(key: string): Promise<void>;
}

/** Cloudflare R2 via la liaison (binding) « FILES » du Worker — aucune clé d'API nécessaire. Le bucket reste privé. */
export class R2Storage implements Storage {
  private bucket(): R2Bucket {
    const bucket = (getCloudflareContext().env as { FILES?: R2Bucket }).FILES;
    if (!bucket) throw new Error("STORAGE_DRIVER=r2 : la liaison R2 « FILES » est absente de wrangler.jsonc.");
    return bucket;
  }

  async put(key: string, data: Uint8Array, contentType: string) {
    await this.bucket().put(key, data, { httpMetadata: { contentType } });
  }

  async get(key: string): Promise<StoredObject | null> {
    const obj = await this.bucket().get(key);
    return obj ? { body: obj.body, size: obj.size } : null;
  }

  async delete(key: string) {
    await this.bucket().delete(key);
  }
}
