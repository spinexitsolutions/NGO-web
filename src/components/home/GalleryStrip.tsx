"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import type { GalleryItem } from "@/lib/types";
import SmartImage from "@/components/ui/SmartImage";
import { SplitWords } from "@/components/site/motion";

export default function GalleryStrip({ items }: { items: GalleryItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["-18%", "6%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["4%", "-30%"]);
  const cols = [0, 1, 2].map((c) => items.filter((_, i) => i % 3 === c).slice(0, 4));
  const ys = [y1, y2, y3];
  if (items.length < 3) return null;

  return (
    <section ref={ref} className="relative h-[110vh] overflow-hidden bg-night md:h-[140vh]">
      <div className="absolute inset-0 grid grid-cols-2 gap-3 px-3 md:grid-cols-3 md:gap-5 md:px-5">
        {cols.map((col, c) => (
          <motion.div key={c} style={{ y: ys[c] }} className={`flex flex-col gap-3 md:gap-5 ${c === 2 ? "hidden md:flex" : ""}`}>
            {[...col, ...col].map((g, i) => (
              <div key={`${g.id}-${i}`} className="relative aspect-[3/4] overflow-hidden rounded-2xl md:rounded-3xl">
                <SmartImage src={g.src} alt={g.caption} fill sizes="(min-width:768px) 33vw, 50vw" className="object-cover" />
              </div>
            ))}
          </motion.div>
        ))}
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-night via-night/40 to-night" />
      <div className="relative flex h-full flex-col items-center justify-center px-5 text-center text-paper">
        <p className="eyebrow mb-6 text-paper/60">Gallery</p>
        <h2 className="display max-w-4xl text-[clamp(2.8rem,9vw,8rem)]">
          <SplitWords text="Moments that" /> <SplitWords text="made us." wordClassName="serif-accent text-accent" delay={0.15} />
        </h2>
        <Link href="/gallery" className="mt-10 rounded-full bg-paper px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-105">
          Open the gallery
        </Link>
      </div>
    </section>
  );
}
