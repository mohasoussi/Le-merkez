import { getAction } from "@/content/actions";
import ChapterPanel from "./ChapterPanel";

/** 04 — Actions humanitaires : des gestes concrets, des visages, pas de misérabilisme. */
export default function Humanitarian() {
  const action = getAction("actions-humanitaires")!;
  return (
    <ChapterPanel
      action={action}
      bigWord="Servir"
      aside={
        <div>
          <p className="eyebrow mb-5 text-cream/70">Sur le terrain</p>
          <ul className="grid grid-cols-2 gap-2">
            {action.highlights?.map((h) => (
              <li key={h} className="border border-cream/25 bg-cream/[0.06] px-4 py-5 text-sm font-medium leading-snug backdrop-blur-sm transition-colors duration-500 hover:bg-cream hover:text-terracotta">
                {h}
              </li>
            ))}
          </ul>
          <p className="mt-6 font-serif text-xl italic text-cream/85">Parce que se connaître, c’est aussi prendre soin les uns des autres.</p>
        </div>
      }
    />
  );
}
