"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Eye, EyeOff, GripVertical } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import type { HeroContent, HomeSection } from "@/lib/types";
import { api } from "@/lib/admin-api";
import { Button, Card, PageHeader, Toggle, useToast } from "./ui";
import { SaveBar, Sections, useContentForm, type FormSection } from "./ContentForm";

const heroSections: FormSection[] = [
  {
    title: "Hero headline",
    description: "Three lines — the middle word is set in the serif italic accent.",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", full: true },
      { key: "titleLine1", label: "Line 1", type: "text" },
      { key: "titleAccent", label: "Accent word", type: "text" },
      { key: "titleLine2", label: "Line 2", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "textarea", rows: 3 },
      { key: "ctaPrimary", label: "Primary button", type: "text" },
      { key: "ctaSecondary", label: "Secondary button", type: "text" },
    ],
  },
  {
    title: "Hero imagery",
    description: "The main image scales on scroll; the three side images float around it.",
    fields: [
      { key: "image", label: "Main image", type: "image" },
      { key: "sideImages", label: "Side images", type: "images" },
    ],
  },
  {
    title: "Manifesto",
    description: "Large text revealed word-by-word as visitors scroll.",
    fields: [{ key: "manifesto", label: "Manifesto", type: "textarea", rows: 5 }],
  },
];

export default function HomepageEditor({ hero, sections: initialSections }: { hero: HeroContent; sections: HomeSection[] }) {
  const f = useContentForm("hero", hero as unknown as Record<string, unknown>);
  const toast = useToast();
  const router = useRouter();
  const [sections, setSections] = useState(initialSections);
  const h = f.data as unknown as HeroContent;

  async function persist(next: HomeSection[], msg: string) {
    setSections(next);
    try {
      await api.replace("sections", next);
      toast(msg);
      router.refresh();
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }
  const move = (i: number, d: number) => {
    const next = [...sections];
    const [x] = next.splice(i, 1);
    next.splice(i + d, 0, x);
    persist(next, "Section order updated");
  };

  return (
    <>
      <PageHeader
        eyebrow="Content"
        title="Homepage"
        description="Edit the hero and choose which sections appear — and in what order."
        actions={
          <>
            <a href="/" target="_blank" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-sm font-medium hover:border-ink/25"><Eye className="size-4" /> Preview</a>
            <Button variant="primary" disabled={!f.dirty} loading={f.saving} onClick={f.save}>Publish</Button>
          </>
        }
      />

      {/* live preview */}
      <Card className="relative mb-4 overflow-hidden bg-ink p-0 text-white">
        {h.image && <img src={h.image} alt="" className="absolute inset-0 size-full object-cover opacity-55" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="relative flex min-h-[260px] flex-col justify-end p-6 md:min-h-[320px] md:p-10">
          <div className="eyebrow mb-3 text-white/70">{h.eyebrow}</div>
          <div className="text-[34px] font-semibold leading-[0.95] tracking-[-0.045em] md:text-[56px]">
            {h.titleLine1} <span className="serif-accent">{h.titleAccent}</span>
            <br />
            {h.titleLine2}
          </div>
          <p className="mt-3 max-w-xl text-sm text-white/75 md:text-[15px]">{h.subtitle}</p>
          <div className="mt-5 flex gap-2">
            <span className="rounded-full bg-accent px-4 py-2 text-sm font-medium">{h.ctaPrimary}</span>
            <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">{h.ctaSecondary}</span>
          </div>
        </div>
        <span className="absolute right-4 top-4 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur">Live preview</span>
      </Card>

      <Card className="mb-4 grid gap-6 p-5 md:p-7 lg:grid-cols-[260px_1fr]">
        <div>
          <h3 className="font-semibold tracking-tight">Page sections</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">Toggle visibility and reorder. Changes save instantly.</p>
          <p className="mt-3 text-[12.5px] text-muted tabular-nums">{sections.filter((s) => s.visible).length} of {sections.length} visible</p>
        </div>
        <ul className="space-y-1.5">
          {sections.map((s, i) => (
            <motion.li layout key={s.id} transition={{ type: "spring", stiffness: 500, damping: 40 }} className={clsx("flex items-center gap-2 rounded-2xl border border-line bg-white px-3 py-2.5 sm:gap-3", !s.visible && "opacity-55")}>
              <GripVertical className="hidden size-4 text-muted/60 sm:block" />
              <span className="hidden size-7 shrink-0 place-items-center rounded-lg bg-paper sm:grid text-[12px] font-semibold tabular-nums">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{s.label}</span>
              {s.visible ? <Eye className="hidden size-4 text-muted sm:block" /> : <EyeOff className="hidden size-4 text-muted sm:block" />}
              <Toggle checked={s.visible} label={`Show ${s.label}`} onChange={(v) => persist(sections.map((x) => (x.id === s.id ? { ...x, visible: v } : x)), v ? `${s.label} shown` : `${s.label} hidden`)} />
              <div className="flex">
                <button disabled={i === 0} onClick={() => move(i, -1)} className="grid size-8 place-items-center rounded-full text-muted hover:bg-paper disabled:opacity-25" aria-label="Move up"><ArrowUp className="size-3.5" /></button>
                <button disabled={i === sections.length - 1} onClick={() => move(i, 1)} className="grid size-8 place-items-center rounded-full text-muted hover:bg-paper disabled:opacity-25" aria-label="Move down"><ArrowDown className="size-3.5" /></button>
              </div>
            </motion.li>
          ))}
        </ul>
      </Card>

      <Sections sections={heroSections} data={f.data} setData={f.setData} />
      <SaveBar dirty={f.dirty} saving={f.saving} onSave={f.save} onReset={f.reset} />
    </>
  );
}
