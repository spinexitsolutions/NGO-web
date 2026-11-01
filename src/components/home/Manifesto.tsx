import { ScrollText, Reveal, ImageReveal } from "@/components/site/motion";
import SmartImage from "@/components/ui/SmartImage";

export default function Manifesto({ text, image }: { text: string; image?: string }) {
  return (
    <section className="container-x grid gap-10 py-24 md:grid-cols-12 md:py-40">
      <div className="md:col-span-3">
        <div className="md:sticky md:top-28">
          <Reveal>
            <p className="eyebrow border-t border-ink/15 pt-3 text-muted">(02) What we believe</p>
          </Reveal>
          {image && (
            <ImageReveal className="mt-6 hidden aspect-[3/4] w-full max-w-[14rem] rounded-xl2 md:block">
              <SmartImage src={image} alt="" fill sizes="220px" className="object-cover" />
            </ImageReveal>
          )}
          <Reveal className="mt-6 hidden md:block">
            <p className="font-semibold">Meera Iyer</p>
            <p className="mono text-xs text-muted">Founder, since 2011</p>
          </Reveal>
        </div>
      </div>
      <div className="md:col-span-9">
        <ScrollText text={text} className="display text-[clamp(2rem,4.8vw,4.6rem)] !leading-[1.02] !tracking-[-0.04em]" />
      </div>
    </section>
  );
}
