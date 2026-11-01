"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Program } from "@/lib/types";
import { compactNum } from "@/lib/format";
import { cn } from "@/lib/cn";
import SmartImage from "@/components/ui/SmartImage";
import SectionHeading from "@/components/site/SectionHeading";

const EASE = [0.65, 0, 0.35, 1] as const;

/**
 * Programmes as an accordion of photo panels. Desktop: panels sit side by side
 * and the active one expands horizontally. Mobile: they stack and expand vertically.
 */
export default function Programs({ programs }: { programs: Program[] }) {
  const [active, setActive] = useState(0);
  return (
    <section className="dots-dark relative bg-night py-24 text-paper md:py-32">
      <div className="container-x">
        <SectionHeading
          dark
          index="03"
          eyebrow="Our programmes"
          title="Six ways we"
          accent="show up."
          text="Each programme is co-designed with the community it serves, and measured every quarter — not by what we spend, but by what changes."
        />

        {/* desktop: horizontal accordion */}
        <div className="mt-14 hidden h-[34rem] gap-2 lg:flex xl:h-[38rem]">
          {programs.map((p, i) => {
            const on = i === active;
            return (
              <motion.div
                key={p.id}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                animate={{ flexGrow: on ? 5 : 1 }}
                transition={{ duration: 0.8, ease: EASE }}
                className="relative min-w-0 basis-0 overflow-hidden rounded-xl3"
                data-cursor={on ? "Open" : undefined}
              >
                <Link href={`/programs/${p.slug}`} className="absolute inset-0">
                  <motion.div className="absolute inset-0" animate={{ scale: on ? 1 : 1.3 }} transition={{ duration: 1.2, ease: EASE }}>
                    <SmartImage src={p.image} alt={p.title} fill sizes="60vw" className="object-cover" />
                  </motion.div>
                  <motion.div className="absolute inset-0 bg-night" animate={{ opacity: on ? 0.25 : 0.62 }} transition={{ duration: 0.6 }} />
                  <div className="absolute inset-0 bg-linear-to-t from-night/90 via-transparent to-transparent" />

                  {/* collapsed label */}
                  <motion.div animate={{ opacity: on ? 0 : 1 }} transition={{ duration: 0.3 }} className="absolute inset-0 flex flex-col items-center justify-between py-6">
                    <span className="mono text-xs text-paper/60">0{i + 1}</span>
                    <span className="display whitespace-nowrap text-3xl [writing-mode:vertical-rl] rotate-180">{p.title}</span>
                  </motion.div>

                  {/* expanded content */}
                  <AnimatePresence>
                    {on && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 } }}
                        exit={{ opacity: 0, transition: { duration: 0.15 } }}
                        className="absolute inset-0 flex flex-col justify-between p-7"
                      >
                        <div className="flex items-start justify-between">
                          <span className="eyebrow rounded bg-accent px-2 py-1 text-ink">{p.category}</span>
                          <span className="mono text-sm text-paper/70">0{i + 1} / 0{programs.length}</span>
                        </div>
                        <div className="max-w-xl">
                          <h3 className="display text-7xl">{p.title}</h3>
                          <p className="mt-4 text-[1.02rem] leading-relaxed text-paper/80">{p.summary}</p>
                          <div className="mt-6 flex items-center gap-8 border-t border-paper/20 pt-5">
                            <span>
                              <span className="display block text-3xl">{compactNum(p.beneficiaries)}</span>
                              <span className="eyebrow text-paper/60">People reached</span>
                            </span>
                            <span>
                              <span className="display block text-3xl">{p.locations}</span>
                              <span className="eyebrow text-paper/60">Locations</span>
                            </span>
                            <span className="ml-auto grid size-14 place-items-center rounded-xl2 bg-accent text-ink">
                              <ArrowUpRight />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* mobile: vertical accordion */}
        <div className="mt-10 space-y-2 lg:hidden">
          {programs.map((p, i) => {
            const on = i === active;
            return (
              <div key={p.id} className="overflow-hidden rounded-xl3 bg-paper/[0.05] ring-1 ring-paper/10">
                <button type="button" onClick={() => setActive(on ? -1 : i)} className="flex w-full items-center gap-4 p-4 text-left" aria-expanded={on}>
                  <span className="mono text-xs text-paper/50">0{i + 1}</span>
                  <span className="display flex-1 text-3xl">{p.title}</span>
                  <motion.span animate={{ rotate: on ? 45 : 0 }} className={cn("grid size-9 place-items-center rounded-lg", on ? "bg-accent text-ink" : "bg-paper/10")}>
                    <Plus className="size-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.55, ease: EASE }} className="overflow-hidden">
                      <Link href={`/programs/${p.slug}`} className="block px-3 pb-3">
                        <span className="relative block aspect-[16/10] overflow-hidden rounded-xl2">
                          <SmartImage src={p.image} alt={p.title} fill sizes="100vw" className="object-cover" />
                        </span>
                        <span className="block px-1 pt-4 text-paper/75">{p.summary}</span>
                        <span className="flex items-center justify-between px-1 pt-4">
                          <span className="mono text-sm">{compactNum(p.beneficiaries)} reached</span>
                          <span className="flex items-center gap-1 text-sm font-semibold text-accent">
                            Explore <ArrowUpRight className="size-4" />
                          </span>
                        </span>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
