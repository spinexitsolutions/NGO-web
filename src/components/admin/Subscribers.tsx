"use client";

import { Download, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { Subscriber } from "@/lib/types";
import { api } from "@/lib/admin-api";
import { downloadCsv, fmtDate } from "@/lib/admin-format";
import { Badge, Button, Card, Empty, PageHeader, SearchInput, Segmented, Toggle, useConfirm, useToast } from "./ui";

export default function Subscribers({ initial }: { initial: Subscriber[] }) {
  const toast = useToast();
  const { confirm, dialog } = useConfirm();
  const [rows, setRows] = useState(initial);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "unsubscribed">("all");
  const [email, setEmail] = useState("");

  const list = useMemo(() => rows.filter((s) => (status === "all" || s.status === status) && s.email.includes(q.trim().toLowerCase())), [rows, q, status]);
  const active = rows.filter((s) => s.status === "active").length;
  const growth = rows.filter((s) => Date.now() - new Date(s.createdAt).getTime() < 30 * 86400000).length;

  async function toggle(s: Subscriber) {
    const next = s.status === "active" ? "unsubscribed" : "active";
    setRows((r) => r.map((x) => (x.id === s.id ? { ...x, status: next } : x)));
    await api.update("subscribers", s.id, { status: next }).catch((e) => toast(e.message, "error"));
  }
  async function add(e: React.FormEvent) {
    e.preventDefault();
    const v = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(v)) return toast("Enter a valid email", "error");
    if (rows.some((r) => r.email === v)) return toast("Already subscribed", "error");
    const created = await api.create<Subscriber>("subscribers", { email: v, status: "active" });
    setRows((r) => [created, ...r]);
    setEmail("");
    toast("Subscriber added");
  }
  async function del(s: Subscriber) {
    if (!(await confirm(`Delete ${s.email}?`))) return;
    await api.remove("subscribers", s.id);
    setRows((r) => r.filter((x) => x.id !== s.id));
    toast("Deleted");
  }

  return (
    <>
      <PageHeader
        eyebrow="CRM"
        title="Newsletter"
        description="People who signed up for updates from the website footer."
        actions={
          <Button onClick={() => downloadCsv("subscribers.csv", list as unknown as Record<string, unknown>[], [{ key: "email", label: "Email" }, { key: "status", label: "Status" }, { key: "createdAt", label: "Joined" }])}>
            <Download className="size-4" /> Export CSV
          </Button>
        }
      />
      <div className="mb-4 grid grid-cols-3 gap-3">
        {[{ l: "Active", v: active }, { l: "Unsubscribed", v: rows.length - active }, { l: "Joined in 30d", v: growth }].map((s) => (
          <Card key={s.l} className="p-4"><div className="text-[12.5px] text-muted">{s.l}</div><div className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{s.v}</div></Card>
        ))}
      </div>
      <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center">
        <SearchInput value={q} onChange={setQ} placeholder="Search email…" />
        <Segmented value={status} onChange={setStatus} options={[{ value: "all", label: "All" }, { value: "active", label: "Active" }, { value: "unsubscribed", label: "Unsubscribed" }]} />
        <form onSubmit={add} className="flex gap-2 lg:ml-auto">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="add@email.com" className="h-10 w-full rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-ink/40 lg:w-56" />
          <Button variant="primary"><Plus className="size-4" /> Add</Button>
        </form>
      </div>
      <Card className="overflow-hidden">
        {list.length === 0 ? <Empty title="No subscribers" /> : (
          <ul>
            {list.map((s) => (
              <li key={s.id} className="group flex items-center gap-3 border-b border-line px-4 py-3 text-sm last:border-0">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{s.email}</div>
                  <div className="text-[12px] text-muted">Joined {fmtDate(s.createdAt)}</div>
                </div>
                <span className="hidden sm:inline"><Badge>{s.status}</Badge></span>
                <Toggle checked={s.status === "active"} onChange={() => toggle(s)} label="Subscribed" />
                <button onClick={() => del(s)} className="grid size-8 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 className="size-3.5" /></button>
              </li>
            ))}
          </ul>
        )}
      </Card>
      {dialog}
    </>
  );
}
