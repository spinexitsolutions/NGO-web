"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, BookOpen, CalendarDays, Heart, Home, Sprout } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { compactInr, pct } from "@/lib/format";
import type { NavItem, SiteSettings } from "@/lib/types";
import SmartImage from "@/components/ui/SmartImage";
import Logo from "./Logo";
import { useSite } from "./SiteShell";

const EASE = [0.22, 1, 0.36, 1] as const;
const SHUTTER = [0.76, 0, 0.24, 1] as const;

export type Ticker = { title: string; slug: string; raised: number; goal: number } | null;

type Props = {
  settings: Pick<SiteSettings, "name" | "shortName" | "email" | "phone" | "socials" | "donateLabel" | "announcement">;
  nav: NavItem[];
  ticker: Ticker;
};

export default function Navbar({ settings, nav, ticker }: Props) {
  const pathname = usePathname();
  const { lock, introDone } = useSite();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setCompact(v > 120);
    setHidden(v > 500 && v > prev + 2);
    if (v < prev - 2) setHidden(false);
  });

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    lock(open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lock]);

  const inline = nav.slice(0, 5);
  const announce = settings.announcement.enabled && !compact && !open;
  const tile = "pointer-events-auto flex h-12 items-center rounded-[0.8rem] shadow-[0_10px_30px_-14px_rgb(0_0_0/0.35)]";

  return (
    <>
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-[60]"
        initial={{ y: -80, opacity: 0 }}
        animate={introDone ? { y: hidden && !open ? -110 : 0, opacity: 1 } : undefined}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {/* announcement strip */}
        <AnimatePresence initial={false}>
          {announce && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.5, ease: EASE }} className="pointer-events-auto overflow-hidden">
              <Link href={settings.announcement.link || "/donate"} className="group flex items-center justify-center gap-3 bg-accent px-4 py-2 text-ink">
                <span className="eyebrow rounded-[0.3rem] bg-ink px-1.5 py-0.5 text-accent">Live</span>
                <span className="truncate text-[0.82rem] font-medium">{settings.announcement.text}</span>
                <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:rotate-45" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative flex items-start justify-between gap-2 px-3 pt-3 md:px-4">
          {/* logo tile */}
          <Link href="/" aria-label={`${settings.name} home`} className={cn(tile, "gap-2 px-2 pr-4 transition-colors", open ? "bg-paper text-ink" : "bg-ink text-paper")}>
            <Logo name={settings.shortName} />
          </Link>

          {/* links tile — desktop */}
          <AnimatePresence initial={false}>
            {!compact && !open && (
              <motion.nav
                key="links"
                aria-label="Primary"
                initial={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: EASE }}
                className={cn(tile, "glass absolute left-1/2 top-3 hidden -translate-x-1/2 px-1.5 ring-1 ring-ink/5 lg:flex")}
                onMouseLeave={() => setHover(null)}
              >
                {inline.map((item, i) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onMouseEnter={() => setHover(item.id)}
                      className="relative flex h-9 items-center rounded-[0.55rem] px-3.5 text-[0.88rem] font-medium"
                    >
                      {hover === item.id && <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-[0.55rem] bg-ink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                      <span className={cn("relative transition-colors duration-200", hover === item.id ? "text-paper" : active ? "text-ink" : "text-ink/65")}>{item.label}</span>
                      <sup className={cn("mono relative ml-0.5 text-[0.6rem] transition-colors", hover === item.id ? "text-accent" : "text-muted")}>0{i + 1}</sup>
                      {active && hover !== item.id && <span className="absolute bottom-1 left-1/2 h-[2px] w-3 -translate-x-1/2 rounded bg-ink" />}
                    </Link>
                  );
                })}
              </motion.nav>
            )}
          </AnimatePresence>

          <div className="flex items-start gap-2">
            {/* live campaign ticker */}
            {ticker && !open && (
              <Link href={`/campaigns/${ticker.slug}`} className={cn(tile, "glass hidden gap-3 px-3 ring-1 ring-ink/5 xl:flex")}>
                <span className="relative grid size-7 place-items-center">
                  <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" strokeWidth="4" className="stroke-ink/10" />
                    <circle cx="18" cy="18" r="15" fill="none" strokeWidth="4" strokeLinecap="round" className="stroke-ink" strokeDasharray={`${pct(ticker.raised, ticker.goal) * 0.94} 100`} />
                  </svg>
                </span>
                <span className="leading-tight">
                  <span className="block text-[0.78rem] font-semibold">{compactInr(ticker.raised)} raised</span>
                  <span className="mono block max-w-40 truncate text-[0.66rem] text-muted">{ticker.title}</span>
                </span>
              </Link>
            )}
            <Link href="/donate" className={cn(tile, "group hidden gap-2 bg-accent px-4 text-[0.9rem] font-semibold text-ink sm:flex")}>
              <Heart className="size-4 fill-ink transition-transform duration-500 group-hover:scale-125" />
              <span className="relative inline-flex h-6 overflow-hidden">
                <span className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-1/2">
                  <span className="leading-6">{settings.donateLabel}</span>
                  <span className="leading-6" aria-hidden>{settings.donateLabel}</span>
                </span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(tile, "group relative gap-3 overflow-hidden px-4 text-[0.9rem] font-semibold ring-1 transition-colors", open ? "bg-accent text-ink ring-accent" : "glass text-ink ring-ink/5")}
            >
              <span className="relative hidden h-6 overflow-hidden sm:inline-flex">
                <span className={cn("flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]", open && "-translate-y-1/2")}>
                  <span className="leading-6">Menu</span>
                  <span className="leading-6">Close</span>
                </span>
              </span>
              <span className="relative grid size-4 grid-cols-2 gap-[3px]">
                {[0, 1, 2, 3].map((d) => (
                  <motion.span
                    key={d}
                    className="rounded-[2px] bg-current"
                    animate={open ? { rotate: 45, scale: d % 3 === 0 ? 1 : 0.4 } : { rotate: 0, scale: 1 }}
                    transition={{ duration: 0.45, ease: EASE, delay: d * 0.03 }}
                  />
                ))}
              </span>
              {/* scroll progress underline */}
              <motion.span style={{ scaleX: progress }} className={cn("absolute inset-x-0 bottom-0 h-[3px] origin-left", open ? "bg-ink" : "bg-accent")} />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileDock pathname={pathname} hidden={open} />
      <MenuOverlay open={open} nav={nav} settings={settings} pathname={pathname} ticker={ticker} />
    </>
  );
}

