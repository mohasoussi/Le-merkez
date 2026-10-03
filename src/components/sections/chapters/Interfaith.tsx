import { getAction } from "@/content/actions";
import ChapterPanel from "./ChapterPanel";

/** 01 — Rencontres interreligieuses : deux cercles qui se rejoignent. */
export default function Interfaith() {
  const action = getAction("rencontres-interreligieuses")!;
  return (
    <ChapterPanel
      action={action}
      bigWord="Dialogue"
      aside={
        <div aria-hidden="true" className="relative mx-auto hidden aspect-square w-full max-w-[300px] lg:block">
          <span data-orbit="a" className="absolute left-0 top-1/2 h-[62%] w-[62%] -translate-y-1/2 rounded-full border border-cream/40" />
          <span data-orbit="b" className="absolute right-0 top-1/2 h-[62%] w-[62%] -translate-y-1/2 rounded-full border border-saffron/70" />
          <span className="eyebrow absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-cream/60">Connaissance mutuelle</span>
        </div>
      }
    />
  );
}
