import type { Stat } from "@/lib/types";
import { Counter, Reveal } from "@/components/site/motion";

export default function Stats({ stats }: { stats: Stat[] }) {
  return (
    <section className="container-x pb-24 md:pb-36">
      <div className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.id}
            delay={i * 0.08}
            className="flex flex-col justify-between gap-10 border-b border-line py-8 pr-4 odd:border-r lg:border-b-0 lg:border-r lg:px-6 lg:py-10 lg:first:pl-0 lg:last:border-r-0 max-lg:[&:nth-child(even)]:pl-5"
          >
            <span className="text-xs tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <p className="display text-[clamp(2.8rem,6vw,5.5rem)]">
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </p>
              <p className="mt-3 max-w-[14rem] text-sm leading-snug text-muted md:text-base">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
