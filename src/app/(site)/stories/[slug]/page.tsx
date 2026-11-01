import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { fmtDate } from "@/lib/format";
import SmartImage from "@/components/ui/SmartImage";
import Prose from "@/components/site/Prose";
import PostCard from "@/components/site/PostCard";
import ShareButtons from "@/components/site/ShareButtons";
import ReadingProgress from "@/components/site/ReadingProgress";
import Button from "@/components/ui/Button";
import { Parallax, Reveal, SplitWords } from "@/components/site/motion";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getDb()).posts.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.excerpt } : {};
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const db = await getDb();
  const post = db.posts.find((x) => x.slug === slug && x.status === "published");
  if (!post) notFound();
  const more = db.posts.filter((p) => p.id !== post.id && p.status === "published").slice(0, 3);
  const author = db.team.find((t) => t.name === post.author);

  return (
    <article>
      <ReadingProgress />
      <header className="container-x pt-36 md:pt-44">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="eyebrow text-muted">{post.category} · {post.readTime} min read</p>
        </Reveal>
        <h1 className="display mx-auto mt-6 max-w-5xl text-center text-[clamp(2.4rem,6.5vw,5.6rem)]">
          <SplitWords text={post.title} stagger={0.03} />
        </h1>
        <Reveal delay={0.3} className="mt-8 flex items-center justify-center gap-3 text-sm">
          {author && (
            <span className="relative size-10 overflow-hidden rounded-full">
              <SmartImage src={author.image} alt={author.name} fill sizes="40px" className="object-cover" />
            </span>
          )}
          <span>
            <b className="font-semibold">{post.author}</b>
            <span className="block text-muted">{fmtDate(post.publishedAt, { day: "numeric", month: "long", year: "numeric" })}</span>
          </span>
        </Reveal>
        <Reveal delay={0.35} y={60}>
          <Parallax speed={0.08} className="mt-12 aspect-[4/3] rounded-xl3 md:mt-16 md:aspect-[21/9]">
            <SmartImage src={post.cover} alt="" fill priority sizes="100vw" className="object-cover" />
          </Parallax>
        </Reveal>
      </header>

      <div className="container-x py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <p className="display mb-10 text-2xl !leading-snug !tracking-[-0.025em] md:text-3xl">{post.excerpt}</p>
          <Prose text={post.content} />
          <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <ShareButtons title={post.title} />
            <Button href="/donate">Support this work</Button>
          </div>
        </div>
      </div>

      {more.length > 0 && (
        <section className="container-x pb-28">
          <h2 className="display mb-10 text-4xl md:text-5xl">Keep reading</h2>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </section>
      )}
    </article>
  );
}
