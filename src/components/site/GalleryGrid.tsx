"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { GalleryItem } from "@/lib/types";
import SmartImage from "@/components/ui/SmartImage";
import { Chip } from "./Field";
import { useSite } from "./SiteShell";

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const cats = ["All", ...Array.from(new Set(items.map((g) => g.category)))];
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const { lock } = useSite();
  const list = cat === "All" ? items : items.filter((g) => g.category === cat);

  const move = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + list.length) % list.length)), [list.length]);

  useEffect(() => {
    lock(open !== null);
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lock, move]);

  return (
    <section className="container-x py-16 md:py-24">
      <div className="no-scrollbar -mx-5 mb-10 flex gap-2 overflow-x-auto px-5">
        {cats.map((c) => (
          <Chip key={c} active={c === cat} onClick={() => setCat(c)}>{c}</Chip>
        ))}
      </div>
      <motion.div layout className="columns-2 gap-3 md:columns-3 md:gap-5 lg:columns-4">
        <AnimatePresence>
          {list.map((g, i) => (
            <motion.button
              layout
              key={g.id}
              type="button"
              onClick={() => setOpen(i)}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative mb-3 block w-full overflow-hidden rounded-2xl md:mb-5 md:rounded-3xl"
            >
              <div className={`relative w-full ${["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/2]"][i % 4]}`}>
                <SmartImage src={g.src} alt={g.caption} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-linear-to-t from-night/80 to-transparent p-4 pt-10 text-left text-sm text-paper opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {g.caption}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {open !== null && list[open] && (
          <motion.div
            className="fixed inset-0 z-[80] flex flex-col bg-night/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <div className="flex items-center justify-between p-4 text-paper md:p-6">
              <span className="text-sm tabular-nums text-paper/60">{open + 1} / {list.length}</span>
              <button type="button" aria-label="Close" className="grid size-11 place-items-center rounded-full bg-paper/10" onClick={() => setOpen(null)}><X className="size-5" /></button>
            </div>
            <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={list[open].id} className="absolute inset-4 md:inset-x-24" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.4 }}>
                  <SmartImage src={list[open].src} alt={list[open].caption} fill sizes="100vw" className="object-contain" />
                </motion.div>
              </AnimatePresence>
              <button type="button" aria-label="Previous" onClick={() => move(-1)} className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-paper/10 text-paper backdrop-blur md:left-6"><ChevronLeft /></button>
              <button type="button" aria-label="Next" onClick={() => move(1)} className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-paper/10 text-paper backdrop-blur md:right-6"><ChevronRight /></button>
            </div>
            <p className="p-6 text-center text-paper/80">{list[open].caption} <span className="text-paper/40">· {list[open].category}</span></p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
