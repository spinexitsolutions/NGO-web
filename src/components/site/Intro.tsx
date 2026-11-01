"use client";

import { animate, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { IntroSettings } from "@/lib/types";
import { LogoMark } from "./Logo";
import { useSite } from "./SiteShell";

const KEY = "ummeed-intro-seen";
const SHUTTER = [0.76, 0, 0.24, 1] as const;
const COLS = 5;

/**
 * Intro loader: an odometer of words rolls past a lime marker while the counter
 * runs, then the forest screen lifts away in five staggered shutters.
 */
export default function Intro({ intro, name, onDone }: { intro: IntroSettings; name: string; onDone: () => void }) {
  const { lock } = useSite();
  const [phase, setPhase] = useState<"run" | "exit" | "gone">("run");
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const words = intro.words.length ? intro.words : [name];
  const duration = Math.max(1200, intro.duration);

  useEffect(() => {
    let seen = false;
    try {
      seen = intro.oncePerSession && sessionStorage.getItem(KEY) === "1";
    } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("gone");
      onDone();
      return;
    }
    lock(true);
    const step = duration / words.length;
    const timers: ReturnType<typeof setTimeout>[] = [];
    words.forEach((_, i) => i > 0 && timers.push(setTimeout(() => setIndex(i), i * step)));
    const c = animate(0, 100, { duration: duration / 1000, ease: [0.65, 0, 0.35, 1], onUpdate: (v) => setCount(Math.round(v)) });
    timers.push(
      setTimeout(() => {
        setPhase("exit");
        lock(false);
        onDone();
        try {
          sessionStorage.setItem(KEY, "1");
        } catch {}
      }, duration + 350),
    );
    timers.push(setTimeout(() => setPhase("gone"), duration + 350 + 1400));
    return () => {
      timers.forEach(clearTimeout);
      c.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "gone") return null;
  const exiting = phase === "exit";
  const ROW = 1.05; // em per row in the odometer

  return (
    <div className="intro-overlay pointer-events-none fixed inset-0 z-[100]" aria-hidden>
      {/* shutters: lime layer trails the forest layer */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLS }).map((_, i) => (
          <motion.span
            key={`l${i}`}
            className="h-full flex-1 bg-accent"
            animate={exiting ? { y: "-100%" } : { y: "0%" }}
            transition={{ duration: 1, ease: SHUTTER, delay: 0.12 + i * 0.07 }}
          />
        ))}
      </div>
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLS }).map((_, i) => (
          <motion.span
            key={`f${i}`}
            className="h-full flex-1 bg-night"
            animate={exiting ? { y: "-100%" } : { y: "0%" }}
            transition={{ duration: 0.9, ease: SHUTTER, delay: i * 0.07 }}
          />
        ))}
      </div>

      <motion.div
        className="dots-dark absolute inset-0 flex flex-col text-paper"
        animate={exiting ? { opacity: 0, y: -40 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: SHUTTER }}
      >
        <div className="flex items-center justify-between px-4 pt-4 md:px-8 md:pt-6">
          <span className="flex items-center gap-2.5">
            <LogoMark />
            <span className="eyebrow text-paper/70">{name}</span>
          </span>
          <span className="eyebrow hidden text-paper/50 sm:block">{intro.tagline}</span>
        </div>

        {/* odometer */}
        <div className="relative flex flex-1 items-center overflow-hidden px-4 md:px-8">
          <div className="display relative h-[1.05em] text-[clamp(3.6rem,14vw,12rem)]">
            <motion.div animate={{ y: `-${index * ROW}em` }} transition={{ duration: 0.75, ease: SHUTTER }}>
              {words.map((w, i) => (
                <div
                  key={w + i}
                  className="flex h-[1.05em] items-center gap-[0.2em] whitespace-nowrap transition-[opacity,color] duration-500"
                  style={{ opacity: i === index ? 1 : 0.14 }}
                >
                  <span className={i === index ? "text-accent" : ""}>{w}</span>
                </div>
              ))}
            </motion.div>
          </div>
          {/* faded rows above / below for depth */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,var(--color-night)_0%,transparent_32%,transparent_68%,var(--color-night)_100%)]" />
        </div>

        <div className="flex items-end justify-between gap-4 px-4 pb-5 md:px-8 md:pb-8">
          <div className="max-w-[14rem] text-xs leading-relaxed text-paper/50 sm:hidden">{intro.tagline}</div>
          <div className="eyebrow hidden text-paper/50 sm:block">Loading — {words[index]}</div>
          <span className="display text-[clamp(4rem,12vw,9rem)] tabular-nums leading-none">
            {count}
            <span className="text-accent">%</span>
          </span>
        </div>
        <div className="h-[3px] w-full bg-paper/10">
          <div className="h-full bg-accent" style={{ width: `${count}%` }} />
        </div>
      </motion.div>
    </div>
  );
}