/* ───────────── mobile bottom dock ───────────── */
function MobileDock({ pathname, hidden }: { pathname: string; hidden: boolean }) {
  const { introDone } = useSite();
  const items = [
    { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
    { href: "/programs", label: "Work", icon: Sprout, match: (p: string) => p.startsWith("/programs") || p.startsWith("/campaigns") },
    { href: "/donate", label: "Give", icon: Heart, accent: true, match: (p: string) => p.startsWith("/donate") },
    { href: "/stories", label: "Stories", icon: BookOpen, match: (p: string) => p.startsWith("/stories") },
    { href: "/events", label: "Events", icon: CalendarDays, match: (p: string) => p.startsWith("/events") },
  ];
  return (
    <motion.nav
      aria-label="Quick"
      initial={{ y: 120 }}
      animate={introDone ? { y: hidden ? 120 : 0 } : undefined}
      transition={{ duration: 0.7, ease: EASE, delay: hidden ? 0 : 0.5 }}
      className="glass-dark fixed inset-x-3 bottom-3 z-[58] flex items-center justify-between rounded-[1.1rem] p-1.5 text-paper shadow-[0_20px_50px_-15px_rgb(0_0_0/0.6)] ring-1 ring-paper/10 lg:hidden"
      style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
    >
      {items.map((it) => {
        const active = it.match(pathname);
        if (it.accent)
          return (
            <Link key={it.href} href={it.href} className="mx-1 flex h-12 flex-1 items-center justify-center gap-2 rounded-[0.8rem] bg-accent text-[0.85rem] font-semibold text-ink active:scale-95">
              <it.icon className="size-4 fill-ink" /> {it.label}
            </Link>
          );
        return (
          <Link key={it.href} href={it.href} className="relative flex h-12 w-14 flex-col items-center justify-center gap-0.5 rounded-[0.8rem] active:scale-95">
            {active && <motion.span layoutId="dock-active" className="absolute inset-0 rounded-[0.8rem] bg-paper/10" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
            <it.icon className={cn("relative size-[1.15rem]", active ? "text-accent" : "text-paper/70")} />
            <span className={cn("relative text-[0.62rem] font-medium", active ? "text-paper" : "text-paper/55")}>{it.label}</span>
          </Link>
        );
      })}
    </motion.nav>
  );
}

/* ───────────── full-screen menu ───────────── */
function MenuOverlay({ open, nav, settings, pathname, ticker }: { open: boolean; nav: NavItem[]; settings: Props["settings"]; pathname: string; ticker: Ticker }) {
  const [active, setActive] = useState(0);
  const cols = 5;
  return (
    <AnimatePresence>
      {open && (
        <motion.div key="menu" className="fixed inset-0 z-[55]" initial="closed" animate="open" exit="closed">
          {/* shutter columns */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: cols }).map((_, i) => (
              <motion.span
                key={i}
                className="h-full flex-1 origin-top bg-night"
                variants={{
                  closed: { scaleY: 0, transition: { duration: 0.55, ease: SHUTTER, delay: (cols - i) * 0.04 } },
                  open: { scaleY: 1, transition: { duration: 0.7, ease: SHUTTER, delay: i * 0.05 } },
                }}
              />
            ))}
          </div>
          <motion.div
            className="dots-dark relative h-full overflow-y-auto text-paper"
            data-lenis-prevent
            variants={{ closed: { opacity: 0, transition: { duration: 0.2 } }, open: { opacity: 1, transition: { delay: 0.35 } } }}
          >
            <div className="container-x grid min-h-dvh grid-cols-1 gap-10 pb-28 pt-24 lg:grid-cols-12 lg:pb-10 lg:pt-28">
              <nav className="flex flex-col justify-center lg:col-span-7" aria-label="Menu">
                <ul onMouseLeave={() => setActive(-1)}>
                  {nav.map((item, i) => {
                    const current = pathname.startsWith(item.href);
                    return (
                      <li key={item.id} className="relative overflow-hidden border-b border-paper/10">
                        <motion.div
                          variants={{ closed: { y: "110%" }, open: { y: "0%", transition: { duration: 0.8, ease: EASE, delay: 0.35 + i * 0.045 } } }}
                        >
                          <Link href={item.href} onMouseEnter={() => setActive(i)} className="group relative flex items-center gap-4 py-2 md:py-2.5">
                            <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100" />
                            <span className="mono relative w-10 pl-1 text-xs text-paper/40 transition-colors group-hover:text-ink">{String(i + 1).padStart(2, "0")}</span>
                            <span className="display relative text-[2.5rem] transition-all duration-500 group-hover:translate-x-2 group-hover:text-ink sm:text-6xl lg:text-[4.6rem]">
                              {item.label}
                            </span>
                            {current && <span className="eyebrow relative ml-auto mr-2 rounded bg-accent px-2 py-1 text-ink group-hover:bg-ink group-hover:text-accent">Here</span>}
                          </Link>
                        </motion.div>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <motion.aside
                className="hidden flex-col justify-center gap-4 lg:col-span-4 lg:col-start-9 lg:flex"
                variants={{ closed: { opacity: 0, y: 30 }, open: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: 0.55 } } }}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl3 bg-paper/5">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={active}
                      className="absolute inset-0"
                      initial={{ clipPath: "inset(0 0 100% 0)" }}
                      animate={{ clipPath: "inset(0 0 0% 0)" }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: SHUTTER }}
                    >
                      {nav[Math.max(0, active)]?.image && <SmartImage src={nav[Math.max(0, active)].image} alt="" fill sizes="35vw" className="object-cover" />}
                    </motion.div>
                  </AnimatePresence>
                  <span className="eyebrow absolute left-4 top-4 rounded bg-night/70 px-2 py-1 text-paper backdrop-blur">{nav[Math.max(0, active)]?.label}</span>
                </div>
                {ticker && (
                  <Link href={`/campaigns/${ticker.slug}`} className="flex items-center justify-between rounded-xl2 bg-accent p-4 text-ink">
                    <span>
                      <span className="eyebrow block opacity-70">Live campaign</span>
                      <span className="font-semibold">{ticker.title}</span>
                    </span>
                    <span className="display text-3xl">{pct(ticker.raised, ticker.goal)}%</span>
                  </Link>
                )}
              </motion.aside>

              <motion.div
                className="flex flex-col gap-4 border-t border-paper/10 pt-6 text-sm text-paper/60 sm:flex-row sm:items-end sm:justify-between lg:col-span-12"
                variants={{ closed: { opacity: 0 }, open: { opacity: 1, transition: { delay: 0.8 } } }}
              >
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <a href={`mailto:${settings.email}`} className="text-paper hover:text-accent">{settings.email}</a>
                  <a href={`tel:${settings.phone}`} className="hover:text-paper">{settings.phone}</a>
                </div>
                <div className="mono flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase">
                  {Object.entries(settings.socials).map(([k, v]) =>
                    v ? (
                      <a key={k} href={v} target="_blank" rel="noreferrer" className="hover:text-accent">
                        {k === "x" ? "X" : k}
                      </a>
                    ) : null,
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
