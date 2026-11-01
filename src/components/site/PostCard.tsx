import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { fmtDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import SmartImage from "@/components/ui/SmartImage";

export default function PostCard({ post, large }: { post: Post; large?: boolean }) {
  return (
    <Link href={`/stories/${post.slug}`} data-cursor="Read" className="group block">
      <div className={cn("relative overflow-hidden rounded-xl3", large ? "aspect-[4/3] lg:aspect-[16/11]" : "aspect-[4/3]")}>
        <SmartImage src={post.cover} alt={post.title} fill sizes={large ? "(min-width:1024px) 60vw, 100vw" : "(min-width:1024px) 30vw, 100vw"} className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
        <span className="eyebrow absolute left-3 top-3 rounded bg-paper px-2 py-1 text-ink">{post.category}</span>
        <span className="absolute bottom-3 right-3 grid size-11 translate-y-3 place-items-center rounded-xl bg-accent text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-5" />
        </span>
      </div>
      <div className="mono mt-4 flex items-center gap-3 text-xs text-muted">
        <span>{fmtDate(post.publishedAt)}</span>
        <span>—</span>
        <span>{post.readTime} min read</span>
      </div>
      <h3 className={cn("display mt-2 !leading-[1.02] transition-colors group-hover:text-accent-ink", large ? "text-[clamp(2rem,4vw,3.4rem)]" : "text-[1.65rem]")}>{post.title}</h3>
      {large && <p className="mt-4 max-w-xl leading-relaxed text-muted">{post.excerpt}</p>}
    </Link>
  );
}
