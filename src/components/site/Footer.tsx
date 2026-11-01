import Link from "next/link";
import type { NavItem, SiteSettings } from "@/lib/types";
import { LogoMark } from "./Logo";
import Newsletter from "./Newsletter";

export default function Footer({ settings, nav }: { settings: SiteSettings; nav: NavItem[] }) {
  const year = new Date().getFullYear();
  const cols = [
    { title: "Explore", links: nav.filter((n) => n.visible).slice(0, 5).map((n) => ({ label: n.label, href: n.href })) },
    {
      title: "Get involved",
      links: [
        { label: "Donate", href: "/donate" },
        { label: "Monthly giving", href: "/donate?frequency=monthly" },
        { label: "Volunteer", href: "/volunteer" },
        { label: "Events", href: "/events" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Trust",
      links: [
        { label: "Impact & reports", href: "/impact" },
        { label: "FAQs", href: "/contact#faq" },
        { label: "Gallery", href: "/gallery" },
        { label: "Stories", href: "/stories" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-night text-paper">
      <div className="container-x pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-md">
            <LogoMark className="size-11" />
            <p className="display mt-8 text-4xl md:text-5xl">
              Letters from the field, <span className="serif-accent text-accent">once a month.</span>
            </p>
            <div className="mt-8">
              <Newsletter />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {cols.map((c) => (
              <div key={c.title}>
                <p className="eyebrow mb-5 text-paper/40">{c.title}</p>
                <ul className="space-y-3">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="group inline-flex items-center gap-2 text-paper/75 transition-colors hover:text-paper">
                        <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-3" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 sm:col-span-3">
              <p className="eyebrow mb-5 text-paper/40">Visit</p>
              <p className="max-w-sm text-paper/75">{settings.address}</p>
              <p className="mt-2 text-paper/50">{settings.hours}</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                <a href={`mailto:${settings.email}`} className="hover:text-accent">{settings.email}</a>
                <a href={`tel:${settings.phone}`} className="text-paper/75 hover:text-paper">{settings.phone}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-paper/10 py-6 text-xs text-paper/45 md:flex-row md:items-center md:justify-between">
          <p>{settings.footerNote}</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <span>80G: {settings.legal.reg80G}</span>
            <span>FCRA: {settings.legal.fcra}</span>
            <span>CSR: {settings.legal.csr}</span>
          </p>
        </div>
        <div className="flex flex-col gap-3 pb-6 text-xs text-paper/45 sm:flex-row sm:justify-between">
          <p>© {year} {settings.name}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            {Object.entries(settings.socials).map(([k, v]) =>
              v ? (
                <a key={k} href={v} target="_blank" rel="noreferrer" className="capitalize hover:text-paper">
                  {k === "x" ? "X" : k}
                </a>
              ) : null,
            )}
          </div>
        </div>
      </div>
      {/* giant wordmark */}
      <p aria-hidden className="display pointer-events-none select-none whitespace-nowrap text-center text-[25vw] leading-[0.75] text-paper/[0.06] -mb-[0.06em]">
        {settings.shortName.toLowerCase()}
      </p>
    </footer>
  );
}
