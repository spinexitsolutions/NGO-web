"use client";

import { ImagePlus, Link2, Loader2, Plus, Trash2, X, ChevronUp, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import clsx from "clsx";
import type { Field } from "@/lib/admin-schemas";
import { slugify } from "@/lib/admin-format";
import { api } from "@/lib/admin-api";
import { Toggle, useToast } from "./ui";

export type Lookups = Record<string, { value: string; label: string }[]>;

export function Label({ children, help, htmlFor }: { children: React.ReactNode; help?: string; htmlFor?: string }) {
  return (
    <div className="mb-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-ink-2">
        {children}
      </label>
      {help && <p className="mt-0.5 text-xs text-muted">{help}</p>}
    </div>
  );
}

export function ImageInput({ value, onChange, compact }: { value: string; onChange: (v: string) => void; compact?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const toast = useToast();

  async function handle(file?: File) {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await api.upload(file));
      toast("Image uploaded");
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handle(e.dataTransfer.files?.[0]);
      }}
      className={clsx("overflow-hidden rounded-2xl border bg-white transition", drag ? "border-ink ring-4 ring-ink/5" : "border-line")}
    >
      {value ? (
        <div className={clsx("group relative bg-paper", compact ? "aspect-[16/7]" : "aspect-[16/8]")}>
          <img src={value} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 flex items-end justify-end gap-2 bg-linear-to-t from-black/40 to-transparent p-3 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
            <button type="button" onClick={() => ref.current?.click()} className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium backdrop-blur">
              Replace
            </button>
            <button type="button" onClick={() => onChange("")} className="grid size-7 place-items-center rounded-full bg-white/90 backdrop-blur" aria-label="Remove image">
              <X className="size-3.5" />
            </button>
          </div>
          {busy && (
            <div className="absolute inset-0 grid place-items-center bg-white/60">
              <Loader2 className="size-5 animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <button type="button" onClick={() => ref.current?.click()} className={clsx("flex w-full flex-col items-center justify-center gap-2 text-muted transition hover:bg-paper/50", compact ? "py-6" : "py-10")}>
          {busy ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
          <span className="text-sm">
            <span className="font-medium text-ink">Upload</span> or drop an image
          </span>
        </button>
      )}
      <div className="flex items-center gap-2 border-t border-line px-3">
        <Link2 className="size-3.5 shrink-0 text-muted" />
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="…or paste an image URL" className="h-10 w-full bg-transparent text-[13px] outline-none" />
      </div>
      <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => handle(e.target.files?.[0])} />
    </div>
  );
}

export function TagsInput({ value, onChange, placeholder = "Type and press Enter" }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setDraft("");
  };
  return (
    <div className="flex min-h-[46px] flex-wrap items-center gap-1.5 rounded-[0.9rem] border border-line bg-white px-2.5 py-2 focus-within:border-ink">
      {value.map((t, i) => (
        <span key={t + i} className="inline-flex items-center gap-1 rounded-full bg-paper px-2.5 py-1 text-[13px]">
          {t}
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-muted hover:text-ink" aria-label={`Remove ${t}`}>
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          } else if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={add}
        placeholder={value.length ? "" : placeholder}
        className="min-w-[120px] flex-1 bg-transparent px-1 text-sm outline-none"
      />
    </div>
  );
}

function Repeater({ field, value, onChange, lookups }: { field: Field; value: Record<string, unknown>[]; onChange: (v: Record<string, unknown>[]) => void; lookups: Lookups }) {
  const sub = field.fields ?? [];
  const blank = Object.fromEntries(sub.map((f) => [f.key, f.type === "number" ? 0 : f.type === "toggle" ? false : ""]));
  const move = (i: number, d: number) => {
    const next = [...value];
    const [x] = next.splice(i, 1);
    next.splice(i + d, 0, x);
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {value.map((row, i) => (
        <div key={i} className="rounded-2xl border border-line bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="eyebrow text-muted">#{i + 1}</span>
            <div className="flex items-center gap-1">
              <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="grid size-7 place-items-center rounded-full text-muted hover:bg-paper disabled:opacity-30" aria-label="Move up">
                <ChevronUp className="size-4" />
              </button>
              <button type="button" disabled={i === value.length - 1} onClick={() => move(i, 1)} className="grid size-7 place-items-center rounded-full text-muted hover:bg-paper disabled:opacity-30" aria-label="Move down">
                <ChevronDown className="size-4" />
              </button>
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="grid size-7 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-600" aria-label="Remove">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
          <FieldGrid fields={sub} value={row} onChange={(r) => onChange(value.map((x, j) => (j === i ? r : x)))} lookups={lookups} />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, blank])} className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-ink/20 py-3 text-sm font-medium text-muted transition hover:border-ink/40 hover:text-ink">
        <Plus className="size-4" /> Add {field.label.toLowerCase().replace(/s$/, "")}
      </button>
    </div>
  );
}

export function FieldInput({ field, value, onChange, all, lookups }: { field: Field; value: unknown; onChange: (v: unknown) => void; all: Record<string, unknown>; lookups: Lookups }) {
  const id = `f-${field.key}`;
  const str = (value ?? "") as string;
  switch (field.type) {
    case "textarea":
      return <textarea id={id} className="field resize-y leading-relaxed" rows={field.rows ?? 4} value={str} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
    case "number":
      return (
        <input
          id={id}
          type="number"
          className="field tabular-nums"
          value={Number.isFinite(value as number) ? (value as number) : 0}
          min={field.min}
          max={field.max}
          step={field.step ?? 1}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        />
      );
    case "image":
      return <ImageInput value={str} onChange={onChange} />;
    case "images": {
      const arr = (value as string[]) ?? [];
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {arr.map((src, i) => (
            <ImageInput key={i} compact value={src} onChange={(v) => onChange(arr.map((x, j) => (j === i ? v : x)))} />
          ))}
        </div>
      );
    }
    case "select": {
      const opts = field.optionsFrom
        ? [...(field.optionsFrom.empty ? [{ value: "", label: field.optionsFrom.empty }] : []), ...(lookups[field.optionsFrom.collection] ?? [])]
        : (field.options ?? []).map((o) => (typeof o === "string" ? { value: o, label: o } : o));
      return (
        <select id={id} className="field capitalize" value={str} onChange={(e) => onChange(e.target.value)}>
          {opts.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    }
    case "toggle":
      return (
        <div className="flex h-[46px] items-center">
          <Toggle checked={Boolean(value)} onChange={onChange} label={field.label} />
        </div>
      );
    case "date":
      return <input id={id} type="date" className="field" value={str.slice(0, 10)} onChange={(e) => onChange(e.target.value)} />;
    case "tags":
      return <TagsInput value={(value as string[]) ?? []} onChange={onChange} placeholder={field.placeholder} />;
    case "color":
      return (
        <div className="flex items-center gap-2">
          <label className="relative size-[46px] shrink-0 cursor-pointer overflow-hidden rounded-[0.9rem] ring-1 ring-line" style={{ background: str || "#000" }}>
            <input type="color" value={str || "#000000"} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" />
          </label>
          <input id={id} className="field font-mono uppercase" value={str} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
    case "slug":
      return (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted">/</span>
            <input id={id} className="field pl-7 font-mono text-[13px]" value={str} onChange={(e) => onChange(slugify(e.target.value))} />
          </div>
          {field.from && (
            <button type="button" onClick={() => onChange(slugify(String(all[field.from!] ?? "")))} className="h-[46px] shrink-0 rounded-[0.9rem] border border-line bg-white px-3 text-xs font-medium text-muted hover:text-ink">
              Generate
            </button>
          )}
        </div>
      );
    case "repeater":
      return <Repeater field={field} value={(value as Record<string, unknown>[]) ?? []} onChange={onChange} lookups={lookups} />;
    default:
      return <input id={id} type={field.type === "email" ? "email" : field.type === "url" ? "url" : "text"} className="field" value={str} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
  }
}

export function FieldGrid({ fields, value, onChange, lookups = {} }: { fields: Field[]; value: Record<string, unknown>; onChange: (v: Record<string, unknown>) => void; lookups?: Lookups }) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.key} className={clsx(f.full || f.type === "slug" || f.type === "image" || f.type === "repeater" || f.type === "images" || f.type === "textarea" ? "sm:col-span-2" : "")}>
          <Label htmlFor={`f-${f.key}`} help={f.help}>
            {f.label}
            {f.required && <span className="text-accent"> *</span>}
          </Label>
          <FieldInput
            field={f}
            value={value[f.key]}
            all={value}
            lookups={lookups}
            onChange={(v) => {
              const next = { ...value, [f.key]: v };
              // auto slug while slug is empty or still matching the old title
              const slugField = fields.find((x) => x.type === "slug" && x.from === f.key);
              if (slugField && (!value[slugField.key] || value[slugField.key] === slugify(String(value[f.key] ?? "")))) {
                next[slugField.key] = slugify(String(v));
              }
              onChange(next);
            }}
          />
        </div>
      ))}
    </div>
  );
}
