import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";
import { ImageReveal, Mark, Reveal, SplitWords } from "./motion";

/**
 * Inner-page header: a forest-green block with a notebook-dot field,
 * breadcrumb meta, a huge title and an image that overlaps into the page.
 */
export default function PageHeader({
  eyebrow,
  title,
  accent,
  text,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  text?: string;
  image?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative">
      <div className={`dots-dark relative bg-night text-paper ${image ? "pb-[18vh] md:pb-[26vh]" : "pb-16 md:pb-24"}`}>
        <div className="container-x pt-28 md:pt-36">
          <Reveal>
            <div className="flex items-center gap-3 border-t border-paper/15 pt-3 text-paper/55">
              <Link href="/" className="eyebrow hover:text-accent">Ummeed</Link>
              <span className="eyebrow">/</span>
              <span className="eyebrow text-accent">{eyebrow}</span>
            </div>
          </Reveal>
          <h1 className="display mt-10 max-w-6xl text-[clamp(3rem,10.5vw,9.5rem)] md:mt-14">
            <SplitWords text={title} />
            {accent && (
              <>
                {" "}
                <Mark delay={0.55}>
                  <SplitWords text={accent} delay={0.18} />
                </Mark>
              </>
            )}
          </h1>
          {(text || children) && (
            <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:items-end">
              {text && (
                <Reveal delay={0.3} className="md:col-span-6 md:col-start-1">
                  <p className="text-lg leading-relaxed text-paper/70 md:text-xl">{text}</p>
                </Reveal>
              )}
              {children && (
                <Reveal delay={0.4} className="md:col-span-5 md:col-start-8 md:justify-self-end">
                  {children}
                </Reveal>
              )}
            </div>
          )}
        </div>
      </div>
      {image && (
        <div className="container-x relative -mt-[14vh] md:-mt-[22vh]">
          <ImageReveal className="aspect-[4/5] rounded-xl3 sm:aspect-[16/9] md:aspect-[21/9]" delay={0.2}>
            <SmartImage src={image} alt="" fill priority sizes="100vw" className="object-cover" />
          </ImageReveal>
        </div>
      )}
    </header>
  );
}
