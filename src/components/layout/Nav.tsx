"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import Emblem from "@/components/ui/Emblem";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import { joinCta, nav, navCta, type NavItem } from "@/content/site";
import { makePatches, patchStyle } from "@/lib/patchwork";

const menuPatches = makePatches(24, 41);

/** Pages dont le haut est clair : la barre reste opaque pour rester lisible. */
const lightTopPages = ["/le-shaykh"];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  // Apparence au scroll : transparente sur le hero, verre sombre ensuite, masquée en descendant.
  // Pendant les sections plein écran (attribut `data-immersive` posé par elles), la barre reste masquée.
  // Ailleurs, elle ne réapparaît qu'après une vraie remontée (> 80 px), pas au moindre à-coup.
  useEffect(() => {
    let last = window.scrollY;
    let upTravel = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last;
      last = y;
      setScrolled(y > 40);
      if (document.documentElement.hasAttribute("data-immersive")) {
        upTravel = 0;
        return setHidden(true);
      }
      if (y < 200) {
        upTravel = 0;
        return setHidden(false);
      }
      if (delta > 0) {
        upTravel = 0;
        setHidden(true);
      } else if (delta < 0) {
        upTravel -= delta;
        if (upTravel > 80) setHidden(false);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Section active (accueil uniquement).
  useEffect(() => {
    if (pathname !== "/") return setActive(null);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id || null)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("main > section, body > footer").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Menu mobile plein écran : les morceaux de tissu recouvrent l'écran puis les liens montent.
  useGSAP(
    () => {
      const m = menuRef.current;
      if (!m) return;
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .set(m, { visibility: "visible" })
        .from(m.querySelectorAll("[data-menu-patch]"), {
          scaleY: 0,
          transformOrigin: "top",
          duration: 0.7,
          ease: "expo.inOut",
          stagger: { each: 0.018, from: "random" },
        })
        .from(m.querySelector("[data-menu-veil]"), { opacity: 0, duration: 0.5 }, "-=0.35")
        .from(m.querySelectorAll("[data-menu-link]"), { yPercent: 110, duration: 0.9, stagger: 0.05 }, "-=0.3")
        .from(m.querySelectorAll("[data-menu-foot]"), { opacity: 0, y: 10, duration: 0.6 }, "-=0.6");
    },
    { scope: menuRef },
  );

  useEffect(() => {
    if (!tl.current) return;
    if (open) {
      tl.current.timeScale(1).play();
      document.body.style.overflow = "hidden";
    } else {
      tl.current.timeScale(1.6).reverse();
      document.body.style.overflow = "";
    }
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => {
    const [path, hash] = href.split("#");
    // Ancre de l'accueil (ex. « /#actions ») : suit la section visible. Autre page : égalité de chemin.
    if (path === "" || path === "/") return hash ? pathname === "/" && active === hash : pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  /** Sur l'accueil, « Le Merkez » ramène tout en haut ; ailleurs, le lien normal mène à l'accueil. */
  const goHome = (e: React.MouseEvent) => {
    setOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      scrollToTarget("#top");
      history.replaceState(null, "", "/");
    }
  };
  const itemActive = (item: NavItem) => isActive(item.href) || Boolean(item.children?.some((c) => isActive(c.href)));
  const solid = (scrolled || lightTopPages.includes(pathname)) && !open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-700 ease-[var(--ease-silk)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${solid ? "border-b border-cream/10 bg-night/85" : "border-b border-transparent"}`}
      >
        <nav aria-label="Navigation principale" className="gutter mx-auto flex h-[var(--nav-h)] items-center justify-between gap-6 text-cream">
          <Link href="/" onClick={goHome} className="group flex items-center gap-3" aria-label="Le Merkez — accueil">
            <Emblem size={24} className="transition-transform duration-700 ease-[var(--ease-silk)] group-hover:rotate-90" />
            <span className="whitespace-nowrap text-[0.72rem] font-semibold uppercase tracking-[0.3em] sm:text-[0.8rem] sm:tracking-[0.38em]">Le Merkez</span>
          </Link>

          <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
            {nav.filter((n) => n.inHeader).map((item) => (
              <li key={item.label} className="group/item relative">
                <Link
                  href={item.href}
                  onClick={item.href === "/" ? goHome : undefined}
                  aria-current={itemActive(item) ? "true" : undefined}
                  aria-haspopup={item.children ? "true" : undefined}
                  className="group relative flex items-center gap-1.5 py-2 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-cream/75 transition-colors hover:text-cream aria-[current]:text-cream"
                >
                  {item.label}
                  {item.children && (
                    <svg aria-hidden="true" width="8" height="5" viewBox="0 0 8 5" className="transition-transform duration-300 group-hover/item:rotate-180">
                      <path d="M1 1l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  )}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-saffron transition-transform duration-500 ease-[var(--ease-silk)] group-hover:scale-x-100 group-aria-[current]:scale-x-100"
                  />
                </Link>
                {item.children && (
                  <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 transition-[opacity,visibility,translate] duration-300 group-focus-within/item:visible group-focus-within/item:opacity-100 group-hover/item:visible group-hover/item:opacity-100">
                    <ul className="min-w-[200px] overflow-hidden rounded-[3px] border border-cream/10 bg-night/90 py-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,.6)]">
                      {item.children.map((c, i) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            aria-current={isActive(c.href) ? "page" : undefined}
                            className="flex items-center gap-3 px-5 py-3 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-cream/75 transition-colors hover:bg-cream/[0.06] hover:text-cream aria-[current]:text-saffron"
                          >
                            <span aria-hidden="true" className="h-2 w-2" style={{ backgroundColor: i ? "#283d5b" : "#8f2d22" }} />
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={joinCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap rounded-full bg-saffron px-4 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-night transition-colors duration-500 hover:bg-cream sm:px-5"
            >
              <span className="sm:hidden">Rejoindre</span>
              <span className="max-sm:hidden">{joinCta.label}</span>
            </a>
            <button
              ref={burgerRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className="relative z-[60] grid h-10 w-10 place-items-center"
            >
              <span className="relative block h-3 w-6">
                <span
                  className={`absolute left-0 h-px w-6 bg-cream transition-transform duration-500 ${open ? "top-1.5 rotate-45" : "top-0"}`}
                />
                <span
                  className={`absolute left-0 h-px w-6 bg-cream transition-transform duration-500 ${open ? "top-1.5 -rotate-45" : "top-3"}`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <div
        id="menu-mobile"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
        className="invisible fixed inset-0 z-40 text-cream"
      >
        <div aria-hidden="true" className="absolute inset-0 grid grid-cols-4 grid-rows-6 lg:grid-cols-8 lg:grid-rows-3">
          {menuPatches.map((p) => (
            <div key={p.id} data-menu-patch style={patchStyle(p)} />
          ))}
        </div>
        <div data-menu-veil aria-hidden="true" className="absolute inset-0 bg-night/90" />
        <div className="gutter relative flex h-full flex-col justify-between pb-10 pt-[calc(var(--nav-h)+2rem)]">
          <ul className="space-y-1">
            {nav.map((item, i) => (
              <li key={item.label}>
                <div className="line-mask">
                  <Link
                    data-menu-link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-1 text-[clamp(1.9rem,8.5vw,3.2rem)] font-light leading-tight tracking-tight"
                  >
                    <span className="text-[0.65rem] font-semibold tracking-[0.2em] text-saffron">0{i + 1}</span>
                    {item.label}
                  </Link>
                </div>
                {item.children && (
                  <ul className="mb-2 ml-9 flex gap-6">
                    {item.children.map((c) => (
                      <li key={c.href} className="line-mask">
                        <Link
                          data-menu-link
                          href={c.href}
                          onClick={() => setOpen(false)}
                          className="block py-1 text-sm font-medium uppercase tracking-[0.2em] text-cream/70"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="flex flex-col">
          <Link
            data-menu-foot
            href={navCta.href}
            onClick={() => setOpen(false)}
            className="mb-6 inline-flex items-center justify-center gap-3 self-start rounded-full bg-saffron px-7 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-night"
          >
            {navCta.label} <span aria-hidden="true">→</span>
          </Link>
          <p data-menu-foot className="font-serif text-lg italic text-cream/70">
            « Afin que vous vous connaissiez. »
          </p>
          </div>
        </div>
      </div>
    </>
  );
}
