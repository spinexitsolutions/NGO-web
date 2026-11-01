"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/lib/types";
import { api } from "@/lib/admin-api";
import { Button, Card, PageHeader, useConfirm, useToast } from "./ui";
import { SaveBar, Sections, useContentForm, type FormSection } from "./ContentForm";

const PRESETS = ["#FF4D1C", "#E11D48", "#F2A007", "#1F9D55", "#0FA3B1", "#2F6BFF", "#7C3AED", "#0E0E0C"];

const sections: FormSection[] = [
  {
    title: "Identity",
    description: "Name and tagline used across the site, emails and receipts.",
    fields: [
      { key: "name", label: "Organisation name", type: "text" },
      { key: "shortName", label: "Short name", type: "text" },
      { key: "tagline", label: "Tagline", type: "text", full: true },
      { key: "description", label: "Short description", type: "textarea", rows: 3 },
      { key: "donateLabel", label: "Donate button label", type: "text" },
    ],
  },
  {
    title: "Contact",
    description: "Shown in the footer and on the Contact page.",
    fields: [
      { key: "email", label: "Email", type: "email" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "address", label: "Address", type: "textarea", rows: 2 },
      { key: "hours", label: "Office hours", type: "text" },
      { key: "mapQuery", label: "Map search query", type: "text", help: "Used for the embedded Google map." },
    ],
  },
  {
    title: "Social",
    path: "socials",
    fields: [
      { key: "instagram", label: "Instagram", type: "url" },
      { key: "x", label: "X / Twitter", type: "url" },
      { key: "facebook", label: "Facebook", type: "url" },
      { key: "linkedin", label: "LinkedIn", type: "url" },
      { key: "youtube", label: "YouTube", type: "url" },
    ],
  },
  {
    title: "Legal & compliance",
    description: "Registration numbers printed on receipts and the footer.",
    path: "legal",
    fields: [
      { key: "reg80G", label: "80G registration", type: "text" },
      { key: "fcra", label: "FCRA number", type: "text" },
      { key: "csr", label: "CSR-1 number", type: "text" },
      { key: "pan", label: "PAN", type: "text" },
    ],
  },
  {
    title: "Announcement bar",
    description: "A slim bar above the navbar for urgent appeals.",
    path: "announcement",
    fields: [
      { key: "enabled", label: "Show announcement", type: "toggle", full: true },
      { key: "text", label: "Text", type: "text", full: true },
      { key: "link", label: "Link", type: "text", full: true },
    ],
  },
  {
    title: "Footer & SEO",
    fields: [
      { key: "footerNote", label: "Footer note", type: "textarea", rows: 2 },
      { key: "seoTitle", label: "SEO title", type: "text", full: true },
      { key: "seoDescription", label: "SEO description", type: "textarea", rows: 2 },
    ],
  },
];

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const f = useContentForm("settings", initial as unknown as Record<string, unknown>);
  const toast = useToast();
  const router = useRouter();
  const { confirm, dialog } = useConfirm();
  const [resetting, setResetting] = useState(false);
  const accent = String(f.data.accent || "#FF4D1C");

  async function reset() {
    if (!(await confirm("All content and CRM data will be restored to the original demo. Your changes will be lost."))) return;
    setResetting(true);
    try {
      await api.reset();
      toast("Demo data restored");
      window.location.reload();
    } catch (e) {
      toast((e as Error).message, "error");
      setResetting(false);
    }
    router.refresh();
  }

  return (
    <div style={{ ["--accent" as string]: accent }}>
      <PageHeader eyebrow="Site" title="Settings" description="Brand, contact details and compliance info — changes publish instantly." actions={<Button variant="primary" disabled={!f.dirty} loading={f.saving} onClick={f.save}>Publish</Button>} />

      <Card className="mb-4 grid gap-6 p-5 md:p-7 lg:grid-cols-[260px_1fr]">
        <div>
          <h3 className="font-semibold tracking-tight">Brand colour</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">One accent colour drives buttons, highlights, progress bars and the intro animation across the whole site.</p>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            {PRESETS.map((c) => (
              <button key={c} onClick={() => f.setData({ ...f.data, accent: c })} aria-label={c} className="relative size-10 rounded-full transition hover:scale-110" style={{ background: c }}>
                {accent.toLowerCase() === c.toLowerCase() && <span className="absolute -inset-1 rounded-full ring-2 ring-ink" />}
              </button>
            ))}
            <label className="relative ml-1 flex h-10 cursor-pointer items-center gap-2 rounded-full border border-line bg-white pl-1.5 pr-3 text-sm">
              <span className="size-7 rounded-full" style={{ background: accent }} />
              <span className="font-mono uppercase">{accent}</span>
              <input type="color" value={accent} onChange={(e) => f.setData({ ...f.data, accent: e.target.value })} className="absolute inset-0 cursor-pointer opacity-0" />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-paper p-4">
            <span className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white">{String(f.data.donateLabel || "Donate")}</span>
            <span className="text-2xl font-semibold tracking-tight">Every child <span className="serif-accent text-accent">deserves</span></span>
            <div className="h-2 w-32 overflow-hidden rounded-full bg-white"><div className="h-full w-2/3 rounded-full bg-accent" /></div>
          </div>
        </div>
      </Card>

      <Sections sections={sections} data={f.data} setData={f.setData} pad={false} />

      <Card className="mb-28 mt-4 flex flex-col gap-4 border-red-200 p-5 md:flex-row md:items-center md:p-7">
        <div className="flex-1">
          <h3 className="font-semibold tracking-tight text-red-700">Reset demo data</h3>
          <p className="mt-1 text-[13px] text-muted">Restore every page, campaign, donor and message to the original demo content.</p>
        </div>
        <Button variant="danger" loading={resetting} onClick={reset}><RotateCcw className="size-4" /> Reset everything</Button>
      </Card>
      <SaveBar dirty={f.dirty} saving={f.saving} onSave={f.save} onReset={f.reset} />
      {dialog}
    </div>
  );
}
