import { BRIEF_SECTIONS, type BriefData } from "@/lib/validation/brief";

export function BriefView({ data }: { data: BriefData }) {
  return (
    <div className="flex flex-col gap-6">
      {BRIEF_SECTIONS.map((section) => {
        const values = data[section.key] as Record<string, string | undefined>;
        return (
          <section key={section.key}>
            <h3 className="mb-3 text-sm font-semibold">{section.title}</h3>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {section.fields.map((f) => (
                <div key={f.key} className={f.long ? "sm:col-span-2" : undefined}>
                  <dt className="text-xs text-muted">{f.label}</dt>
                  <dd className="mt-0.5 whitespace-pre-line break-words text-sm">{values[f.key]?.trim() || <span className="text-muted">—</span>}</dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}
    </div>
  );
}
