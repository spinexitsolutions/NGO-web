import { ArrowUpRight, Clock, Users } from "lucide-react";
import Link from "next/link";
import type { Campaign } from "@/lib/types";
import { compactInr, daysLeft, num, pct } from "@/lib/format";
import { cn } from "@/lib/cn";
import SmartImage from "@/components/ui/SmartImage";
import { Progress } from "./motion";

export default function CampaignCard({ c, large }: { c: Campaign; large?: boolean }) {
  const p = pct(c.raised, c.goal);
  const done = c.status === "completed" || p >= 100;
  return (
    <article className={cn("group flex h-full flex-col overflow-hidden rounded-xl3 bg-card shadow-[0_1px_0_rgb(0_0_0/0.04)] ring-1 ring-ink/5 transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.35)]", large && "lg:flex-row")}>
      <Link href={`/campaigns/${c.slug}`} className={cn("relative block aspect-[16/11] overflow-hidden", large && "lg:aspect-auto lg:w-[55%]")}>
        <SmartImage src={c.image} alt={c.title} fill sizes={large ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 33vw, 100vw"} className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
        <div className="absolute left-4 top-4 flex gap-2">
          {c.urgent && !done && (
            <span className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
              <span className="size-1.5 animate-pulse rounded-full bg-white" /> Urgent
            </span>
          )}
          {done && <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-paper">Fully funded ✓</span>}
        </div>
      </Link>
      <div className={cn("flex flex-1 flex-col p-6 md:p-7", large && "lg:justify-between lg:p-10")}>
        <div>
          <h3 className={cn("display text-[1.9rem] !leading-[1.02]", large && "lg:text-5xl")}>
            <Link href={`/campaigns/${c.slug}`} className="hover:text-accent">{c.title}</Link>
          </h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{c.summary}</p>
        </div>
        <div className="mt-8">
          <div className="mb-3 flex items-end justify-between">
            <p>
              <span className="display text-3xl">{compactInr(c.raised)}</span>
              <span className="ml-1.5 text-sm text-muted">of {compactInr(c.goal)}</span>
            </p>
            <span className="text-sm font-semibold tabular-nums">{p}%</span>
          </div>
          <Progress value={p} />
          <div className="mt-5 flex items-center justify-between text-sm text-muted">
            <span className="flex items-center gap-1.5"><Users className="size-4" /> {num(c.donors)} donors</span>
            {!done && <span className="flex items-center gap-1.5"><Clock className="size-4" /> {daysLeft(c.endDate)} days left</span>}
            <Link
              href={done ? `/campaigns/${c.slug}` : `/donate?campaign=${c.id}`}
              className="flex items-center gap-1 font-semibold text-ink transition-colors hover:text-accent"
            >
              {done ? "Read story" : "Donate"} <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
