"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { EventItem } from "@/lib/types";
import SmartImage from "@/components/ui/SmartImage";

/** Editorial event rows; on desktop a photo follows the cursor. */
export default function EventList({ events }: { events: EventItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 28 });
  const sy = useSpring(y, { stiffness: 250, damping: 28 });

  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onMouseLeave={() => setActive(null)}
    >
      <ul className="border-t border-ink/15">
        {events.map((ev, i) => {
          const d = new Date(ev.date);
          return (
            <motion.li
              key={ev.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
              className="border-b border-ink/15"
              onMouseEnter={() => setActive(i)}
            >
              <Link href={`/events/${ev.slug}`} data-cursor="Join" className="group grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 py-6 md:grid-cols-[7rem_1fr_16rem_auto] md:gap-8 md:py-8">
                <div className="leading-none">
                  <p className="display text-5xl md:text-6xl">{d.getDate().toString().padStart(2, "0")}</p>
                  <p className="mono mt-2 text-xs uppercase text-muted">{d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" })}</p>
                </div>
                <div className="min-w-0">
                  <h3 className="display text-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 md:text-4xl">{ev.title}</h3>
                  <p className="mt-2 line-clamp-1 text-sm text-muted md:hidden">
                    <MapPin className="mr-1 inline size-3.5" />
                    {ev.location}
                  </p>
                </div>
                <p className="hidden text-sm text-muted md:block">
                  <MapPin className="mr-1.5 inline size-4" />
                  {ev.location}
                  <span className="mt-1 block pl-5">{ev.time}</span>
                </p>
                <span className="grid size-11 place-items-center rounded-xl ring-1 ring-ink/15 transition-all duration-500 group-hover:bg-accent group-hover:text-ink group-hover:ring-accent md:size-14">
                  <ArrowUpRight className="size-5" />
                </span>
              </Link>
            </motion.li>
          );
        })}
      </ul>

      <AnimatePresence>
        {active !== null && events[active] && (
          <motion.div
            key="cursor-img"
            className="pointer-events-none fixed left-0 top-0 z-40 hidden h-56 w-44 overflow-hidden rounded-2xl shadow-2xl lg:block"
            style={{ x: sx, y: sy, translateX: "-50%", translateY: "-60%" }}
            initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence mode="popLayout">
              <motion.div key={active} className="absolute inset-0" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <SmartImage src={events[active].image} alt="" fill sizes="180px" className="object-cover" />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
