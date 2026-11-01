"use client";

import { Check, Loader2, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Input } from "./Field";
import { useSubmit } from "./useSubmit";

export default function RegisterForm({ eventId, seatsLeft }: { eventId: string; seatsLeft: number }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", seats: 1 });
  const { state, error, submit } = useSubmit("/api/public/register");
  if (state === "done")
    return (
      <div className="py-6 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-xl bg-accent text-ink"><Check className="size-7" /></span>
        <p className="display mt-6 text-3xl">You&apos;re on the list!</p>
        <p className="mt-2 text-sm text-paper/60">We&apos;ve sent the details to {f.email}.</p>
      </div>
    );
  if (seatsLeft <= 0) return <p className="py-6 text-center text-paper/70">This event is full. Join the newsletter to hear about the next one.</p>;
  return (
    <form
      className="space-y-4 [&_label]:text-paper/80 [&_.field]:border-paper/15 [&_.field]:bg-paper/5 [&_.field]:text-paper [&_.field:focus]:border-paper"
      onSubmit={(e) => {
        e.preventDefault();
        submit({ ...f, eventId });
      }}
    >
      <Input label="Name" name="name" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <Input label="Email" name="email" type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <Input label="Phone" name="phone" optional value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
      <div className="flex items-center justify-between rounded-2xl bg-paper/5 px-4 py-3 ring-1 ring-paper/15">
        <span className="text-sm">Seats</span>
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Fewer seats" onClick={() => setF({ ...f, seats: Math.max(1, f.seats - 1) })} className="grid size-8 place-items-center rounded-full bg-paper/10"><Minus className="size-3.5" /></button>
          <span className="w-4 text-center tabular-nums">{f.seats}</span>
          <button type="button" aria-label="More seats" onClick={() => setF({ ...f, seats: Math.min(Math.min(10, seatsLeft), f.seats + 1) })} className="grid size-8 place-items-center rounded-full bg-paper/10"><Plus className="size-3.5" /></button>
        </div>
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button type="submit" disabled={state === "loading"} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent font-semibold text-ink transition-transform active:scale-[0.98]">
        {state === "loading" && <Loader2 className="size-4 animate-spin" />} Reserve {f.seats > 1 ? `${f.seats} spots` : "my spot"}
      </button>
    </form>
  );
}
