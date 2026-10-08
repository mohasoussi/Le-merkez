import "server-only";
import { env } from "@/server/env";
import { LocalStorage } from "./local";
import { S3Storage } from "./s3";
import { R2Storage } from "./r2";

export interface StoredObject {
  body: ReadableStream<Uint8Array>;
  size?: number;
}

/** Abstraction de stockage : le reste de l'application ignore où sont les fichiers. */
export interface Storage {
  put(key: string, data: Uint8Array, contentType: string): Promise<void>;
  get(key: string): Promise<StoredObject | null>;
  delete(key: string): Promise<void>;
}

let instance: Storage | null = null;

export function storage(): Storage {
  if (instance) return instance;
  const e = env();
  if (e.STORAGE_DRIVER === "r2") {
    instance = new R2Storage();
  } else if (e.STORAGE_DRIVER === "s3") {
    if (!e.S3_BUCKET || !e.S3_ACCESS_KEY_ID || !e.S3_SECRET_ACCESS_KEY)
      throw new Error("STORAGE_DRIVER=s3 nécessite S3_BUCKET, S3_ACCESS_KEY_ID et S3_SECRET_ACCESS_KEY.");
    instance = new S3Storage({
      bucket: e.S3_BUCKET,
      region: e.S3_REGION,
      endpoint: e.S3_ENDPOINT || undefined,
      accessKeyId: e.S3_ACCESS_KEY_ID,
      secretAccessKey: e.S3_SECRET_ACCESS_KEY,
    });
  } else {
    instance = new LocalStorage(e.STORAGE_LOCAL_DIR);
  }
  return instance;
}
