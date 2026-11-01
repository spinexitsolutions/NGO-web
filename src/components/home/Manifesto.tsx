import { ScrollText, Reveal } from "@/components/site/motion";

export default function Manifesto({ text }: { text: string }) {
  return (
    <section className="container-x py-28 md:py-44">
      <Reveal>
        <p className="eyebrow mb-10 flex items-center gap-2 text-muted">
          <span className="size-1.5 rounded-full bg-accent" />
          What we believe
        </p>
      </Reveal>
      <ScrollText text={text} className="display max-w-6xl text-[clamp(1.9rem,4.6vw,4.2rem)] !leading-[1.08] !tracking-[-0.035em]" />
      <Reveal className="mt-12 flex items-center gap-4">
        <span className="h-px w-12 bg-ink/30" />
        <span className="serif-accent text-2xl">Meera Iyer</span>
        <span className="text-sm text-muted">Founder</span>
      </Reveal>
    </section>
  );
}
