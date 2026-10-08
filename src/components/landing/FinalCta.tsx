import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { Reveal } from "./Reveal";

export function FinalCta({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="px-4 pb-20 sm:px-6 sm:pb-28">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-center text-white sm:px-12 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgb(99_102_241/0.45),transparent)]" />
        <div className="relative">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl">{title}</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/75 text-pretty">{subtitle}</p>
          <Link href="/demande" className={buttonClass("secondary", "lg", "group mt-9 bg-white text-ink ring-0 hover:bg-white/90")}>
            Demander mon estimation
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
