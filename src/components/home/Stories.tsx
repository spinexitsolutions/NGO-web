import type { Post } from "@/lib/types";
import Button from "@/components/ui/Button";
import PostCard from "@/components/site/PostCard";
import SectionHeading from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/motion";

export default function Stories({ posts }: { posts: Post[] }) {
  const sorted = [...posts].sort((a, b) => Number(b.featured) - Number(a.featured) || b.publishedAt.localeCompare(a.publishedAt));
  const [lead, ...rest] = sorted;
  if (!lead) return null;
  return (
    <section className="container-x py-24 md:py-36">
      <SectionHeading eyebrow="Stories from the field" title="Real people." accent="Real change.">
        <Button href="/stories" variant="ghost">All stories</Button>
      </SectionHeading>
      <div className="mt-14 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
        <Reveal>
          <PostCard post={lead} large />
        </Reveal>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
          {rest.slice(0, 2).map((p, i) => (
            <Reveal key={p.id} delay={0.1 + i * 0.1}>
              <PostCard post={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
