"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { IntroSettings, NavItem, SiteSettings } from "@/lib/types";
import Intro from "./Intro";
import Navbar from "./Navbar";

type Ctx = {
  introDone: boolean;
  lenis: React.RefObject<Lenis | null>;
  lock: (v: boolean) => void;
};

const SiteCtx = createContext<Ctx>({ introDone: true, lenis: { current: null }, lock: () => {} });
export const useSite = () => useContext(SiteCtx);

export default function SiteShell({
  children,
  settings,
  intro,
  nav,
}: {
  children: ReactNode;
  settings: Pick<SiteSettings, "name" | "shortName" | "email" | "phone" | "socials" | "donateLabel" | "announcement">;
  intro: IntroSettings;
  nav: NavItem[];
}) {
  const [introDone, setIntroDone] = useState(!intro.enabled);
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({ lerp: 0.1, wheelMultiplier: 1, autoRaf: true });
    lenis.current = l;
    return () => {
      l.destroy();
      lenis.current = null;
    };
  }, []);

  // jump to top on route change
  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  const lock = useCallback((v: boolean) => {
    if (v) {
      lenis.current?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis.current?.start();
      document.documentElement.style.overflow = "";
    }
  }, []);

  return (
    <SiteCtx.Provider value={{ introDone, lenis, lock }}>
      {intro.enabled && <Intro intro={intro} name={settings.shortName} onDone={() => setIntroDone(true)} />}
      <Navbar settings={settings} nav={nav.filter((n) => n.visible)} />
      {children}
    </SiteCtx.Provider>
  );
}
