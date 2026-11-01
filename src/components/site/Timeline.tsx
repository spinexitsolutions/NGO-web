"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import type { AboutContent } from "@/lib/types";

export default function Timeline({ items }: { items: AboutContent["milestones"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  return (
    <div ref={ref} className="relative">
      <div className="absolute bottom-0 left-[7px] top-2 w-px bg-ink/10 md:left-1/2" />
      <motion.div style={{ scaleY }} className="absolute bottom-0 left-[7px] top-2 w-px origin-top bg-accent md:left-1/2" />
      <ol className="space-y-14 md:space-y-24">
        {items.map((m, i) => (
          <motion.li
            key={m.year + m.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid pl-10 md:grid-cols-2 md:gap-20 md:pl-0"
          >
            <span className="absolute left-0 top-3 size-[15px] rounded-full border-[3px] border-paper bg-accent shadow-[0_0_0_1px_var(--color-accent)] md:left-1/2 md:-translate-x-1/2" />
            <p className={`display text-6xl text-ink/15 md:text-8xl ${i % 2 ? "md:order-2" : "md:text-right"}`}>{m.year}</p>
            <div className={i % 2 ? "md:order-1 md:text-right" : ""}>
              <h3 className="display mt-2 text-3xl md:text-4xl">{m.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-muted">{m.text}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
