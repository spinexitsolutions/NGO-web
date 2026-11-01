"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Campaign, HeroContent, Stat } from "@/lib/types";
import { compactInr, pct } from "@/lib/format";
import SmartImage from "@/components/ui/SmartImage";
import Button from "@/components/ui/Button";
import { useSite } from "@/components/site/SiteShell";
import { Counter, EASE, Mark, SplitWords, useRange } from "@/components/site/motion";

function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }));
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{t || "--:--:--"}</span>;
}

export default function Hero({ hero, stat, campaign, donors }: { hero: HeroContent; stat?: Stat; campaign?: Campaign; donors: number }) {
  const { introDone } = useSite();
  const show = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: introDone ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE, delay },
  });

  return (
    <section
      className="relative bg-night text-paper"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {/* dot field + cursor spotlight that tints the dots lime */}
      <div className="dots-dark pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          backgroundImage: "radial-gradient(var(--color-accent) 1.2px, transparent 1.2px)",
          backgroundSize: "22px 22px",
          WebkitMaskImage: "radial-gradient(260px circle at var(--mx, -999px) var(--my, -999px), black, transparent 70%)",
          maskImage: "radial-gradient(260px circle at var(--mx, -999px) var(--my, -999px), black, transparent 70%)",
        }}
      />
      <div className="container-x relative pb-14 pt-28 md:pb-20 md:pt-32">
        {/* meta row */}
        <motion.div {...show(0.05)} className="grid grid-cols-2 gap-y-2 border-t border-paper/15 pt-3 text-paper/55 md:grid-cols-12">
          <span className="eyebrow md:col-span-3">(01) {hero.eyebrow.split("·")[0]}</span>
          <span className="eyebrow text-right md:col-span-3 md:text-left">Est. 2011 — 14 states</span>
          <span className="eyebrow hidden md:col-span-3 md:block">
            Mumbai, IN — <Clock /> IST
          </span>
          <span className="eyebrow hidden items-center justify-end gap-1.5 md:col-span-3 md:flex">
            Scroll <ArrowDown className="size-3 animate-bounce" />
          </span>
        </motion.div>

        <h1 className="display mt-10 text-[clamp(3.3rem,12.4vw,12.5rem)] !leading-[0.88] md:mt-14">
          <span className="block">
            <SplitWords text={hero.titleLine1} start={introDone} delay={0.15} />
          </span>
          <span className="flex flex-wrap items-center gap-x-[0.2em]">
            <Mark start={introDone} delay={0.85}>
              <SplitWords text={hero.titleAccent} start={introDone} delay={0.28} />
            </Mark>
            {hero.sideImages[0] && (
              <motion.span
                initial={{ width: 0, opacity: 0 }}
                animate={introDone ? { width: "1.9em", opacity: 1 } : undefined}
                transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
                className="relative inline-block h-[0.78em] overflow-hidden rounded-[0.16em] align-middle"
              >
                <SmartImage src={hero.sideImages[0]} alt="" fill sizes="320px" className="object-cover" />
              </motion.span>
            )}
          </span>
          <span className="block">
            <SplitWords text={hero.titleLine2} start={introDone} delay={0.42} />
          </span>
        </h1>

        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-12 md:items-end">
          <motion.p {...show(0.6)} className="max-w-md text-[1.05rem] leading-relaxed text-paper/70 md:col-span-5 md:text-lg">
            {hero.subtitle}
          </motion.p>
          <motion.div {...show(0.72)} className="flex flex-col gap-3 sm:flex-row md:col-span-3 md:flex-col">
            <Button href="/donate">{hero.ctaPrimary}</Button>
            <Button href="/programs" variant="outline-light">{hero.ctaSecondary}</Button>
          </motion.div>
          {campaign && (
            <motion.div {...show(0.85)} className="md:col-span-4">
              <Link href={`/campaigns/${campaign.slug}`} data-cursor="View" className="group flex gap-4 rounded-xl3 bg-paper/[0.06] p-3 ring-1 ring-paper/10 backdrop-blur transition-colors hover:bg-paper/10">
                <span className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl2">
                  <SmartImage src={campaign.image} alt="" fill sizes="96px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col justify-between py-1">
                  <span className="eyebrow flex items-center gap-1.5 text-accent">
                    <span className="size-1.5 animate-pulse rounded-full bg-accent" /> Live now
                  </span>
                  <span className="truncate font-semibold">{campaign.title}</span>
                  <span>
                    <span className="mb-1.5 flex justify-between text-xs text-paper/60">
                      <span>{compactInr(campaign.raised)} raised</span>
                      <span className="mono">{pct(campaign.raised, campaign.goal)}%</span>
                    </span>
                    <span className="block h-1.5 overflow-hidden rounded-full bg-paper/10">
                      <motion.span
                        className="block h-full rounded-full bg-accent"
                        initial={{ width: 0 }}
                        animate={introDone ? { width: `${pct(campaign.raised, campaign.goal)}%` } : undefined}
                        transition={{ duration: 1.6, ease: EASE, delay: 1.1 }}
                      />
                    </span>
                  </span>
                </span>
              </Link>
              <p className="mono mt-3 text-[0.7rem] text-paper/45">+ {new Intl.NumberFormat("en-IN").format(donors)} donors gave this year</p>
            </motion.div>
          )}
        </div>
      </div>

      <Strips src={hero.image} stat={stat} />
    </section>
  );
}

