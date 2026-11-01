import SmartImage from "@/components/ui/SmartImage";
import { Parallax, Reveal, SplitWords } from "./motion";

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
    <header className="container-x pt-36 md:pt-44">
      <Reveal>
        <p className="eyebrow mb-6 flex items-center gap-2 text-muted">
          <span className="size-1.5 rounded-full bg-accent" />
          {eyebrow}
        </p>
      </Reveal>
      <h1 className="display max-w-6xl text-[clamp(3rem,10vw,8.5rem)]">
        <SplitWords text={title} />
        {accent && (
          <>
            {" "}
            <SplitWords text={accent} wordClassName="serif-accent text-accent" delay={0.2} />
          </>
        )}
      </h1>
      <div className="mt-8 flex flex-col gap-6 md:mt-12 md:flex-row md:items-end md:justify-between">
        {text && (
          <Reveal delay={0.3} className="max-w-xl">
            <p className="text-lg leading-relaxed text-muted md:text-xl">{text}</p>
          </Reveal>
        )}
        {children && <Reveal delay={0.4}>{children}</Reveal>}
      </div>
      {image && (
        <Reveal delay={0.35} y={60}>
          <Parallax speed={0.08} className="mt-12 aspect-[4/5] rounded-xl3 sm:aspect-[16/9] md:mt-16 md:aspect-[21/9]">
            <SmartImage src={image} alt="" fill priority sizes="100vw" className="object-cover" />
          </Parallax>
        </Reveal>
      )}
    </header>
  );
}
