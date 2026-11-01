"use client";

import { CalendarDays, Download, MapPin, Trash2 } from "lucide-react";
import { useState } from "react";
import type { EventItem, Registration } from "@/lib/types";
import { api } from "@/lib/admin-api";
import { downloadCsv, fmtDate } from "@/lib/admin-format";
import { Avatar, Button, Card, Empty, PageHeader, useConfirm, useToast } from "./ui";

export default function Registrations({ initial, events }: { initial: Registration[]; events: EventItem[] }) {
  const toast = useToast();
  const { confirm, dialog } = useConfirm();
  const [rows, setRows] = useState(initial);
  const [openId, setOpenId] = useState<string | null>(events[0]?.id ?? null);

  async function del(r: Registration) {
    if (!(await confirm(`Cancel ${r.name}'s registration?`))) return;
    await api.remove("registrations", r.id);
    setRows((x) => x.filter((y) => y.id !== r.id));
    toast("Registration cancelled");
  }

  const cols = [{ key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "phone", label: "Phone" }, { key: "seats", label: "Seats" }, { key: "createdAt", label: "Registered" }];

  return (
    <>
      <PageHeader eyebrow="CRM" title="Event registrations" description="Who's coming, and how full each event is." />
      <div className="space-y-4">
        {events.length === 0 && <Card><Empty title="No events yet" /></Card>}
        {events.map((ev) => {
          const regs = rows.filter((r) => r.eventId === ev.id);
          const seats = regs.reduce((s, r) => s + r.seats, 0);
          const pct = Math.min(100, Math.round((seats / (ev.capacity || 1)) * 100));
          const open = openId === ev.id;
          return (
            <Card key={ev.id} className="overflow-hidden">
              <button onClick={() => setOpenId(open ? null : ev.id)} className="flex w-full flex-col gap-4 p-4 text-left sm:flex-row sm:items-center md:p-5">
                <img src={ev.image} alt="" className="h-28 w-full rounded-2xl object-cover sm:size-16" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold tracking-tight">{ev.title}</div>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 text-[12.5px] text-muted">
                    <span className="flex items-center gap-1"><CalendarDays className="size-3" />{fmtDate(ev.date)} · {ev.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="size-3" />{ev.location}</span>
                  </div>
                </div>
                <div className="w-full sm:w-56">
                  <div className="mb-1 flex justify-between text-[12.5px] tabular-nums"><span className="font-medium">{seats} / {ev.capacity} seats</span><span className="text-muted">{pct}%</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-paper"><div className={`h-full rounded-full ${pct > 90 ? "bg-red-500" : "bg-accent"}`} style={{ width: `${pct}%` }} /></div>
                </div>
              </button>
              {open && (
                <div className="border-t border-line">
                  <div className="flex items-center justify-between px-4 py-2.5 md:px-5">
                    <span className="text-[13px] text-muted">{regs.length} registrations</span>
                    <Button size="sm" onClick={() => downloadCsv(`${ev.slug}-registrations.csv`, regs as unknown as Record<string, unknown>[], cols)}><Download className="size-3.5" /> CSV</Button>
                  </div>
                  {regs.length === 0 ? <p className="px-5 pb-5 text-sm text-muted">No registrations yet.</p> : (
                    <ul>
                      {regs.map((r) => (
                        <li key={r.id} className="flex items-center gap-3 border-t border-line px-4 py-2.5 text-sm md:px-5">
                          <Avatar name={r.name} size={30} />
                          <div className="min-w-0 flex-1"><div className="truncate font-medium">{r.name}</div><div className="truncate text-[12px] text-muted">{r.email} · {r.phone}</div></div>
                          <span className="rounded-full bg-paper px-2 py-0.5 text-[12px] tabular-nums">{r.seats} seat{r.seats > 1 ? "s" : ""}</span>
                          <span className="hidden text-[12px] text-muted sm:inline">{fmtDate(r.createdAt)}</span>
                          <button onClick={() => del(r)} className="grid size-8 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-600" aria-label="Cancel registration"><Trash2 className="size-3.5" /></button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
      {dialog}
    </>
  );
}
