"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Linear map of a scroll MotionValue, computed on the JS side.
 * (framer-motion would otherwise hand plain opacity transforms to a native ViewTimeline,
 *  which mis-maps ranges for sticky targets.)
 */
export function useRange(mv: MotionValue<number>, [a, b]: [number, number], [c, d]: [number, number]) {
  return useTransform(mv, (v) => {
    const t = Math.min(1, Math.max(0, (v - a) / (b - a || 1)));
    return c + (d - c) * t;
  });
}

/** Fade + rise when scrolled into view */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  as?: "div" | "section" | "li" | "article" | "span";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

/** Masked word-by-word slide up. Pass `start` to control trigger manually (e.g. after the intro). */
export function SplitWords({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  start,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  start?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  const go = start === undefined ? inView : start && inView;
  const words = text.split(" ");
  return (
    <span ref={ref} className={cn("inline", className)} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom" aria-hidden>
          <motion.span
            className={cn("inline-block will-change-transform", wordClassName)}
            initial={{ y: "110%", rotate: 4 }}
            animate={go ? { y: "0%", rotate: 0 } : undefined}
            transition={{ duration: 1, ease: EASE, delay: delay + i * stagger }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

/** Words light up one by one as the block scrolls through the viewport */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={cn("flex flex-wrap", className)}>
      {words.map((w, i) => {
        const s = i / words.length;
        return <Word key={i} progress={scrollYProgress} range={[s, s + 1 / words.length]} word={w} />;
      })}
    </p>
  );
}

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useRange(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <span className="relative mr-[0.25em] mt-[0.08em]">
      <motion.span style={{ opacity, y }} className="inline-block">
        {word}
      </motion.span>
    </span>
  );
}

/** Animated number when in view */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  decimals,
  duration = 2.2,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const d = decimals ?? (Number.isInteger(value) ? 0 : 1);
  const [display, setDisplay] = useState((0).toFixed(d));
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: EASE,
      onUpdate: (v) => setDisplay(new Intl.NumberFormat("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d }).format(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration, d]);
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/** Element that gently follows the cursor (Apple-ish magnetic hover) */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Vertical parallax wrapper */
export function Parallax({ children, speed = 0.15, className }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}%`, `${-speed * 100}%`]);
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y }} className="absolute inset-[-15%_0]">
        {children}
      </motion.div>
    </div>
  );
}

/** Progress bar that fills when visible */
export function Progress({ value, className, barClassName }: { value: number; className?: string; barClassName?: string }) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-ink/10", className)}>
      <motion.div
        className={cn("h-full rounded-full", barClassName ?? "bg-accent")}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: EASE, delay: 0.15 }}
      />
    </div>
  );
}

export function useMediaQuery(q: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setMatch(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, [q]);
  return match;
}

/** Highlighter-pen mark: a lime bar wipes in behind the words when they enter the view. */
export function Mark({ children, className, delay = 0.2, start }: { children: ReactNode; className?: string; delay?: number; start?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const go = start === undefined ? inView : start && inView;
  return (
    <span ref={ref} className={cn("relative inline-block px-[0.08em] text-ink", className)}>
      <motion.span
        aria-hidden
        className="absolute inset-x-0 bottom-[0.06em] top-[0.14em] -z-0 origin-left rounded-[0.12em] bg-accent"
        initial={{ scaleX: 0 }}
        animate={go ? { scaleX: 1 } : undefined}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1], delay }}
      />
      <span className="relative">{children}</span>
    </span>
  );
}

/** Label that rolls up to a copy of itself on hover (put inside a `group`). */
export function Roll({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn("relative inline-flex h-[1.25em] overflow-hidden", className)}>
      <span className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-1/2">
        <span className="leading-[1.25]">{children}</span>
        <span className="leading-[1.25]" aria-hidden>{children}</span>
      </span>
    </span>
  );
}

/** Image container whose content is revealed by a clip-path wipe + settle */
export function ImageReveal({ children, className, delay = 0, from = "bottom" }: { children: ReactNode; className?: string; delay?: number; from?: "bottom" | "left" }) {
  const start = from === "bottom" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";
  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      initial={{ clipPath: start }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.25 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.6, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
