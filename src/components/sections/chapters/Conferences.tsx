import { getAction } from "@/content/actions";
import ChapterPanel from "./ChapterPanel";

/** 03 — Conférences & tables rondes : une table de voix différentes. */
export default function Conferences() {
  const action = getAction("conferences-tables-rondes")!;
  return (
    <ChapterPanel
      action={action}
      bigWord="Questions"
      aside={
        <div>
          <p className="eyebrow mb-5 text-sand/80">Autour de la table</p>
          <ul className="divide-y divide-cream/15 border-y border-cream/15">
            {action.highlights?.map((h, i) => (
              <li key={h} className="group flex items-baseline gap-5 py-4">
                <span className="text-[0.62rem] font-semibold tracking-[0.2em] text-sand/70">0{i + 1}</span>
                <span className="text-xl font-light transition-transform duration-500 ease-[var(--ease-silk)] group-hover:translate-x-2 md:text-2xl">{h}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-cream/60">Questions humaines, spirituelles, culturelles et sociales.</p>
        </div>
      }
    />
  );
}
