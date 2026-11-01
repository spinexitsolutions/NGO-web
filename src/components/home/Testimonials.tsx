import { Quote } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import SmartImage from "@/components/ui/SmartImage";
import SectionHeading from "@/components/site/SectionHeading";

const BG = ["bg-card text-ink", "bg-accent text-white", "bg-night text-paper"];

export default function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  return (
    <section className="container-x py-24 md:py-36">
      <SectionHeading eyebrow="In their words" title="Partners," accent="not beneficiaries." text="We'd rather let the people we work with tell you what Ummeed is." />
      <div className="mt-14">
        {items.map((t, i) => (
          <div key={t.id} className="sticky pb-6" style={{ top: `calc(6.5rem + ${i * 1.5}rem)` }}>
            <figure className={`grid gap-8 overflow-hidden rounded-xl3 p-7 shadow-[0_-20px_60px_-30px_rgb(0_0_0/0.25)] md:grid-cols-[1fr_auto] md:p-12 ${BG[i % BG.length]}`}>
              <div className="flex flex-col justify-between gap-10">
                <Quote className="size-9 opacity-40" />
                <blockquote className="display text-[clamp(1.7rem,3.8vw,3.4rem)] !leading-[1.06] !tracking-[-0.035em]">“{t.quote}”</blockquote>
                <figcaption>
                  <p className="text-lg font-semibold">{t.name}</p>
                  <p className="text-sm opacity-60">{t.role}</p>
                </figcaption>
              </div>
              {t.image && (
                <div className="relative hidden aspect-[3/4] w-64 overflow-hidden rounded-2xl md:block lg:w-72">
                  <SmartImage src={t.image} alt={t.name} fill sizes="300px" className="object-cover" />
                </div>
              )}
            </figure>
          </div>
        ))}
      </div>
    </section>
  );
}
