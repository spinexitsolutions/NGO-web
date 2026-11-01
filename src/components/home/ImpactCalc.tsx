"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Droplets, HeartPulse, Sprout, Utensils } from "lucide-react";
import { useState } from "react";
import type { Allocation } from "@/lib/types";
import { inr, num } from "@/lib/format";
import { cn } from "@/lib/cn";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/motion";

const PRESETS = [500, 1000, 2500, 5000, 10000];
const UNITS = [
  { icon: Utensils, label: "hot meals served", per: 40 },
  { icon: BookOpen, label: "children get a learning kit", per: 350 },
  { icon: HeartPulse, label: "health check-ups", per: 150 },
  { icon: Sprout, label: "native saplings planted & cared for", per: 60 },
  { icon: Droplets, label: "people get safe water for a year", per: 125 },
];
const SHADES = ["bg-accent", "bg-ink", "bg-[#8a8780]", "bg-[#b9b5ab]", "bg-[#d6d1c4]", "bg-[#e6e1d6]"];

export default function ImpactCalc({ allocation }: { allocation: Allocation[] }) {
  const [amount, setAmount] = useState(2500);
  const [unit, setUnit] = useState(0);
  const u = UNITS[unit];
  const count = Math.floor(amount / u.per);

  return (
    <section className="container-x py-24 md:py-36">
      <SectionHeading eyebrow="Your impact" title="What your gift" accent="becomes." text="Slide, tap, imagine. Every number below is based on our actual field costs from last year." />

      <Reveal className="mt-14 grid overflow-hidden rounded-xl3 bg-card ring-1 ring-ink/5 lg:grid-cols-2">
        <div className="p-6 md:p-10">
          <p className="eyebrow text-muted">If you give</p>
          <p className="display mt-3 text-[clamp(3.5rem,9vw,6.5rem)] tabular-nums">{inr(amount)}</p>
          <input
            type="range"
            min={100}
            max={25000}
            step={100}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            aria-label="Donation amount"
            className="mt-6 w-full accent-[var(--color-accent)]"
          />
          <div className="mt-6 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAmount(p)}
                className={cn("rounded-full px-4 py-2 text-sm font-medium ring-1 transition-colors", amount === p ? "bg-ink text-paper ring-ink" : "ring-ink/15 hover:ring-ink")}
              >
                {inr(p)}
              </button>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            {UNITS.map((x, i) => (
              <button
                key={x.label}
                type="button"
                onClick={() => setUnit(i)}
                aria-label={x.label}
                className={cn("grid size-12 place-items-center rounded-2xl transition-all", unit === i ? "bg-accent text-white" : "bg-paper text-ink/60 hover:text-ink")}
              >
                <x.icon className="size-5" />
              </button>
            ))}
          </div>
        </div>
        <div className="relative flex min-h-[20rem] flex-col justify-between overflow-hidden bg-night p-6 text-paper md:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-accent/30 blur-3xl" />
          <p className="eyebrow relative text-paper/50">That means</p>
          <div className="relative">
            <AnimatePresence mode="popLayout">
              <motion.p
                key={`${unit}-${count}`}
                initial={{ y: 40, opacity: 0, filter: "blur(6px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -40, opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="display text-[clamp(4.5rem,13vw,9rem)] tabular-nums"
              >
                {num(count)}
              </motion.p>
            </AnimatePresence>
            <p className="serif-accent mt-2 text-3xl text-paper/90 md:text-4xl">{u.label}</p>
          </div>
          <div className="relative mt-8">
            <Button href={`/donate?amount=${amount}`} variant="light">Give {inr(amount)}</Button>
          </div>
        </div>
      </Reveal>

      {allocation.length > 0 && (
        <Reveal className="mt-10">
          <p className="mb-4 text-sm text-muted">Where every ₹100 goes</p>
          <div className="flex h-14 w-full gap-1 overflow-hidden rounded-2xl">
            {allocation.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ flexGrow: 0.001 }}
                whileInView={{ flexGrow: a.value }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                className={cn("flex basis-0 items-center overflow-hidden px-3 text-xs font-semibold", SHADES[i % SHADES.length], i < 2 ? "text-white" : "text-ink")}
                title={`${a.label}: ${a.value}%`}
              >
                <span className="truncate">₹{a.value}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {allocation.map((a, i) => (
              <span key={a.id} className="flex items-center gap-2 text-muted">
                <span className={cn("size-2.5 rounded-full", SHADES[i % SHADES.length])} />
                {a.label} <b className="font-semibold text-ink">{a.value}%</b>
              </span>
            ))}
          </div>
        </Reveal>
      )}
    </section>
  );
}
