import Link from "next/link";
import Button from "@/components/ui/Button";
import { SplitWords, Reveal } from "@/components/site/motion";

const QUICK = [500, 1500, 5000];

export default function CTA({ donateLabel }: { donateLabel: string }) {
  return (
    <section className="container-x pb-28 md:pb-32">
      <div className="grain relative overflow-hidden rounded-xl3 bg-accent px-5 py-16 text-ink md:px-14 md:py-24">
        <svg aria-hidden viewBox="0 0 400 400" className="pointer-events-none absolute -right-24 -top-24 size-[28rem] animate-spin-slow opacity-90 md:size-[34rem]">
          <path d="M200 0 226 174 400 200 226 226 200 400 174 226 0 200 174 174Z" className="fill-ink/[0.07]" />
        </svg>
        <div className="relative grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow border-t border-ink/20 pt-3">(10) Join in</p>
            <h2 className="display mt-8 text-[clamp(3.2rem,10vw,9.5rem)]">
              <SplitWords text="Be someone's" /> <SplitWords text="ummeed." wordClassName="serif-accent" delay={0.2} />
            </h2>
            <Reveal delay={0.2} className="mt-8 max-w-xl text-lg text-ink/75">
              ₹1,500 a month keeps a child in a learning centre for a whole year. Cancel anytime. 80G receipt instantly.
            </Reveal>
          </div>
          <Reveal delay={0.3} className="rounded-xl2 bg-ink p-5 text-paper lg:col-span-4">
            <p className="eyebrow text-paper/50">Quick give · monthly</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {QUICK.map((q) => (
                <Link key={q} href={`/donate?frequency=monthly&amount=${q}`} className="mono rounded-lg bg-paper/10 py-3 text-center text-sm font-semibold transition-colors hover:bg-accent hover:text-ink">
                  ₹{q.toLocaleString("en-IN")}
                </Link>
              ))}
            </div>
            <div className="mt-3 grid gap-2">
              <Button href="/donate?frequency=monthly" className="w-full">{donateLabel} monthly</Button>
              <Button href="/volunteer" variant="outline-light" className="w-full">Volunteer instead</Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
