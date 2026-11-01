"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type { NavItem, SiteSettings } from "@/lib/types";
import SmartImage from "@/components/ui/SmartImage";
import Logo from "./Logo";
import { Magnetic, useMediaQuery } from "./motion";
import { useSite } from "./SiteShell";

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  settings: Pick<SiteSettings, "name" | "shortName" | "email" | "phone" | "socials" | "donateLabel" | "announcement">;
  nav: NavItem[];
};

export default function Navbar({ settings, nav }: Props) {
  const pathname = usePathname();
  const { lock, introDone } = useSite();
  const { scrollY, scrollYProgress } = useScroll();
  const ring = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const desktop = useMediaQuery("(min-width: 1024px)");

  useMotionValueEvent(scrollY, "change", (v) => setCompact(v > 140));

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    lock(open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lock]);

  const inline = nav.slice(0, 5);
  const showLinks = desktop && !compact && !open;
  const announce = settings.announcement.enabled && !compact && !open;

  return (
    <>
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-[60]"
        initial={{ y: -40, opacity: 0 }}
        animate={introDone ? { y: 0, opacity: 1 } : undefined}
        transition={{ duration: 1, ease: EASE, delay: 0.35 }}
      >
        {/* announcement ticker */}
        <AnimatePresence initial={false}>
          {announce && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="pointer-events-auto overflow-hidden"
            >
              <Link
                href={settings.announcement.link || "/donate"}
                className="group flex items-center justify-center gap-2 bg-ink px-4 py-2 text-center text-[0.78rem] text-paper"
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                <span className="truncate">{settings.announcement.text}</span>
                <ArrowUpRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center px-3 pt-3 md:pt-4">
          <motion.nav
            layout
            transition={{ layout: { duration: 0.6, ease: EASE } }}
            style={{ borderRadius: 999 }}
            className={cn(
              "pointer-events-auto flex items-center gap-1 p-1.5 shadow-[0_8px_40px_-12px_rgb(0_0_0/0.25)] ring-1",
              open ? "bg-paper/10 ring-paper/15 backdrop-blur-xl" : "glass ring-ink/5",
            )}
            aria-label="Primary"
          >
            <motion.div layout="position">
              <Link
                href="/"
                className={cn("flex items-center rounded-full py-1 pl-1 pr-3", open && "text-paper")}
                aria-label={`${settings.name} home`}
              >
                <Logo name={settings.shortName} hideText={compact && !desktop && !open} />
              </Link>
            </motion.div>

            <AnimatePresence initial={false} mode="popLayout">
              {showLinks && (
                <motion.ul
                  key="links"
                  initial={{ opacity: 0, filter: "blur(6px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(6px)", transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
                  className="flex items-center"
                  onMouseLeave={() => setHover(null)}
                >
                  {inline.map((item) => {
                    const active = pathname.startsWith(item.href);
                    return (
                      <li key={item.id} className="relative">
                        <Link
                          href={item.href}
                          onMouseEnter={() => setHover(item.id)}
                          className={cn(
                            "relative z-10 block rounded-full px-3.5 py-2 text-[0.88rem] font-medium tracking-[-0.01em] transition-colors",
                            active ? "text-ink" : "text-ink/60 hover:text-ink",
                          )}
                        >
                          {item.label}
                          {active && <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent" />}
                        </Link>
                        {hover === item.id && (
                          <motion.span
                            layoutId="nav-hover"
                            className="absolute inset-0 rounded-full bg-ink/[0.06]"
                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          />
                        )}
                      </li>
                    );
                  })}
                </motion.ul>
              )}
            </AnimatePresence>

            <motion.div layout="position" className="flex items-center gap-1">
              <Magnetic strength={0.25}>
                <Link
                  href="/donate"
                  className="group relative flex h-10 items-center gap-2 overflow-hidden rounded-full bg-accent px-4 text-[0.88rem] font-semibold text-white"
                >
                  <span className="absolute inset-0 translate-y-full rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                  <Heart className="relative size-4 fill-white transition-transform duration-500 group-hover:scale-110" />
                  <span className="relative">{settings.donateLabel}</span>
                </Link>
              </Magnetic>

              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                className={cn(
                  "relative grid size-10 place-items-center rounded-full transition-colors",
                  open ? "bg-paper text-ink" : "bg-ink text-paper",
                )}
              >
                {/* scroll progress ring */}
                <svg className="absolute -inset-[3px] size-[calc(100%+6px)] -rotate-90" viewBox="0 0 46 46" aria-hidden>
                  <motion.circle
                    cx="23"
                    cy="23"
                    r="21.5"
                    fill="none"
                    strokeWidth="1.5"
                    className="stroke-accent"
                    style={{ pathLength: ring, opacity: open ? 0 : 1 }}
                  />
                </svg>
                <span className="relative block h-3 w-4">
                  <motion.span
                    className="absolute left-0 top-0 h-[1.5px] w-full rounded bg-current"
                    animate={open ? { top: "50%", rotate: 45 } : { top: "15%", rotate: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                  <motion.span
                    className="absolute bottom-0 left-0 h-[1.5px] w-full rounded bg-current"
                    animate={open ? { bottom: "45%", rotate: -45, width: "100%" } : { bottom: "15%", rotate: 0, width: "60%" }}
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                </span>
              </button>
            </motion.div>
          </motion.nav>
        </div>
      </motion.header>

      <MenuOverlay open={open} nav={nav} settings={settings} pathname={pathname} />
    </>
  );
}

function MenuOverlay({ open, nav, settings, pathname }: { open: boolean; nav: NavItem[]; settings: Props["settings"]; pathname: string }) {
  const [active, setActive] = useState(0);
  const origin = "calc(100% - 3rem) 2.6rem";
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu"
          className="fixed inset-0 z-[55] overflow-y-auto bg-night text-paper"
          data-lenis-prevent
          initial={{ clipPath: `circle(0% at ${origin})` }}
          animate={{ clipPath: `circle(150% at ${origin})` }}
          exit={{ clipPath: `circle(0% at ${origin})`, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.15 } }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="container-x grid min-h-dvh grid-cols-1 gap-10 pb-10 pt-28 lg:grid-cols-[1.3fr_1fr] lg:pt-32">
            <nav className="flex flex-col justify-center" aria-label="Menu">
              <p className="eyebrow mb-6 text-paper/40">Menu</p>
              <ul onMouseLeave={() => setActive(-1)}>
                {nav.map((item, i) => {
                  const current = pathname.startsWith(item.href);
                  return (
                    <li key={item.id} className="overflow-hidden border-b border-paper/10">
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%", transition: { duration: 0.35, ease: EASE } }}
                        transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onMouseEnter={() => setActive(i)}
                          className={cn(
                            "group flex items-baseline gap-4 py-2.5 transition-opacity duration-300 md:py-3",
                            active !== -1 && active !== i ? "lg:opacity-30" : "opacity-100",
                          )}
                        >
                          <span className="w-8 text-xs tabular-nums text-paper/40">{String(i + 1).padStart(2, "0")}</span>
                          <span className="display text-[2.6rem] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3 sm:text-6xl lg:text-[5.2rem]">
                            {item.label}
                          </span>
                          {current && <span className="ml-auto size-2.5 self-center rounded-full bg-accent" />}
                          <ArrowUpRight className="ml-auto size-6 self-center text-accent opacity-0 transition-opacity group-hover:opacity-100 max-lg:hidden" />
                        </Link>
                      </motion.div>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <motion.aside
              className="hidden flex-col justify-center lg:flex"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.45 }}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl3 bg-paper/5">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={active}
                    className="absolute inset-0"
                    initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.15 }}
                    animate={{ clipPath: "inset(0% 0 0 0)", scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: EASE }}
                  >
                    {nav[Math.max(0, active)]?.image && (
                      <SmartImage src={nav[Math.max(0, active)].image} alt="" fill sizes="40vw" className="object-cover" />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-night/70 via-transparent" />
                    <p className="absolute bottom-6 left-6 serif-accent text-4xl">{nav[Math.max(0, active)]?.label}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.aside>

            <motion.div
              className="flex flex-col gap-6 border-t border-paper/10 pt-6 text-sm text-paper/60 sm:flex-row sm:items-end sm:justify-between lg:col-span-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="space-y-1">
                <a href={`mailto:${settings.email}`} className="block text-lg text-paper hover:text-accent">
                  {settings.email}
                </a>
                <a href={`tel:${settings.phone}`} className="block hover:text-paper">
                  {settings.phone}
                </a>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {Object.entries(settings.socials).map(([k, v]) =>
                  v ? (
                    <a key={k} href={v} target="_blank" rel="noreferrer" className="capitalize hover:text-paper">
                      {k === "x" ? "X / Twitter" : k}
                    </a>
                  ) : null,
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
