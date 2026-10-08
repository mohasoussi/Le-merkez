import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "brand";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-[background,color,box-shadow,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap";
const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-ink-soft shadow-soft",
  brand: "bg-brand text-white hover:bg-brand-strong shadow-soft",
  secondary: "bg-surface text-ink ring-1 ring-line hover:ring-ink/25 hover:bg-canvas",
  ghost: "text-ink-soft hover:bg-canvas hover:text-ink",
  danger: "bg-danger text-white hover:bg-danger/90",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-13 px-6 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  pending,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size; pending?: boolean }) {
  return (
    <button className={buttonClass(variant, size, className)} disabled={pending || props.disabled} aria-busy={pending || undefined} {...props}>
      {pending && <Spinner />}
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: { href: string; variant?: Variant; size?: Size; className?: string; children: ReactNode } & Omit<ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn("size-4 animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
