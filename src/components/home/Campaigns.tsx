"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Campaign } from "@/lib/types";
import Button from "@/components/ui/Button";
import CampaignCard from "@/components/site/CampaignCard";
import SectionHeading from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/motion";

/** Featured campaign + a draggable rail of the rest. */
export default function Campaigns({ campaigns }: { campaigns: Campaign[] }) {
  const active = campaigns.filter((c) => c.status === "active").sort((a, b) => Number(b.urgent) - Number(a.urgent));
  const [first, ...rest] = active;
  const rail = [...rest, ...campaigns.filter((c) => c.status === "completed")];
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [limit, setLimit] = useState(0);
  useEffect(() => {
    const m = () => wrap.current && track.current && setLimit(Math.max(0, track.current.scrollWidth - wrap.current.offsetWidth));
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, [rail.length]);
  if (!first) return null;

  return (
    <section className="container-x py-24 md:py-36">
      <SectionHeading index="04" eyebrow="Live campaigns" title="Where help is" accent="needed now.">
        <Button href="/campaigns" variant="ghost">All campaigns</Button>
      </SectionHeading>
      <Reveal className="mt-14">
        <CampaignCard c={first} large />
      </Reveal>
      {rail.length > 0 && (
        <div ref={wrap} className="mt-4 overflow-hidden md:-mr-8" data-cursor="Drag">
          <motion.div
            ref={track}
            drag="x"
            dragConstraints={{ left: -limit, right: 0 }}
            dragElastic={0.08}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
            className="flex w-max cursor-grab gap-4 active:cursor-grabbing"
          >
            {rail.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                className="w-[85vw] max-w-[25rem] shrink-0"
              >
                <CampaignCard c={c} />
              </motion.div>
            ))}
          </motion.div>
          <p className="mono mt-4 text-xs text-muted">← Drag to explore →</p>
        </div>
      )}
    </section>
  );
}
