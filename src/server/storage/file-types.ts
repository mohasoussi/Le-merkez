import "server-only";

interface AllowedType {
  mime: string;
  /** Vérifie la signature binaire (« magic number ») : l'extension seule ne suffit pas. */
  sniff: (b: Uint8Array) => boolean;
  image?: boolean;
}

const startsWith = (b: Uint8Array, sig: number[], offset = 0) => sig.every((v, i) => b[offset + i] === v);
const isZip = (b: Uint8Array) => startsWith(b, [0x50, 0x4b, 0x03, 0x04]);
const isText = (b: Uint8Array) => {
  // Texte UTF-8 : pas d'octet nul dans les premiers Ko
  for (let i = 0; i < Math.min(b.length, 4096); i++) if (b[i] === 0) return false;
  return true;
};

/** Liste blanche. SVG, HTML et exécutables sont volontairement exclus (risque XSS / malware). */
export const ALLOWED_FILE_TYPES: Record<string, AllowedType> = {
  jpg: { mime: "image/jpeg", sniff: (b) => startsWith(b, [0xff, 0xd8, 0xff]), image: true },
  jpeg: { mime: "image/jpeg", sniff: (b) => startsWith(b, [0xff, 0xd8, 0xff]), image: true },
  png: { mime: "image/png", sniff: (b) => startsWith(b, [0x89, 0x50, 0x4e, 0x47]), image: true },
  webp: { mime: "image/webp", sniff: (b) => startsWith(b, [0x52, 0x49, 0x46, 0x46]) && startsWith(b, [0x57, 0x45, 0x42, 0x50], 8), image: true },
  gif: { mime: "image/gif", sniff: (b) => startsWith(b, [0x47, 0x49, 0x46, 0x38]), image: true },
  avif: { mime: "image/avif", sniff: (b) => startsWith(b, [0x66, 0x74, 0x79, 0x70], 4), image: true },
  heic: { mime: "image/heic", sniff: (b) => startsWith(b, [0x66, 0x74, 0x79, 0x70], 4) },
  pdf: { mime: "application/pdf", sniff: (b) => startsWith(b, [0x25, 0x50, 0x44, 0x46]) },
  docx: { mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", sniff: isZip },
  xlsx: { mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", sniff: isZip },
  pptx: { mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation", sniff: isZip },
  odt: { mime: "application/vnd.oasis.opendocument.text", sniff: isZip },
  zip: { mime: "application/zip", sniff: isZip },
  doc: { mime: "application/msword", sniff: (b) => startsWith(b, [0xd0, 0xcf, 0x11, 0xe0]) },
  txt: { mime: "text/plain", sniff: isText },
  md: { mime: "text/markdown", sniff: isText },
  csv: { mime: "text/csv", sniff: isText },
  ai: { mime: "application/postscript", sniff: (b) => startsWith(b, [0x25, 0x50, 0x44, 0x46]) || startsWith(b, [0x25, 0x21]) },
  eps: { mime: "application/postscript", sniff: (b) => startsWith(b, [0x25, 0x21]) || startsWith(b, [0xc5, 0xd0, 0xd3, 0xc6]) },
  psd: { mime: "image/vnd.adobe.photoshop", sniff: (b) => startsWith(b, [0x38, 0x42, 0x50, 0x53]) },
};

export const ACCEPT_ATTRIBUTE = Object.keys(ALLOWED_FILE_TYPES).map((e) => `.${e}`).join(",");

export function extensionOf(name: string) {
  const m = /\.([a-zA-Z0-9]{1,8})$/.exec(name);
  return m ? m[1]!.toLowerCase() : "";
}

/** Retourne le type validé, ou null si le fichier est refusé. */
export function detectFileType(name: string, bytes: Uint8Array): { ext: string; mime: string; image: boolean } | null {
  const ext = extensionOf(name);
  const type = ALLOWED_FILE_TYPES[ext];
  if (!type || !type.sniff(bytes)) return null;
  return { ext, mime: type.mime, image: Boolean(type.image) };
}

/** Nom d'affichage nettoyé (le fichier est stocké sous une clé aléatoire, jamais sous ce nom). */
export function sanitizeFileName(name: string) {
  const base = name.normalize("NFC").replace(/[\\/\x00-\x1f\x7f"<>|:*?]/g, "_").trim();
  return (base || "fichier").slice(0, 150);
}
