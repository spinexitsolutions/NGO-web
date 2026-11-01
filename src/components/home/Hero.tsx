"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { HeroContent, Stat } from "@/lib/types";
import SmartImage from "@/components/ui/SmartImage";
import Button from "@/components/ui/Button";
import { useSite } from "@/components/site/SiteShell";
import { Counter, EASE, SplitWords, useRange } from "@/components/site/motion";

export default function Hero({ hero, stat, donors }: { hero: HeroContent; stat?: Stat; donors: number }) {
  const { introDone } = useSite();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: top } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const floatY1 = useTransform(top, [0, 1], [0, -160]);
  const floatY2 = useTransform(top, [0, 1], [0, -260]);

  const show = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: introDone ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE, delay },
  });

  return (
    <section className="relative">
      <div ref={ref} className="container-x relative pb-10 pt-32 md:pb-16 md:pt-44">
        {/* floating photos (desktop) */}
        {hero.sideImages[0] && (
          <motion.div style={{ y: floatY1 }} className="absolute right-[6%] top-36 hidden w-40 lg:block xl:w-48">
            <motion.div {...show(0.9)} className="relative aspect-[3/4] rotate-[6deg] overflow-hidden rounded-[1.4rem] shadow-2xl shadow-ink/20">
              <SmartImage src={hero.sideImages[0]} alt="" fill sizes="200px" className="object-cover" />
            </motion.div>
          </motion.div>
        )}
        {hero.sideImages[1] && (
          <motion.div style={{ y: floatY2 }} className="absolute right-[24%] top-[26rem] hidden w-28 lg:block xl:w-32">
            <motion.div {...show(1.05)} className="relative aspect-square -rotate-[8deg] overflow-hidden rounded-full shadow-2xl shadow-ink/20 ring-4 ring-paper">
              <SmartImage src={hero.sideImages[1]} alt="" fill sizes="140px" className="object-cover" />
            </motion.div>
          </motion.div>
        )}

        <motion.p {...show(0.1)} className="mb-7 inline-flex items-center gap-2 rounded-full bg-white/70 py-1.5 pl-1.5 pr-4 text-[0.8rem] font-medium shadow-sm ring-1 ring-ink/5 backdrop-blur">
          <span className="rounded-full bg-ink px-2.5 py-1 text-[0.7rem] font-semibold text-paper">New</span>
          {hero.eyebrow}
        </motion.p>

        <h1 className="display text-[clamp(3.4rem,13vw,11.5rem)]">
          <span className="block">
            <SplitWords text={hero.titleLine1} start={introDone} delay={0.15} />
          </span>
          <span className="flex flex-wrap items-center gap-x-[0.18em]">
            <SplitWords text={hero.titleAccent} start={introDone} delay={0.3} wordClassName="serif-accent text-accent pr-[0.05em]" />
            {hero.sideImages[2] && (
              <motion.span
                initial={{ width: 0, opacity: 0 }}
                animate={introDone ? { width: "1.55em", opacity: 1 } : undefined}
                transition={{ duration: 1.1, ease: EASE, delay: 0.55 }}
                className="relative inline-block h-[0.72em] overflow-hidden rounded-full align-middle"
              >
                <SmartImage src={hero.sideImages[2]} alt="" fill sizes="240px" className="object-cover" />
              </motion.span>
            )}
          </span>
          <span className="block">
            <SplitWords text={hero.titleLine2} start={introDone} delay={0.45} />
          </span>
        </h1>

        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[1fr_auto] md:items-end">
          <motion.p {...show(0.6)} className="max-w-xl text-lg leading-relaxed text-muted md:text-xl">
            {hero.subtitle}
          </motion.p>
          <motion.div {...show(0.75)} className="flex flex-col gap-5 md:items-end">
            <div className="flex flex-wrap gap-3">
              <Button href="/donate">{hero.ctaPrimary}</Button>
              <Button href="/programs" variant="ghost">
                {hero.ctaSecondary}
              </Button>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted">
              <div className="flex -space-x-2.5">
                {["1438761681033-6461ffad8d80", "1500648767791-00dcc994a43e", "1494790108377-be9c29b29330", "1506794778202-cad84cf45f1d"].map((id) => (
                  <span key={id} className="relative size-8 overflow-hidden rounded-full ring-2 ring-paper">
                    <SmartImage src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=96&q=70`} alt="" fill sizes="32px" className="object-cover" />
                  </span>
                ))}
              </div>
              <span>
                Joined by <b className="font-semibold text-ink">{new Intl.NumberFormat("en-IN").format(donors)}+</b> donors this year
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <ExpandingImage src={hero.image} stat={stat} />
    </section>
  );
}

function ExpandingImage({ src, stat }: { src: string; stat?: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const inset = useTransform(scrollYProgress, [0.15, 0.75], [12, 0]);
  const insetY = useTransform(scrollYProgress, [0.15, 0.75], [6, 0]);
  const radius = useTransform(scrollYProgress, [0.15, 0.75], [36, 0]);
  const clipPath = useTransform([insetY, inset, radius], ([y, x, r]) => `inset(${y}% ${x}% ${y}% ${x}% round ${r}px)`);
  const scale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);
  const textOpacity = useRange(scrollYProgress, [0.65, 0.9], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.65, 0.95], [60, 0]);

  return (
    <div ref={ref} className="relative h-[190vh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <motion.div style={{ clipPath }} className="absolute inset-0 will-change-[clip-path]">
          <motion.div style={{ scale }} className="absolute inset-0">
            <SmartImage src={src} alt="Children smiling at an Ummeed learning centre" fill priority sizes="100vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-linear-to-t from-night/80 via-night/10 to-transparent" />
          <motion.div style={{ opacity: textOpacity, y: textY }} className="container-x absolute inset-x-0 bottom-0 pb-12 text-paper md:pb-16">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <p className="display max-w-3xl text-[clamp(2.4rem,7vw,6rem)]">
                Small acts. <span className="serif-accent text-accent">Repeated</span> until they change everything.
              </p>
              {stat && (
                <div className="shrink-0 md:text-right">
                  <p className="display text-6xl md:text-8xl">
                    <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-sm text-paper/70">{stat.label}</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
