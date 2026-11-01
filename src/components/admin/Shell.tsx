"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3, BookOpen, CalendarDays, CircleDollarSign, Compass, ExternalLink, FileText, Flag, HandHeart, Heart, HelpCircle, Home, Image as ImageIcon,
  Inbox, Info, LayoutDashboard, LogOut, Mail, Megaphone, Menu, MessageSquareQuote, PieChart, Settings, Sparkles, Ticket, Users, UserRound, X, Handshake,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { api } from "@/lib/admin-api";

type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number };

export default function Shell({ children, siteName, accent, email, unread, newVolunteers }: { children: React.ReactNode; siteName: string; accent: string; email: string; unread: number; newVolunteers: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const groups: { title: string; items: Item[] }[] = [
    { title: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
    {
      title: "CRM",
      items: [
        { href: "/admin/donors", label: "Donors", icon: Users },
        { href: "/admin/donations", label: "Donations", icon: CircleDollarSign },
        { href: "/admin/volunteers", label: "Volunteers", icon: HandHeart, badge: newVolunteers },
        { href: "/admin/inbox", label: "Inbox", icon: Inbox, badge: unread },
        { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
        { href: "/admin/registrations", label: "Registrations", icon: Ticket },
      ],
    },
    {
      title: "Content",
      items: [
        { href: "/admin/homepage", label: "Homepage", icon: Home },
        { href: "/admin/programs", label: "Programs", icon: Compass },
        { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
        { href: "/admin/events", label: "Events", icon: CalendarDays },
        { href: "/admin/stories", label: "Stories", icon: BookOpen },
        { href: "/admin/about", label: "About page", icon: Info },
        { href: "/admin/team", label: "Team", icon: UserRound },
        { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
        { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
        { href: "/admin/partners", label: "Partners", icon: Handshake },
        { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
        { href: "/admin/stats", label: "Impact numbers", icon: BarChart3 },
        { href: "/admin/allocation", label: "Fund allocation", icon: PieChart },
        { href: "/admin/reports", label: "Reports", icon: FileText },
      ],
    },
    {
      title: "Site",
      items: [
        { href: "/admin/navigation", label: "Navigation", icon: Flag },
        { href: "/admin/intro", label: "Intro animation", icon: Sparkles },
        { href: "/admin/settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  const current = groups.flatMap((g) => g.items).find((i) => active(i.href));

  async function logout() {
    await api.logout().catch(() => {});
    router.push("/admin/login");
    router.refresh();
  }

  const nav = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 pb-4 pt-5">
        <div className="grid size-9 place-items-center rounded-xl text-white shadow-lg" style={{ background: accent, boxShadow: `0 8px 20px -8px ${accent}` }}>
          <Heart className="size-[18px] fill-white" />
        </div>
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[15px] font-semibold tracking-tight">{siteName}</div>
          <div className="text-[11.5px] text-muted">Admin console</div>
        </div>
        <button onClick={() => setOpen(false)} className="ml-auto grid size-8 place-items-center rounded-full text-muted hover:bg-ink/5 lg:hidden" aria-label="Close menu">
          <X className="size-4" />
        </button>
      </div>
      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 pb-4" data-lenis-prevent>
        {groups.map((g) => (
          <div key={g.title} className="mt-4 first:mt-1">
            <div className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted/80">{g.title}</div>
            {g.items.map((it) => {
              const on = active(it.href);
              const Icon = it.icon;
              return (
                <Link key={it.href} href={it.href} className={clsx("relative flex items-center gap-2.5 rounded-xl px-3 py-[7px] text-[13.5px] transition-colors", on ? "font-medium text-ink" : "text-ink-2/75 hover:bg-ink/[0.04] hover:text-ink")}>
                  {on && <motion.span layoutId="nav-active" className="absolute inset-0 rounded-xl bg-white shadow-[0_1px_3px_rgb(0_0_0/0.08),0_0_0_1px_rgb(0_0_0/0.04)]" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
                  <Icon className={clsx("relative size-4", on ? "text-ink" : "text-muted")} />
                  <span className="relative">{it.label}</span>
                  {!!it.badge && <span className="relative ml-auto rounded-full bg-accent px-1.5 py-px text-[10.5px] font-semibold tabular-nums text-ink">{it.badge}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="border-t border-line p-3">
        <a href="/" target="_blank" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] text-ink-2/75 hover:bg-ink/[0.04] hover:text-ink">
          <ExternalLink className="size-4 text-muted" /> View live site
        </a>
        <div className="mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2">
          <div className="grid size-7 place-items-center rounded-full bg-ink text-[11px] font-semibold text-white">{email[0]?.toUpperCase()}</div>
          <div className="min-w-0 flex-1 truncate text-[12.5px] text-muted">{email}</div>
          <button onClick={logout} className="grid size-7 place-items-center rounded-full text-muted hover:bg-ink/5 hover:text-ink" aria-label="Log out" title="Log out">
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-paper" style={{ ["--accent" as string]: accent }}>
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] border-r border-line bg-paper-2/40 lg:block">{nav}</aside>

      {/* mobile top bar */}
      <header className="glass sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-line px-4 lg:hidden">
        <button onClick={() => setOpen(true)} className="grid size-9 place-items-center rounded-full bg-white ring-1 ring-line" aria-label="Open menu">
          <Menu className="size-4" />
        </button>
        <div className="min-w-0 flex-1 truncate text-[15px] font-semibold tracking-tight">{current?.label ?? "Admin"}</div>
        <a href="/" target="_blank" className="grid size-9 place-items-center rounded-full bg-white ring-1 ring-line" aria-label="View site">
          <ExternalLink className="size-4" />
        </a>
      </header>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="absolute inset-y-0 left-0 w-[290px] max-w-[85vw] bg-paper shadow-2xl"
            >
              {nav}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <main className="min-w-0 overflow-x-clip lg:pl-[264px]">
        <motion.div key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="mx-auto max-w-[1280px] px-4 py-6 md:px-8 md:py-10">
          {children}
        </motion.div>
      </main>
    </div>
  );
}
