import Link from "next/link";
import type { NavItem, SiteSettings } from "@/lib/types";
import { LogoMark } from "./Logo";
import Newsletter from "./Newsletter";
import FooterWordmark from "./FooterWordmark";

export default function Footer({ settings, nav }: { settings: SiteSettings; nav: NavItem[] }) {
  const year = new Date().getFullYear();
  const cols = [
    { title: "Explore", links: nav.filter((n) => n.visible).slice(0, 6).map((n) => ({ label: n.label, href: n.href })) },
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
    <footer className="dots-dark relative overflow-hidden bg-night pb-24 text-paper lg:pb-0">
      <div className="container-x pt-16 md:pt-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <LogoMark className="size-10" />
              <span className="eyebrow text-paper/50">{settings.tagline}</span>
            </div>
            <p className="display mt-10 text-4xl md:text-5xl">
              Letters from the field, <span className="text-accent">once a month.</span>
            </p>
            <div className="mt-8 max-w-md">
              <Newsletter />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {cols.map((c) => (
              <div key={c.title}>
                <p className="eyebrow mb-5 border-t border-paper/15 pt-3 text-paper/45">{c.title}</p>
                <ul className="space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="group inline-flex items-center gap-2 text-paper/75 transition-colors hover:text-accent">
                        <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-3" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 sm:col-span-3">
              <p className="eyebrow mb-5 border-t border-paper/15 pt-3 text-paper/45">Visit</p>
              <p className="max-w-sm text-paper/75">{settings.address}</p>
              <p className="mono mt-2 text-xs text-paper/50">{settings.hours}</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                <a href={`mailto:${settings.email}`} className="text-accent hover:underline">{settings.email}</a>
                <a href={`tel:${settings.phone}`} className="text-paper/75 hover:text-paper">{settings.phone}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mono mt-16 flex flex-col gap-3 border-t border-paper/10 py-5 text-[0.7rem] text-paper/45 md:flex-row md:items-center md:justify-between">
          <p>{settings.footerNote}</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <span>80G {settings.legal.reg80G}</span>
            <span>FCRA {settings.legal.fcra}</span>
            <span>CSR {settings.legal.csr}</span>
          </p>
        </div>
        <div className="mono flex flex-col gap-3 pb-6 text-[0.7rem] uppercase text-paper/45 sm:flex-row sm:justify-between">
          <p>© {year} {settings.name}</p>
          <div className="flex flex-wrap gap-4">
            {Object.entries(settings.socials).map(([k, v]) =>
              v ? (
                <a key={k} href={v} target="_blank" rel="noreferrer" className="hover:text-accent">
                  {k === "x" ? "X" : k}
                </a>
              ) : null,
            )}
          </div>
        </div>
      </div>
      <FooterWordmark text={settings.shortName.toLowerCase()} />
    </footer>
  );
}
