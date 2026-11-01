"use client";

import { Download, Plus, Receipt } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Campaign, Donation, Donor } from "@/lib/types";
import { api } from "@/lib/admin-api";
import { downloadCsv, fmtDateTime, inr, inrCompact } from "@/lib/admin-format";
import { Avatar, Badge, Button, Card, Empty, PageHeader, SearchInput, Select, SlideOver, useToast } from "./ui";
import { Label } from "./fields";

const STATUSES = ["completed", "pending", "failed", "refunded"] as const;
const PAGE = 25;

export default function Donations({ initial, donors, campaigns }: { initial: Donation[]; donors: Donor[]; campaigns: Campaign[] }) {
  const toast = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const [rows, setRows] = useState(initial);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [campaign, setCampaign] = useState("all");
  const [method, setMethod] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ donorId: "", name: "", email: "", amount: 5000, campaignId: "", method: "NetBanking" as Donation["method"], frequency: "one-time" as Donation["frequency"], date: new Date().toISOString().slice(0, 10) });

  useEffect(() => {
    if (params.get("new")) setAdding(true);
  }, [params]);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return rows.filter(
      (d) =>
        (status === "all" || d.status === status) &&
        (campaign === "all" || (d.campaignId || "general") === campaign) &&
        (method === "all" || d.method === method) &&
        (!from || d.createdAt.slice(0, 10) >= from) &&
        (!to || d.createdAt.slice(0, 10) <= to) &&
        (!n || [d.donorName, d.email, d.receiptNo].some((x) => x.toLowerCase().includes(n)))
    );
  }, [rows, q, status, campaign, method, from, to]);

  useEffect(() => setPage(1), [q, status, campaign, method, from, to]);

  const completed = filtered.filter((d) => d.status === "completed");
  const total = completed.reduce((s, d) => s + d.amount, 0);

  async function changeStatus(d: Donation, s: Donation["status"]) {
    setRows((r) => r.map((x) => (x.id === d.id ? { ...x, status: s } : x)));
    try {
      await api.update("donations", d.id, { status: s });
      toast(`Marked ${s}`);
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  async function add() {
    const donor = donors.find((d) => d.id === form.donorId);
    const name = donor?.name ?? form.name.trim();
    const email = donor?.email ?? form.email.trim();
    if (!name || !email) return toast("Pick a donor or enter name + email", "error");
    if (!(form.amount > 0)) return toast("Enter an amount", "error");
    setBusy(true);
    try {
      let donorId = donor?.id ?? "";
      if (!donor) {
        const created = await api.create<Donor>("donors", { name, email, phone: "", city: "", pan: "", type: "individual", tags: [], notes: "Added via offline donation" });
        donorId = created.id;
      }
      const c = campaigns.find((x) => x.id === form.campaignId);
      const d = await api.create<Donation>("donations", {
        donorId, donorName: name, email, amount: form.amount, frequency: form.frequency, campaignId: c?.id ?? "", campaignTitle: c?.title ?? "General Fund",
        method: form.method, status: "completed", receiptNo: `UMF/26-27/${1000 + rows.length + 1}`, createdAt: new Date(form.date + "T12:00:00").toISOString(),
      });
      if (c) await api.update<Campaign>("campaigns", c.id, { raised: c.raised + form.amount, donors: c.donors + 1 });
      setRows((r) => [d, ...r].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      setAdding(false);
      toast(`Recorded ${inr(form.amount)} from ${name}`);
      router.replace("/admin/donations");
      router.refresh();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setBusy(false);
    }
  }

  const shown = filtered.slice(0, page * PAGE);

  return (
    <>
      <PageHeader
        eyebrow="CRM"
        title="Donations"
        description="Every gift, online and offline. Filter, reconcile and export for your accountant."
        actions={
          <>
            <Button
              onClick={() =>
                downloadCsv(`donations-${new Date().toISOString().slice(0, 10)}.csv`, filtered as unknown as Record<string, unknown>[], [
                  { key: "receiptNo", label: "Receipt" }, { key: "createdAt", label: "Date" }, { key: "donorName", label: "Donor" }, { key: "email", label: "Email" },
                  { key: "amount", label: "Amount (INR)" }, { key: "frequency", label: "Frequency" }, { key: "campaignTitle", label: "Campaign" }, { key: "method", label: "Method" }, { key: "status", label: "Status" },
                ])
              }
            >
              <Download className="size-4" /> Export CSV
            </Button>
            <Button variant="primary" onClick={() => setAdding(true)}>
              <Plus className="size-4" /> Record donation
            </Button>
          </>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { l: "Raised (filtered)", v: inr(total) },
          { l: "Donations", v: filtered.length.toLocaleString("en-IN") },
          { l: "Average gift", v: inrCompact(completed.length ? total / completed.length : 0) },
          { l: "Pending / failed", v: `${filtered.filter((d) => d.status === "pending").length} / ${filtered.filter((d) => d.status === "failed").length}` },
        ].map((s) => (
          <Card key={s.l} className="p-4">
            <div className="text-[12.5px] text-muted">{s.l}</div>
            <div className="mt-1 text-xl font-semibold tracking-tight tabular-nums md:text-2xl">{s.v}</div>
          </Card>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-2 xl:flex-row xl:items-center">
        <SearchInput value={q} onChange={setQ} placeholder="Donor, email or receipt…" />
        <div className="flex flex-wrap gap-2">
          <Select value={status} onChange={setStatus} options={[{ value: "all", label: "All statuses" }, ...STATUSES.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))]} />
          <Select value={campaign} onChange={setCampaign} options={[{ value: "all", label: "All campaigns" }, ...campaigns.map((c) => ({ value: c.id, label: c.title })), { value: "general", label: "General Fund" }]} />
          <Select value={method} onChange={setMethod} options={[{ value: "all", label: "All methods" }, { value: "UPI", label: "UPI" }, { value: "Card", label: "Card" }, { value: "NetBanking", label: "NetBanking" }]} />
          <div className="flex w-full items-center gap-1.5 rounded-full border border-line bg-white px-3 sm:w-auto">
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-[38px] min-w-0 flex-1 bg-transparent text-[13px] outline-none" aria-label="From date" />
            <span className="text-muted">→</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-[38px] min-w-0 flex-1 bg-transparent text-[13px] outline-none" aria-label="To date" />
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <Empty title="No donations match" text="Adjust filters or date range." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[12px] text-muted">
                  <th className="px-4 py-3 font-medium">Donor</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">Campaign</th>
                  <th className="hidden px-4 py-3 font-medium lg:table-cell">Method</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Date</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((d) => (
                  <tr key={d.id} className="border-b border-line last:border-0 hover:bg-paper/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={d.donorName} size={32} />
                        <div className="min-w-0">
                          <div className="truncate font-medium">{d.donorName}</div>
                          <div className="flex items-center gap-1 truncate text-[12px] text-muted"><Receipt className="size-3" />{d.receiptNo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <div className="truncate">{d.campaignTitle}</div>
                      {d.frequency === "monthly" && <Badge tone="violet">monthly</Badge>}
                    </td>
                    <td className="hidden px-4 py-3 text-muted lg:table-cell">{d.method}</td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-muted sm:table-cell">{fmtDateTime(d.createdAt)}</td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <div className="relative inline-flex">
                        <Badge>{d.status}</Badge>
                        <select value={d.status} onChange={(e) => changeStatus(d, e.target.value as Donation["status"])} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Change status">
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-semibold tabular-nums">{inr(d.amount)}</div>
                      <div className="mt-0.5 sm:hidden"><Badge>{d.status}</Badge></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {shown.length < filtered.length && (
          <div className="border-t border-line p-3 text-center">
            <Button size="sm" onClick={() => setPage((p) => p + 1)}>Show more ({filtered.length - shown.length} left)</Button>
          </div>
        )}
      </Card>

      <SlideOver
        open={adding}
        onClose={() => { setAdding(false); router.replace("/admin/donations"); }}
        title="Record a donation"
        subtitle="For cheques, bank transfers and cash gifts. Campaign totals update automatically."
        footer={
          <>
            <span />
            <div className="flex gap-2">
              <Button onClick={() => setAdding(false)}>Cancel</Button>
              <Button variant="primary" loading={busy} onClick={add}>Record {inr(form.amount)}</Button>
            </div>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Existing donor</Label>
            <select className="field" value={form.donorId} onChange={(e) => setForm({ ...form, donorId: e.target.value })}>
              <option value="">— New donor —</option>
              {[...donors].sort((a, b) => a.name.localeCompare(b.name)).map((d) => <option key={d.id} value={d.id}>{d.name} · {d.email}</option>)}
            </select>
          </div>
          {!form.donorId && (
            <>
              <div><Label>Name</Label><input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Email</Label><input className="field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            </>
          )}
          <div className="sm:col-span-2">
            <Label>Amount (₹)</Label>
            <input className="field text-2xl font-semibold tabular-nums" type="number" min={1} value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[1000, 5000, 10000, 25000, 100000].map((a) => (
                <button key={a} type="button" onClick={() => setForm({ ...form, amount: a })} className={`rounded-full px-3 py-1 text-[13px] ring-1 transition ${form.amount === a ? "bg-ink text-white ring-ink" : "bg-white ring-line hover:ring-ink/30"}`}>{inrCompact(a)}</button>
              ))}
            </div>
          </div>
          <div>
            <Label>Campaign</Label>
            <select className="field" value={form.campaignId} onChange={(e) => setForm({ ...form, campaignId: e.target.value })}>
              <option value="">General Fund</option>
              {campaigns.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <Label>Method</Label>
            <select className="field" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value as Donation["method"] })}>
              <option>NetBanking</option><option>UPI</option><option>Card</option>
            </select>
          </div>
          <div>
            <Label>Frequency</Label>
            <select className="field" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value as Donation["frequency"] })}>
              <option value="one-time">One-time</option><option value="monthly">Monthly</option>
            </select>
          </div>
          <div><Label>Date received</Label><input className="field" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
        </div>
      </SlideOver>
    </>
  );
}
