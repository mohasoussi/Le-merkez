import { getAction } from "@/content/actions";
import Photo from "@/components/ui/Photo";
import ChapterPanel from "./ChapterPanel";

/** 02 — Retraites spirituelles : nature, silence, marche. */
export default function Retreats() {
  const action = getAction("retraites-spirituelles")!;
  return (
    <ChapterPanel
      action={action}
      bigWord="Silence"
      aside={
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {action.moodImages?.map((m, i) => (
              <Photo key={m.placeholder} media={m} seed={40 + i} sizes="(min-width:1024px) 15vw, 50vw" className={`aspect-[3/4] w-full ${i ? "mt-10" : ""}`} />
            ))}
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-cream/75">
            {action.highlights?.map((h) => (
              <li key={h} className="flex items-center gap-4">
                {h}
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-sand/60" />
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
}
