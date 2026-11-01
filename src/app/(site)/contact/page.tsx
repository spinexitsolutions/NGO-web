import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getDb } from "@/lib/db";
import PageHeader from "@/components/site/PageHeader";
import ContactForm from "@/components/site/ContactForm";
import SectionHeading from "@/components/site/SectionHeading";
import Faq from "@/components/site/Faq";
import { Reveal } from "@/components/site/motion";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const { settings, faqs } = await getDb();
  const items = [
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: Phone, label: "Phone", value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` },
    { icon: MapPin, label: "Office", value: settings.address },
    { icon: Clock, label: "Hours", value: settings.hours },
  ];
  return (
    <>
      <PageHeader eyebrow="Contact" title="Let's" accent="talk." text="Questions about a donation, a partnership idea, or just want to visit a centre? We'd love to hear from you." />
      <section className="container-x grid gap-10 py-20 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div className="space-y-4">
          {items.map((it, i) => (
            <Reveal key={it.label} delay={i * 0.05}>
              {it.href ? (
                <a href={it.href} className="group flex items-start gap-4 rounded-2xl bg-card p-5 ring-1 ring-ink/5 transition-colors hover:bg-night hover:text-paper">
                  <it.icon className="mt-0.5 size-5 text-accent-ink" />
                  <span><span className="block text-sm text-muted group-hover:text-paper/60">{it.label}</span><span className="text-lg font-semibold">{it.value}</span></span>
                </a>
              ) : (
                <div className="flex items-start gap-4 rounded-2xl bg-card p-5 ring-1 ring-ink/5">
                  <it.icon className="mt-0.5 size-5 text-accent-ink" />
                  <span><span className="block text-sm text-muted">{it.label}</span><span className="font-semibold">{it.value}</span></span>
                </div>
              )}
            </Reveal>
          ))}
          <Reveal className="overflow-hidden rounded-2xl ring-1 ring-ink/5">
            <iframe title="Office map" className="h-64 w-full grayscale" loading="lazy" src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.mapQuery)}&output=embed`} />
          </Reveal>
        </div>
        <Reveal delay={0.1}><ContactForm /></Reveal>
      </section>
      <section id="faq" className="container-x scroll-mt-28 py-20 md:py-28">
        <SectionHeading eyebrow="FAQ" title="Quick" accent="answers." className="mb-12" />
        <Faq items={faqs} />
      </section>
    </>
  );
}
