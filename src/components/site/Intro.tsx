"use client";

import { AnimatePresence, animate, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { IntroSettings } from "@/lib/types";
import { useSite } from "./SiteShell";

const KEY = "ummeed-intro-seen";
const CURTAIN = [0.76, 0, 0.24, 1] as const;

export default function Intro({ intro, name, onDone }: { intro: IntroSettings; name: string; onDone: () => void }) {
  const { lock } = useSite();
  const [phase, setPhase] = useState<"run" | "exit" | "done">("run");
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const words = intro.words.length ? intro.words : [name];
  const duration = Math.max(1200, intro.duration);

  useEffect(() => {
    let seen = false;
    try {
      seen = intro.oncePerSession && sessionStorage.getItem(KEY) === "1";
    } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      setPhase("done");
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
      }, duration + 250),
    );
    return () => {
      timers.forEach(clearTimeout);
      c.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        setPhase("done");
      }}
    >
      {phase === "run" && (
        <motion.div
          key="intro"
          className="intro-overlay fixed inset-0 z-[100] flex flex-col bg-night text-paper"
          exit={{ y: "-100%" }}
          transition={{ duration: 1.1, ease: CURTAIN }}
        >
          {/* curved bottom edge that flattens as the curtain lifts */}
          <svg className="pointer-events-none absolute left-0 top-full h-[12vh] w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <motion.path
              fill="var(--color-night)"
              initial={{ d: "M0 0 L100 0 Q50 0 0 0 Z" }}
              exit={{ d: "M0 0 L100 0 Q50 100 0 0 Z" }}
              transition={{ duration: 1.1, ease: CURTAIN }}
            />
          </svg>

          <div className="flex items-center justify-between px-5 pt-5 text-xs text-paper/50 md:px-10 md:pt-8">
            <span className="eyebrow">{name}</span>
            <span className="eyebrow hidden sm:block">Loading hope</span>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={index}
                initial={{ y: "100%", opacity: 0, filter: "blur(8px)" }}
                animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                exit={{ y: "-100%", opacity: 0, filter: "blur(8px)" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-end gap-2 px-4 text-center"
              >
                {index === words.length - 1 ? (
                  <span className="serif-accent text-[clamp(4rem,17vw,13rem)] leading-none text-paper">{words[index]}</span>
                ) : (
                  <span className="display text-[clamp(3.5rem,15vw,11rem)]">{words[index]}</span>
                )}
                <motion.span
                  className="mb-[0.18em] inline-block size-3 rounded-full bg-accent md:size-5"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-end justify-between gap-4 px-5 pb-6 md:px-10 md:pb-10">
            <span className="display text-6xl tabular-nums text-paper md:text-8xl">
              {count.toString().padStart(3, "0")}
            </span>
            <span className="max-w-[12rem] text-right text-xs leading-relaxed text-paper/50 md:max-w-none md:text-sm">{intro.tagline}</span>
          </div>
          <div className="h-[3px] w-full bg-paper/10">
            <div className="h-full bg-accent transition-[width] duration-100" style={{ width: `${count}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
