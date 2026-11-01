import { ArrowUpRight, Clock, Users } from "lucide-react";
import Link from "next/link";
import type { Campaign } from "@/lib/types";
import { compactInr, daysLeft, num, pct } from "@/lib/format";
import { cn } from "@/lib/cn";
import SmartImage from "@/components/ui/SmartImage";
import { Progress } from "./motion";

function Ring({ value }: { value: number }) {
  return (
    <span className="relative grid size-16 place-items-center rounded-full bg-night/70 text-paper backdrop-blur-md">
      <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90">
        <circle cx="32" cy="32" r="27" fill="none" strokeWidth="5" className="stroke-paper/15" />
        <circle cx="32" cy="32" r="27" fill="none" strokeWidth="5" strokeLinecap="round" className="stroke-accent" pathLength={100} strokeDasharray={`${value} 100`} />
      </svg>
      <span className="mono relative text-sm font-semibold">{value}%</span>
    </span>
  );
}

export default function CampaignCard({ c, large }: { c: Campaign; large?: boolean }) {
  const p = pct(c.raised, c.goal);
  const done = c.status === "completed" || p >= 100;
  return (
    <article className={cn("group flex h-full flex-col overflow-hidden rounded-xl3 bg-card ring-1 ring-ink/8 transition-[box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.35)]", large && "lg:flex-row")}>
      <Link href={`/campaigns/${c.slug}`} data-cursor="View" className={cn("relative m-2 block aspect-[16/11] overflow-hidden rounded-xl2", large && "lg:m-2 lg:aspect-auto lg:w-[55%]")}>
        <SmartImage src={c.image} alt={c.title} fill sizes={large ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 33vw, 100vw"} className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex gap-2">
          {c.urgent && !done && (
            <span className="eyebrow flex items-center gap-1.5 rounded bg-accent px-2 py-1 text-ink">
              <span className="size-1.5 animate-pulse rounded-full bg-ink" /> Urgent
            </span>
          )}
          {done && <span className="eyebrow rounded bg-ink px-2 py-1 text-accent">Funded ✓</span>}
        </div>
        <span className="absolute bottom-3 right-3"><Ring value={p} /></span>
      </Link>
      <div className={cn("flex flex-1 flex-col px-5 pb-5 pt-3 md:px-6 md:pb-6", large && "lg:justify-between lg:p-10")}>
        <div>
          <h3 className={cn("display text-[1.9rem] !leading-[1]", large && "lg:text-6xl")}>
            <Link href={`/campaigns/${c.slug}`} className="transition-colors hover:text-accent-ink">{c.title}</Link>
          </h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{c.summary}</p>
        </div>
        <div className="mt-7">
          <div className="mb-3 flex items-end justify-between">
            <p>
              <span className="display text-3xl">{compactInr(c.raised)}</span>
              <span className="mono ml-1.5 text-xs text-muted">/ {compactInr(c.goal)}</span>
            </p>
          </div>
          <Progress value={p} barClassName="bg-ink" />
          <div className="mt-4 flex items-center justify-between gap-2 text-sm text-muted">
            <span className="mono flex items-center gap-1.5 text-xs"><Users className="size-3.5" /> {num(c.donors)}</span>
            {!done && <span className="mono flex items-center gap-1.5 text-xs"><Clock className="size-3.5" /> {daysLeft(c.endDate)}d left</span>}
            <Link
              href={done ? `/campaigns/${c.slug}` : `/donate?campaign=${c.id}`}
              className="flex items-center gap-1 rounded-lg bg-accent px-3 py-1.5 font-semibold text-ink transition-colors hover:bg-ink hover:text-accent"
            >
              {done ? "Story" : "Give"} <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
