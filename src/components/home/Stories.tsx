import Link from "next/link";
import type { Post } from "@/lib/types";
import { fmtDate } from "@/lib/format";
import Button from "@/components/ui/Button";
import SmartImage from "@/components/ui/SmartImage";
import PostCard from "@/components/site/PostCard";
import SectionHeading from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/motion";

/** Featured long-read beside a numbered index of other stories (thumbnail grows in on hover). */
export default function Stories({ posts }: { posts: Post[] }) {
  const sorted = [...posts].sort((a, b) => Number(b.featured) - Number(a.featured) || b.publishedAt.localeCompare(a.publishedAt));
  const [lead, ...rest] = sorted;
  if (!lead) return null;
  return (
    <section className="container-x py-24 md:py-36">
      <SectionHeading index="06" eyebrow="Stories from the field" title="Real people." accent="Real change.">
        <Button href="/stories" variant="ghost">All stories</Button>
      </SectionHeading>
      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <PostCard post={lead} large />
        </Reveal>
        <ol className="border-t border-ink/15 lg:col-span-5">
          {rest.slice(0, 4).map((p, i) => (
            <Reveal as="li" key={p.id} delay={0.08 * i} className="border-b border-ink/15">
              <Link href={`/stories/${p.slug}`} data-cursor="Read" className="group grid grid-cols-[2rem_1fr_auto] items-center gap-4 py-5">
                <span className="mono self-start pt-1 text-xs text-muted">0{i + 2}</span>
                <span>
                  <span className="eyebrow text-muted">{p.category} — {fmtDate(p.publishedAt, { day: "numeric", month: "short" })}</span>
                  <span className="display mt-1.5 block text-xl !leading-[1.08] transition-colors group-hover:text-accent-ink md:text-2xl">{p.title}</span>
                </span>
                <span className="relative block h-16 w-0 overflow-hidden rounded-lg transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:w-20 max-sm:w-16">
                  <SmartImage src={p.cover} alt="" fill sizes="80px" className="object-cover" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
