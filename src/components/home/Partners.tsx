import type { Partner } from "@/lib/types";
import VelocityMarquee from "@/components/site/VelocityMarquee";

export default function Partners({ partners }: { partners: Partner[] }) {
  if (!partners.length) return null;
  return (
    <section className="overflow-hidden border-y border-ink/10 py-14 md:py-20">
      <p className="eyebrow container-x mb-8 text-muted">(09) Trusted by 40+ companies & foundations — scroll faster ↓</p>
      <VelocityMarquee baseVelocity={-2.2}>
        {partners.map((p, i) => (
          <span key={p.id} className="flex items-center">
            <span className={`display px-8 text-5xl md:px-12 md:text-7xl ${i % 2 ? "serif-accent" : ""} text-ink/80`}>{p.name}</span>
            <svg viewBox="0 0 20 20" className="size-6 shrink-0 md:size-8"><path d="M10 0 12.6 7.4 20 10 12.6 12.6 10 20 7.4 12.6 0 10 7.4 7.4Z" className="fill-accent-ink" /></svg>
          </span>
        ))}
      </VelocityMarquee>
    </section>
  );
}
