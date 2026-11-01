"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { FAQ } from "@/lib/types";

export default function Faq({ items }: { items: FAQ[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  return (
    <ul className="border-t border-line">
      {items.map((f) => {
        const isOpen = open === f.id;
        return (
          <li key={f.id} className="border-b border-line">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : f.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="text-lg font-semibold tracking-[-0.02em] md:text-2xl">{f.question}</span>
              <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className={`grid size-10 shrink-0 place-items-center rounded-full transition-colors ${isOpen ? "bg-accent text-white" : "bg-ink/5"}`}>
                <Plus className="size-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pb-7 leading-relaxed text-muted md:text-lg">{f.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
