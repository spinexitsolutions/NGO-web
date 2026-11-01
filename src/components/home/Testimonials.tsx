"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { Testimonial } from "@/lib/types";
import SmartImage from "@/components/ui/SmartImage";
import SectionHeading from "@/components/site/SectionHeading";

const EASE = [0.65, 0, 0.35, 1] as const;

/** Auto-advancing quote slider: words rise in, the portrait wipes, a progress bar times each slide. */
export default function Testimonials({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = items.length;
  useEffect(() => {
    if (paused || n < 2) return;
    const id = setTimeout(() => setI((x) => (x + 1) % n), 7000);
    return () => clearTimeout(id);
  }, [i, paused, n]);
  if (!n) return null;
  const t = items[i];

  return (
    <section className="container-x py-24 md:py-36" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <SectionHeading index="07" eyebrow="In their words" title="Partners," accent="not beneficiaries." />
      <div className="mt-14 grid gap-3 lg:grid-cols-12">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl3 bg-paper-2 lg:col-span-4">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={t.id} className="absolute inset-0" initial={{ clipPath: "inset(0 0 0 100%)" }} animate={{ clipPath: "inset(0 0 0 0%)" }} exit={{ opacity: 0.4 }} transition={{ duration: 0.9, ease: EASE }}>
              {t.image && <SmartImage src={t.image} alt={t.name} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />}
            </motion.div>
          </AnimatePresence>
          <span className="mono absolute left-3 top-3 rounded bg-paper px-2 py-1 text-xs">{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
        </div>
        <div className="dots-dark flex flex-col justify-between gap-10 rounded-xl3 bg-night p-6 text-paper md:p-12 lg:col-span-8">
          <span className="display text-8xl leading-none text-accent">“</span>
          <AnimatePresence mode="wait">
            <motion.blockquote key={t.id} className="display text-[clamp(1.8rem,3.6vw,3.4rem)] !leading-[1.04]" exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}>
              {t.quote.split(" ").map((w, k) => (
                <span key={k} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                  <motion.span className="inline-block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: k * 0.022 }}>
                    {w}&nbsp;
                  </motion.span>
                </span>
              ))}
            </motion.blockquote>
          </AnimatePresence>
          <div className="flex flex-wrap items-end justify-between gap-6 border-t border-paper/15 pt-5">
            <div>
              <p className="text-lg font-semibold">{t.name}</p>
              <p className="mono text-xs text-paper/55">{t.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Previous" onClick={() => setI((i - 1 + n) % n)} className="grid size-12 place-items-center rounded-xl bg-paper/10 transition-colors hover:bg-accent hover:text-ink"><ArrowLeft className="size-5" /></button>
              <button type="button" aria-label="Next" onClick={() => setI((i + 1) % n)} className="grid size-12 place-items-center rounded-xl bg-accent text-ink transition-transform active:scale-90"><ArrowRight className="size-5" /></button>
            </div>
          </div>
          <div className="flex gap-1.5">
            {items.map((x, k) => (
              <span key={x.id} className="h-1 flex-1 overflow-hidden rounded-full bg-paper/15">
                {k === i && <motion.span key={`${i}-${paused}`} className="block h-full bg-accent" initial={{ width: k === i && paused ? "100%" : 0 }} animate={{ width: "100%" }} transition={{ duration: paused ? 0 : 7, ease: "linear" }} />}
                {k < i && <span className="block h-full w-full bg-paper/50" />}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
