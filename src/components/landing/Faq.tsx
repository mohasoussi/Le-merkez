import { Plus } from "lucide-react";
import { Section } from "./Section";

/** Accordéon natif <details> : accessible au clavier et fonctionnel sans JavaScript. */
export function Faq({ items }: { items: { id: string; question: string; answer: string }[] }) {
  if (items.length === 0) return null;
  return (
    <Section id="faq" eyebrow="FAQ" title="Vos questions, nos réponses">
      <div className="mx-auto max-w-3xl divide-y divide-line rounded-3xl border border-line bg-white">
        {items.map((f) => (
          <details key={f.id} className="group px-5 sm:px-7 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium">
              {f.question}
              <Plus className="size-5 shrink-0 text-muted transition-transform duration-300 group-open:rotate-45" aria-hidden />
            </summary>
            <p className="-mt-1 pb-5 leading-relaxed whitespace-pre-line text-ink-soft">{f.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
