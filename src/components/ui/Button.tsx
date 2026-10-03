"use client";

import Link from "next/link";
import { useRef, type ReactNode, type Ref } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";

type Variant = "glass" | "solid" | "outline" | "dark";

const styles: Record<Variant, string> = {
  glass: "glass text-cream",
  solid: "bg-saffron text-night border border-saffron",
  outline: "border border-current text-current",
  dark: "bg-night text-cream border border-night",
};

const fills: Record<Variant, string> = {
  glass: "bg-cream",
  solid: "bg-cream",
  outline: "bg-umber",
  dark: "bg-madder",
};

const hoverText: Record<Variant, string> = {
  glass: "group-hover:text-night",
  solid: "group-hover:text-night",
  outline: "group-hover:text-cream",
  dark: "group-hover:text-cream",
};

/**
 * Bouton avec micro-interactions : attraction magnétique (pointeur fin uniquement),
 * remplissage textile qui monte au survol, flèche qui glisse.
 */
export default function Button({
  href,
  children,
  variant = "glass",
  className = "",
  type = "button",
  onClick,
  disabled,
  arrow = true,
  ...rest
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  arrow?: boolean;
  "data-hero-hide"?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
      const move = contextSafe!((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
      });
      const leave = contextSafe!(() => {
        xTo(0);
        yTo(0);
      });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );

  const cls = `group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-500 disabled:opacity-50 ${styles[variant]} ${className}`;
  const inner = (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-0 translate-y-[101%] rounded-full ${fills[variant]} transition-transform duration-700 ease-[var(--ease-silk)] group-hover:translate-y-0`}
      />
      <span className={`relative z-10 transition-colors duration-500 ${hoverText[variant]}`}>{children}</span>
      {arrow && (
        <span aria-hidden="true" className={`relative z-10 inline-block overflow-hidden transition-colors duration-500 ${hoverText[variant]}`}>
          <span className="inline-block transition-transform duration-500 ease-[var(--ease-silk)] group-hover:translate-x-[120%]">→</span>
          <span className="absolute left-0 inline-block -translate-x-[120%] transition-transform duration-500 ease-[var(--ease-silk)] group-hover:translate-x-0">
            →
          </span>
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link ref={ref as Ref<HTMLAnchorElement>} href={href} className={cls} {...rest}>
        {inner}
      </Link>
    );
  }
  return (
    <button ref={ref as Ref<HTMLButtonElement>} type={type} onClick={onClick} disabled={disabled} className={cls} {...rest}>
      {inner}
    </button>
  );
}
