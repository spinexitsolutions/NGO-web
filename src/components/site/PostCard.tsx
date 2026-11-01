import Link from "next/link";
import type { Post } from "@/lib/types";
import { fmtDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import SmartImage from "@/components/ui/SmartImage";

export default function PostCard({ post, large }: { post: Post; large?: boolean }) {
  return (
    <Link href={`/stories/${post.slug}`} className="group block">
      <div className={cn("relative overflow-hidden rounded-xl3", large ? "aspect-[4/3] lg:aspect-[16/11]" : "aspect-[4/3]")}>
        <SmartImage src={post.cover} alt={post.title} fill sizes={large ? "(min-width:1024px) 60vw, 100vw" : "(min-width:1024px) 30vw, 100vw"} className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold backdrop-blur">{post.category}</span>
      </div>
      <div className="mt-5 flex items-center gap-3 text-sm text-muted">
        <span>{fmtDate(post.publishedAt)}</span>
        <span className="size-1 rounded-full bg-muted/50" />
        <span>{post.readTime} min read</span>
      </div>
      <h3 className={cn("display mt-3 !leading-[1.04] transition-colors group-hover:text-accent", large ? "text-[clamp(2rem,4vw,3.4rem)]" : "text-[1.7rem]")}>{post.title}</h3>
      {large && <p className="mt-4 max-w-xl leading-relaxed text-muted">{post.excerpt}</p>}
    </Link>
  );
}
