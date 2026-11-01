"use client";

import { Building2, Download, Mail, MapPin, Phone, Plus, Trash2, User } from "lucide-react";
import { useMemo, useState } from "react";
import type { Donation, Donor } from "@/lib/types";
import { api } from "@/lib/admin-api";
import { downloadCsv, fmtDate, inr, inrCompact } from "@/lib/admin-format";
import { Avatar, Badge, Button, Card, Empty, PageHeader, SearchInput, Select, SlideOver, useConfirm, useToast } from "./ui";
import { Label, TagsInput } from "./fields";

const blank = (): Donor => ({ id: "", name: "", email: "", phone: "", city: "", pan: "", type: "individual", tags: [], notes: "", createdAt: "" });

export default function Donors({ initialDonors, donations }: { initialDonors: Donor[]; donations: Donation[] }) {
  const toast = useToast();
  const { confirm, dialog } = useConfirm();
  const [donors, setDonors] = useState(initialDonors);
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [tag, setTag] = useState("all");
  const [sort, setSort] = useState("ltv");
  const [sel, setSel] = useState<Donor | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const stats = useMemo(() => {
    const m = new Map<string, { total: number; count: number; last: string }>();
    for (const d of donations) {
      if (d.status !== "completed") continue;
      const s = m.get(d.donorId) ?? { total: 0, count: 0, last: "" };
      s.total += d.amount;
      s.count += 1;
      if (d.createdAt > s.last) s.last = d.createdAt;
      m.set(d.donorId, s);
    }
    return m;
  }, [donations]);

  const allTags = useMemo(() => [...new Set(donors.flatMap((d) => d.tags))].sort(), [donors]);

  const rows = useMemo(() => {
    const n = q.trim().toLowerCase();
    return donors
      .filter((d) => (type === "all" || d.type === type) && (tag === "all" || d.tags.includes(tag)))
      .filter((d) => !n || [d.name, d.email, d.city, d.phone].some((x) => x.toLowerCase().includes(n)))
      .sort((a, b) => {
        if (sort === "ltv") return (stats.get(b.id)?.total ?? 0) - (stats.get(a.id)?.total ?? 0);
        if (sort === "recent") return (stats.get(b.id)?.last ?? "").localeCompare(stats.get(a.id)?.last ?? "");
        return a.name.localeCompare(b.name);
      });
  }, [donors, q, type, tag, sort, stats]);

  const history = sel ? donations.filter((d) => d.donorId === sel.id) : [];
  const ltv = sel ? stats.get(sel.id)?.total ?? 0 : 0;

  async function save() {
    if (!sel) return;
    if (!sel.name.trim() || !sel.email.trim()) return toast("Name and email are required", "error");
    setSaving(true);
    try {
      if (isNew) {
        const { id: _i, createdAt: _c, ...body } = sel;
        void _i; void _c;
        const created = await api.create<Donor>("donors", body);
        setDonors((d) => [created, ...d]);
        toast("Donor added");
      } else {
        const updated = await api.update<Donor>("donors", sel.id, sel);
        setDonors((d) => d.map((x) => (x.id === updated.id ? updated : x)));
        toast("Donor updated");
      }
      setSel(null);
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function del(d: Donor) {
    if (!(await confirm(`${d.name} will be removed from your CRM. Their donation records stay.`))) return;
    await api.remove("donors", d.id);
    setDonors((x) => x.filter((y) => y.id !== d.id));
    setSel(null);
    toast("Donor removed");
  }

  const set = <K extends keyof Donor>(k: K, v: Donor[K]) => setSel((s) => (s ? { ...s, [k]: v } : s));

  return (
    <>
      <PageHeader
        eyebrow="CRM"
        title="Donors"
        description="Everyone who has given to your cause — with lifetime value, history and notes."
        actions={
          <>
            <Button
              onClick={() =>
                downloadCsv(
                  "donors.csv",
                  rows.map((d) => ({ ...d, ltv: stats.get(d.id)?.total ?? 0, gifts: stats.get(d.id)?.count ?? 0 })),
                  [
                    { key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "phone", label: "Phone" }, { key: "city", label: "City" },
                    { key: "pan", label: "PAN" }, { key: "type", label: "Type" }, { key: "tags", label: "Tags" }, { key: "ltv", label: "Lifetime value (INR)" }, { key: "gifts", label: "Gifts" },
                  ]
                )
              }
            >
              <Download className="size-4" /> Export
            </Button>
            <Button variant="primary" onClick={() => { setIsNew(true); setSel(blank()); }}>
              <Plus className="size-4" /> Add donor
            </Button>
          </>
        }
      />

      <div className="mb-4 grid grid-cols-3 gap-3">
        {[
          { l: "Total donors", v: donors.length.toLocaleString("en-IN") },
          { l: "Corporate", v: donors.filter((d) => d.type === "corporate").length.toString() },
          { l: "Monthly givers", v: donors.filter((d) => d.tags.includes("Monthly")).length.toString() },
        ].map((s) => (
          <Card key={s.l} className="p-4">
            <div className="text-[12.5px] text-muted">{s.l}</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{s.v}</div>
          </Card>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <SearchInput value={q} onChange={setQ} placeholder="Search name, email, city…" />
        <div className="flex flex-wrap gap-2">
          <Select value={type} onChange={setType} options={[{ value: "all", label: "All types" }, { value: "individual", label: "Individual" }, { value: "corporate", label: "Corporate" }]} />
          <Select value={tag} onChange={setTag} options={[{ value: "all", label: "All tags" }, ...allTags.map((t) => ({ value: t, label: t }))]} />
          <Select value={sort} onChange={setSort} options={[{ value: "ltv", label: "Sort: Lifetime value" }, { value: "recent", label: "Sort: Last gift" }, { value: "name", label: "Sort: Name" }]} />
        </div>
      </div>

      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <Empty title="No donors match" text="Try clearing the filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[12px] text-muted">
                  <th className="px-4 py-3 font-medium">Donor</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">City</th>
                  <th className="hidden px-4 py-3 font-medium lg:table-cell">Tags</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Last gift</th>
                  <th className="px-4 py-3 text-right font-medium">Lifetime</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => {
                  const s = stats.get(d.id);
                  return (
                    <tr key={d.id} onClick={() => { setIsNew(false); setSel(structuredClone(d)); }} className="cursor-pointer border-b border-line last:border-0 hover:bg-paper/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={d.name} size={34} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 truncate font-medium">
                              {d.name} {d.type === "corporate" && <Building2 className="size-3.5 text-blue-600" />}
                            </div>
                            <div className="truncate text-[12.5px] text-muted">{d.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 text-muted md:table-cell">{d.city}</td>
                      <td className="hidden px-4 py-3 lg:table-cell">
                        <div className="flex gap-1">{d.tags.map((t) => <Badge key={t} tone={t === "Monthly" ? "violet" : t === "CSR" ? "blue" : "amber"}>{t}</Badge>)}</div>
                      </td>
                      <td className="hidden px-4 py-3 text-muted sm:table-cell">{s ? fmtDate(s.last) : "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="font-semibold tabular-nums">{inrCompact(s?.total ?? 0)}</div>
                        <div className="text-[11.5px] text-muted">{s?.count ?? 0} gifts</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <SlideOver
        open={!!sel}
        onClose={() => setSel(null)}
        title={isNew ? "New donor" : sel?.name ?? ""}
        subtitle={isNew ? "Add an offline or major donor to the CRM" : `Donor since ${fmtDate(sel?.createdAt ?? "")}`}
        footer={
          <>
            {!isNew && sel ? (
              <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => del(sel)}>
                <Trash2 className="size-4" /> Delete
              </Button>
            ) : <span />}
            <div className="flex gap-2">
              <Button onClick={() => setSel(null)}>Cancel</Button>
              <Button variant="primary" loading={saving} onClick={save}>{isNew ? "Add donor" : "Save"}</Button>
            </div>
          </>
        }
      >
        {sel && (
          <div className="space-y-6">
            {!isNew && (
              <>
                <div className="flex items-center gap-4">
                  <Avatar name={sel.name} size={60} />
                  <div className="min-w-0 space-y-1 text-[13px] text-muted">
                    <a href={`mailto:${sel.email}`} className="flex items-center gap-1.5 hover:text-ink"><Mail className="size-3.5" />{sel.email}</a>
                    {sel.phone && <a href={`tel:${sel.phone}`} className="flex items-center gap-1.5 hover:text-ink"><Phone className="size-3.5" />{sel.phone}</a>}
                    {sel.city && <div className="flex items-center gap-1.5"><MapPin className="size-3.5" />{sel.city}</div>}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { l: "Lifetime value", v: inr(ltv) },
                    { l: "Gifts", v: String(stats.get(sel.id)?.count ?? 0) },
                    { l: "Average", v: inrCompact(ltv / (stats.get(sel.id)?.count || 1)) },
                  ].map((s) => (
                    <div key={s.l} className="rounded-2xl bg-white p-3 ring-1 ring-line">
                      <div className="text-[11.5px] text-muted">{s.l}</div>
                      <div className="mt-0.5 font-semibold tabular-nums">{s.v}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><Label>Name *</Label><input className="field" value={sel.name} onChange={(e) => set("name", e.target.value)} /></div>
              <div><Label>Email *</Label><input className="field" type="email" value={sel.email} onChange={(e) => set("email", e.target.value)} /></div>
              <div><Label>Phone</Label><input className="field" value={sel.phone} onChange={(e) => set("phone", e.target.value)} /></div>
              <div><Label>City</Label><input className="field" value={sel.city} onChange={(e) => set("city", e.target.value)} /></div>
              <div><Label>PAN (for 80G)</Label><input className="field font-mono uppercase" value={sel.pan} onChange={(e) => set("pan", e.target.value.toUpperCase())} /></div>
              <div className="sm:col-span-2">
                <Label>Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["individual", "corporate"] as const).map((t) => (
                    <button key={t} type="button" onClick={() => set("type", t)} className={`flex items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-medium capitalize transition ${sel.type === t ? "border-ink bg-ink text-white" : "border-line bg-white text-muted hover:text-ink"}`}>
                      {t === "individual" ? <User className="size-4" /> : <Building2 className="size-4" />} {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2"><Label help="e.g. Monthly, Major donor, CSR, Board">Tags</Label><TagsInput value={sel.tags} onChange={(v) => set("tags", v)} /></div>
              <div className="sm:col-span-2"><Label>Notes</Label><textarea className="field" rows={3} value={sel.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Relationship notes, preferences, follow-ups…" /></div>
            </div>

            {!isNew && (
              <div>
                <div className="mb-2 text-[13px] font-medium">Donation history</div>
                {history.length === 0 ? (
                  <p className="rounded-2xl bg-white p-4 text-sm text-muted ring-1 ring-line">No donations yet.</p>
                ) : (
                  <ul className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
                    {history.map((d) => (
                      <li key={d.id} className="flex items-center gap-3 border-b border-line px-4 py-3 text-sm last:border-0">
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium">{d.campaignTitle}</div>
                          <div className="text-[12px] text-muted">{fmtDate(d.createdAt)} · {d.method} · {d.receiptNo}</div>
                        </div>
                        <Badge>{d.status}</Badge>
                        <div className="w-20 text-right font-semibold tabular-nums">{inrCompact(d.amount)}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </SlideOver>
      {dialog}
    </>
  );
}
