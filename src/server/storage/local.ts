import "server-only";
import { createReadStream } from "node:fs";
import { mkdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import type { Storage, StoredObject } from "./index";

/** Stockage sur le disque du serveur. Les clés sont contrôlées pour empêcher toute sortie du dossier racine. */
export class LocalStorage implements Storage {
  private root: string;
  constructor(dir: string) {
    // turbopackIgnore : chemin dynamique, à ne pas suivre lors du traçage des fichiers du build
    this.root = path.resolve(/* turbopackIgnore: true */ process.cwd(), dir);
  }

  private resolve(key: string) {
    if (!/^[a-zA-Z0-9/_.-]+$/.test(key) || key.includes("..")) throw new Error("Clé de stockage invalide");
    const full = path.resolve(/* turbopackIgnore: true */ this.root, key);
    if (!full.startsWith(this.root + path.sep)) throw new Error("Clé de stockage invalide");
    return full;
  }

  async put(key: string, data: Uint8Array) {
    const full = this.resolve(key);
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, data, { flag: "wx" });
  }

  async get(key: string): Promise<StoredObject | null> {
    const full = this.resolve(key);
    try {
      const s = await stat(full);
      return { body: Readable.toWeb(createReadStream(full)) as ReadableStream<Uint8Array>, size: s.size };
    } catch {
      return null;
    }
  }

  async delete(key: string) {
    await rm(this.resolve(key), { force: true });
  }
}
