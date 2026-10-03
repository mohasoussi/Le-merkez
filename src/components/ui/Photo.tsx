import Image from "next/image";
import type { Media } from "@/content/types";
import { site } from "@/content/site";
import PatchField from "./PatchField";

/**
 * Affiche une image si elle est fournie, sinon un visuel textile de remplacement
 * avec une étiquette clairement identifiée (ex. « [PHOTO À FOURNIR] »).
 */
export default function Photo({
  media,
  sizes = "100vw",
  className = "",
  imgClassName = "",
  priority = false,
  seed = 1,
  tone = "dark",
  showLabel = true,
}: {
  media: Media;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  seed?: number;
  tone?: "dark" | "light";
  /** Masquer l'étiquette (le parent l'affiche lui-même). */
  showLabel?: boolean;
}) {
  if (media.src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={media.src} alt={media.alt} fill sizes={sizes} priority={priority} className={`object-cover ${imgClassName}`} />
      </div>
    );
  }
  return (
    <div role="img" aria-label={`${media.alt} — ${media.placeholder ?? "photo à fournir"}`} className={`relative overflow-hidden ${className}`}>
      <div className={`absolute inset-0 ${imgClassName}`}>
        <div className="absolute inset-0 opacity-60 saturate-[.75]">
          <PatchField cols={4} rows={5} seed={seed} gap={1} />
        </div>
        <div
          className={`absolute inset-0 ${tone === "dark" ? "bg-gradient-to-t from-night/85 via-night/45 to-night/20" : "bg-gradient-to-t from-cream/80 via-cream/40 to-cream/10"}`}
        />
      </div>
      {site.showPlaceholderLabels && showLabel && (
        <span
          className={`ph-label absolute bottom-3 left-3 right-3 z-[2] ${tone === "dark" ? "text-cream/85" : "text-umber/80"}`}
        >
          {media.placeholder ?? "[PHOTO À FOURNIR]"}
        </span>
      )}
    </div>
  );
}
