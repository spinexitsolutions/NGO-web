"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Download, KanbanSquare, List, Mail, MapPin, Phone, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import clsx from "clsx";
import type { Volunteer } from "@/lib/types";
import { api } from "@/lib/admin-api";
import { downloadCsv, fmtDate, timeAgo } from "@/lib/admin-format";
import { Avatar, Badge, Button, Card, PageHeader, SearchInput, Segmented, SlideOver, useConfirm, useToast } from "./ui";

const COLS: { id: Volunteer["status"]; label: string; dot: string }[] = [
  { id: "new", label: "New", dot: "bg-accent" },
  { id: "contacted", label: "Contacted", dot: "bg-amber-500" },
  { id: "onboarded", label: "Onboarded", dot: "bg-emerald-500" },
  { id: "inactive", label: "Inactive", dot: "bg-ink/25" },
];

export default function Volunteers({ initial }: { initial: Volunteer[] }) {
  const toast = useToast();
  const { confirm, dialog } = useConfirm();
  const [rows, setRows] = useState(initial);
  const [view, setView] = useState<"board" | "list">("board");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Volunteer | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return rows.filter((v) => !n || [v.name, v.city, v.email, ...v.interests].some((x) => x.toLowerCase().includes(n)));
  }, [rows, q]);

  async function move(v: Volunteer, status: Volunteer["status"]) {
    if (v.status === status) return;
    setRows((r) => r.map((x) => (x.id === v.id ? { ...x, status } : x)));
    setSel((s) => (s?.id === v.id ? { ...s, status } : s));
    try {
      await api.update("volunteers", v.id, { status });
      toast(`${v.name.split(" ")[0]} → ${status}`);
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  async function del(v: Volunteer) {
    if (!(await confirm(`Remove ${v.name}'s application?`))) return;
    await api.remove("volunteers", v.id);
    setRows((r) => r.filter((x) => x.id !== v.id));
    setSel(null);
    toast("Application removed");
  }

  return (
    <>
      <PageHeader
        eyebrow="CRM"
        title="Volunteers"
        description="Move applicants through your pipeline — drag cards between columns or use the arrows."
        actions={
          <>
            <Segmented value={view} onChange={setView} options={[{ value: "board", label: <><KanbanSquare className="size-4" /> Board</> }, { value: "list", label: <><List className="size-4" /> List</> }]} />
            <Button
              onClick={() =>
                downloadCsv("volunteers.csv", filtered as unknown as Record<string, unknown>[], [
                  { key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "phone", label: "Phone" }, { key: "city", label: "City" },
                  { key: "interests", label: "Interests" }, { key: "availability", label: "Availability" }, { key: "status", label: "Status" }, { key: "createdAt", label: "Applied" },
                ])
              }
            >
              <Download className="size-4" /> Export
            </Button>
          </>
        }
      />
      <div className="mb-4">
        <SearchInput value={q} onChange={setQ} placeholder="Search name, city, skill…" />
      </div>

      {view === "board" ? (
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:px-0 xl:grid-cols-4">
          {COLS.map((col, ci) => {
            const items = filtered.filter((v) => v.status === col.id);
            return (
              <div
                key={col.id}
                onDragOver={(e) => { e.preventDefault(); setOver(col.id); }}
                onDragLeave={() => setOver((o) => (o === col.id ? null : o))}
                onDrop={() => {
                  const v = rows.find((x) => x.id === dragId);
                  if (v) move(v, col.id);
                  setDragId(null);
                  setOver(null);
                }}
                className={clsx("w-[82vw] shrink-0 snap-start rounded-3xl bg-paper-2/60 p-2.5 transition md:w-auto", over === col.id && "bg-paper-2 ring-2 ring-ink/10")}
              >
                <div className="flex items-center gap-2 px-2 pb-2.5 pt-1.5">
                  <span className={`size-2 rounded-full ${col.dot}`} />
                  <span className="text-[13px] font-semibold">{col.label}</span>
                  <span className="ml-auto rounded-full bg-white px-2 text-[12px] tabular-nums text-muted">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((v) => (
                    <motion.div
                      layout
                      layoutId={v.id}
                      key={v.id}
                      draggable
                      onDragStart={() => setDragId(v.id)}
                      onDragEnd={() => setDragId(null)}
                      onClick={() => setSel(v)}
                      className={clsx("cursor-grab rounded-2xl bg-white p-3.5 shadow-[0_1px_2px_rgb(0_0_0/0.05)] ring-1 ring-line transition hover:shadow-md active:cursor-grabbing", dragId === v.id && "opacity-40")}
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar name={v.name} size={30} />
                        <div className="min-w-0">
                          <div className="truncate text-[13.5px] font-medium">{v.name}</div>
                          <div className="truncate text-[12px] text-muted">{v.city} · {timeAgo(v.createdAt)}</div>
                        </div>
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {v.interests.map((i) => <span key={i} className="rounded-full bg-paper px-2 py-0.5 text-[11px] text-ink-2">{i}</span>)}
                      </div>
                      <div className="mt-2.5 flex items-center justify-between text-[11.5px] text-muted">
                        <span className="flex items-center gap-1"><Clock className="size-3" />{v.availability}</span>
                        <span className="flex" onClick={(e) => e.stopPropagation()}>
                          <button disabled={ci === 0} onClick={() => move(v, COLS[ci - 1].id)} className="grid size-6 place-items-center rounded-full hover:bg-paper disabled:opacity-25" aria-label="Move back"><ChevronLeft className="size-3.5" /></button>
                          <button disabled={ci === COLS.length - 1} onClick={() => move(v, COLS[ci + 1].id)} className="grid size-6 place-items-center rounded-full hover:bg-paper disabled:opacity-25" aria-label="Move forward"><ChevronRight className="size-3.5" /></button>
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  {items.length === 0 && <div className="rounded-2xl border border-dashed border-ink/10 py-8 text-center text-[12.5px] text-muted">Drop here</div>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[12px] text-muted">
                  <th className="px-4 py-3 font-medium">Volunteer</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">Interests</th>
                  <th className="hidden px-4 py-3 font-medium lg:table-cell">Availability</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Applied</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id} onClick={() => setSel(v)} className="cursor-pointer border-b border-line last:border-0 hover:bg-paper/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={v.name} size={32} />
                        <div className="min-w-0"><div className="truncate font-medium">{v.name}</div><div className="truncate text-[12px] text-muted">{v.city}</div></div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-muted md:table-cell">{v.interests.join(", ")}</td>
                    <td className="hidden px-4 py-3 text-muted lg:table-cell">{v.availability}</td>
                    <td className="hidden px-4 py-3 text-muted sm:table-cell">{fmtDate(v.createdAt)}</td>
                    <td className="px-4 py-3"><Badge>{v.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <SlideOver
        open={!!sel}
        onClose={() => setSel(null)}
        title={sel?.name ?? ""}
        subtitle={sel ? `Applied ${fmtDate(sel.createdAt)}` : ""}
        footer={
          sel && (
            <>
              <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => del(sel)}><Trash2 className="size-4" /> Remove</Button>
              <a href={`mailto:${sel.email}?subject=${encodeURIComponent("Volunteering with us")}`} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-medium text-white">
                <Mail className="size-4" /> Email {sel.name.split(" ")[0]}
              </a>
            </>
          )
        }
      >
        {sel && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={sel.name} size={60} />
              <div className="space-y-1 text-[13px] text-muted">
                <a href={`mailto:${sel.email}`} className="flex items-center gap-1.5 hover:text-ink"><Mail className="size-3.5" />{sel.email}</a>
                <a href={`tel:${sel.phone}`} className="flex items-center gap-1.5 hover:text-ink"><Phone className="size-3.5" />{sel.phone}</a>
                <div className="flex items-center gap-1.5"><MapPin className="size-3.5" />{sel.city}</div>
              </div>
            </div>
            <div>
              <div className="mb-2 text-[13px] font-medium">Pipeline stage</div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {COLS.map((c) => (
                  <button key={c.id} onClick={() => move(sel, c.id)} className={clsx("flex items-center justify-center gap-1.5 rounded-2xl py-2.5 text-[13px] font-medium ring-1 transition", sel.status === c.id ? "bg-ink text-white ring-ink" : "bg-white text-muted ring-line hover:text-ink")}>
                    <span className={`size-1.5 rounded-full ${c.dot}`} />{c.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-white p-3 ring-1 ring-line"><div className="text-[11.5px] text-muted">Availability</div><div className="mt-0.5 text-sm font-medium">{sel.availability}</div></div>
              <div className="rounded-2xl bg-white p-3 ring-1 ring-line"><div className="text-[11.5px] text-muted">Interests</div><div className="mt-0.5 text-sm font-medium">{sel.interests.join(", ")}</div></div>
            </div>
            <div>
              <div className="mb-2 text-[13px] font-medium">Their message</div>
              <blockquote className="rounded-2xl bg-white p-4 text-[15px] leading-relaxed ring-1 ring-line">“{sel.message}”</blockquote>
            </div>
          </div>
        )}
      </SlideOver>
      {dialog}
    </>
  );
}