const OFFSETS = [22, -14, 30, -8, 16];

/** One photo cut into five strips that drift apart, then lock together as you scroll. */
function Strips({ src, stat }: { src: string; stat?: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const gap = useRange(scrollYProgress, [0.2, 0.62], [10, 0]);
  const pad = useRange(scrollYProgress, [0.2, 0.62], [4, 0]);
  const radius = useRange(scrollYProgress, [0.2, 0.62], [18, 0]);
  const scale = useRange(scrollYProgress, [0, 1], [1.25, 1]);
  const textOpacity = useRange(scrollYProgress, [0.66, 0.88], [0, 1]);
  const textY = useRange(scrollYProgress, [0.66, 0.92], [50, 0]);
  const padding = useTransform(pad, (v) => `${v}vw`);

  return (
    <div ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <motion.div style={{ padding, gap }} className="absolute inset-0 flex">
          {OFFSETS.map((o, i) => (
            <Strip key={i} i={i} offset={o} progress={scrollYProgress} radius={radius} scale={scale} src={src} />
          ))}
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-night via-night/10 to-transparent" />
        <motion.div style={{ opacity: textOpacity, y: textY }} className="container-x absolute inset-x-0 bottom-0 pb-24 text-paper md:pb-14">
          <div className="grid gap-6 border-t border-paper/20 pt-5 md:grid-cols-12 md:items-end">
            <p className="display text-[clamp(2.4rem,6.5vw,5.6rem)] md:col-span-8">
              Small acts, <span className="text-accent">repeated</span> until they change everything.
            </p>
            {stat && (
              <div className="md:col-span-4 md:text-right">
                <p className="display text-6xl text-accent md:text-8xl">
                  <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </p>
                <p className="eyebrow mt-2 text-paper/60">{stat.label}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Strip({
  i,
  offset,
  progress,
  radius,
  scale,
  src,
}: {
  i: number;
  offset: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  radius: ReturnType<typeof useRange>;
  scale: ReturnType<typeof useRange>;
  src: string;
}) {
  const y = useRange(progress, [0.05, 0.62], [offset, 0]);
  const ty = useTransform(y, (v) => `${v}%`);
  return (
    <motion.div style={{ y: ty, borderRadius: radius }} className="relative h-full flex-1 overflow-hidden">
      <motion.div style={{ scale }} className="absolute inset-0">
        <div className="absolute inset-y-0" style={{ width: `${OFFSETS.length * 100}%`, left: `-${i * 100}%` }}>
          <SmartImage src={src} alt={i === 0 ? "Children at an Ummeed learning centre" : ""} fill sizes="100vw" className="object-cover" priority={i === 0} />
        </div>
      </motion.div>
    </motion.div>
  );
}
