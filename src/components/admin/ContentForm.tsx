"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Field } from "@/lib/admin-schemas";
import { api } from "@/lib/admin-api";
import { Button, Card, PageHeader, useToast } from "./ui";
import { FieldGrid } from "./fields";

export interface FormSection {
  title: string;
  description?: string;
  path?: string; // nested object key inside the singleton
  fields: Field[];
  aside?: React.ReactNode;
}

type Data = Record<string, unknown>;

export function useContentForm<T extends Data>(key: string, initial: T) {
  const toast = useToast();
  const router = useRouter();
  const [data, setData] = useState<T>(initial);
  const [saved, setSaved] = useState<T>(initial);
  const [saving, setSaving] = useState(false);
  const dirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(saved), [data, saved]);

  async function save() {
    setSaving(true);
    try {
      const res = await api.saveContent<T>(key, data);
      setSaved(res);
      setData(res);
      toast("Published — changes are live");
      router.refresh();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setSaving(false);
    }
  }
  return { data, setData, dirty, saving, save, reset: () => setData(saved) };
}

export function SaveBar({ dirty, saving, onSave, onReset }: { dirty: boolean; saving: boolean; onSave: () => void; onReset: () => void }) {
  return (
    <AnimatePresence>
      {dirty && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
          className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-xl items-center gap-3 rounded-full bg-ink py-2 pl-5 pr-2 text-white shadow-2xl shadow-black/30 lg:left-[264px]"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-amber-400" />
          </span>
          <span className="flex-1 text-sm">Unsaved changes</span>
          <button onClick={onReset} className="rounded-full px-3 py-2 text-sm text-white/70 hover:text-white">Discard</button>
          <Button variant="accent" loading={saving} onClick={onSave}>Publish</Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Sections({ sections, data, setData, pad = true }: { sections: FormSection[]; data: Data; setData: (d: Data) => void; pad?: boolean }) {
  return (
    <div className={pad ? "space-y-4 pb-24" : "space-y-4"}>
      {sections.map((s) => (
        <Card key={s.title} className="grid gap-6 p-5 md:p-7 lg:grid-cols-[260px_1fr]">
          <div>
            <h3 className="font-semibold tracking-tight">{s.title}</h3>
            {s.description && <p className="mt-1 text-[13px] leading-relaxed text-muted">{s.description}</p>}
            {s.aside}
          </div>
          <FieldGrid
            fields={s.fields}
            value={(s.path ? (data[s.path] as Data) : data) ?? {}}
            onChange={(v) => setData(s.path ? { ...data, [s.path]: v } : v)}
          />
        </Card>
      ))}
    </div>
  );
}

export default function ContentForm<T extends Data>({ contentKey, initial, title, description, eyebrow, sections, previewHref, children }: { contentKey: string; initial: T; title: string; description: string; eyebrow?: string; sections: FormSection[]; previewHref?: string; children?: React.ReactNode }) {
  const f = useContentForm(contentKey, initial);
  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <>
            {previewHref && (
              <a href={previewHref} target="_blank" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-sm font-medium hover:border-ink/25">
                <ExternalLink className="size-4" /> Preview
              </a>
            )}
            <Button variant="primary" disabled={!f.dirty} loading={f.saving} onClick={f.save}>Publish</Button>
          </>
        }
      />
      {children}
      <Sections sections={sections} data={f.data} setData={(d) => f.setData(d as T)} />
      <SaveBar dirty={f.dirty} saving={f.saving} onSave={f.save} onReset={f.reset} />
    </>
  );
}
