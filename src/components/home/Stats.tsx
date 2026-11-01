import type { Stat } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Counter, Reveal } from "@/components/site/motion";

const TILE = [
  "bg-accent text-ink md:col-span-7 md:row-span-2 min-h-[18rem] md:min-h-[26rem]",
  "bg-night text-paper md:col-span-5",
  "bg-card text-ink ring-1 ring-ink/8 md:col-span-5",
  "bg-ink-2 text-paper md:col-span-12",
];

/** Bento of impact numbers — big tile first, the rest stack beside it. */
export default function Stats({ stats }: { stats: Stat[] }) {
  return (
    <section className="container-x pb-24 md:pb-36">
      <div className="grid gap-3 md:grid-cols-12 md:gap-4">
        {stats.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.08} className={cn("flex flex-col justify-between gap-10 overflow-hidden rounded-xl3 p-6 md:p-8", TILE[i % TILE.length])}>
            <div className="flex w-full items-center justify-between">
              <span className="eyebrow opacity-60">({String(i + 1).padStart(2, "0")})</span>
              <span className="eyebrow opacity-60">Impact</span>
            </div>
            <div className={cn(i === 3 && "md:flex md:items-end md:gap-8")}>
              <p className={cn("display", i === 0 ? "text-[clamp(5rem,15vw,12rem)]" : "text-[clamp(3.4rem,7vw,6rem)]")}>
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </p>
              <p className="mt-2 max-w-xs text-[0.95rem] leading-snug opacity-70">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
