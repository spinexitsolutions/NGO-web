"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Program } from "@/lib/types";
import { compactNum } from "@/lib/format";
import SmartImage from "@/components/ui/SmartImage";
import SectionHeading from "@/components/site/SectionHeading";
import { useMediaQuery } from "@/components/site/motion";

export default function Programs({ programs }: { programs: Program[] }) {
  const desktop = useMediaQuery("(min-width: 1024px)");
  return (
    <section className="relative bg-night text-paper">
      {desktop ? <Horizontal programs={programs} /> : <Swipe programs={programs} />}
    </section>
  );
}

function Header() {
  return (
    <SectionHeading
      dark
      eyebrow="Our programmes"
      title="Six ways we"
      accent="show up."
      text="Each programme is co-designed with the community it serves, and measured every quarter — not by what we spend, but by what changes."
    />
  );
}

function Horizontal({ programs }: { programs: Program[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  useEffect(() => {
    const measure = () => track.current && setDist(track.current.scrollWidth - window.innerWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [programs.length]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} style={{ height: `calc(100vh + ${dist}px)` }} className="relative">
      <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden py-16">
        <div className="container-x mb-12">
          <Header />
        </div>
        <motion.div ref={track} style={{ x }} className="flex w-max gap-6 pl-[max(2.5rem,calc((100vw-88rem)/2+2.5rem))] pr-10">
          {programs.map((p, i) => (
            <Card key={p.id} p={p} i={i} className="w-[30rem]" />
          ))}
          <Link
            href="/programs"
            className="group flex w-[22rem] flex-col justify-between rounded-xl3 border border-paper/15 p-8 transition-colors hover:border-accent"
          >
            <span className="eyebrow text-paper/40">All programmes</span>
            <span className="display text-6xl">
              See the <span className="serif-accent text-accent">full</span> picture
            </span>
            <span className="grid size-14 place-items-center rounded-full bg-accent transition-transform group-hover:rotate-45">
              <ArrowUpRight />
            </span>
          </Link>
        </motion.div>
        <div className="container-x mt-10">
          <div className="h-px w-full bg-paper/10">
            <motion.div style={{ width: bar }} className="h-px bg-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Swipe({ programs }: { programs: Program[] }) {
  return (
    <div className="py-20">
      <div className="container-x mb-10">
        <Header />
      </div>
      <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4" data-lenis-prevent-touch>
        {programs.map((p, i) => (
          <Card key={p.id} p={p} i={i} className="w-[82vw] max-w-sm shrink-0 snap-center" />
        ))}
      </div>
    </div>
  );
}

function Card({ p, i, className }: { p: Program; i: number; className?: string }) {
  return (
    <Link href={`/programs/${p.slug}`} className={`group relative block aspect-[3/4] overflow-hidden rounded-xl3 bg-paper/5 ${className}`}>
      <SmartImage src={p.image} alt={p.title} fill sizes="(min-width:1024px) 480px, 82vw" className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" />
      <div className="absolute inset-0 bg-linear-to-t from-night via-night/30 to-transparent" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
        <span className="rounded-full bg-paper/15 px-3 py-1 text-xs font-medium backdrop-blur-md">{p.category}</span>
        <span className="text-sm tabular-nums text-paper/70">{String(i + 1).padStart(2, "0")}</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <div className="mb-4 h-1 w-10 rounded-full transition-all duration-500 group-hover:w-20" style={{ background: p.color }} />
        <h3 className="display text-5xl md:text-6xl">{p.title}</h3>
        <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-paper/75">{p.summary}</p>
        <div className="mt-6 flex items-center justify-between border-t border-paper/15 pt-4 text-sm">
          <span>
            <b className="font-semibold">{compactNum(p.beneficiaries)}</b> <span className="text-paper/60">people reached</span>
          </span>
          <span className="grid size-10 place-items-center rounded-full bg-paper text-ink transition-all duration-500 group-hover:rotate-45 group-hover:bg-accent group-hover:text-white">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
