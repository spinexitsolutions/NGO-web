"use client";

import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { Chip, Input, Label, Textarea } from "./Field";
import { useSubmit } from "./useSubmit";

const TOPICS = ["General enquiry", "Donation / 80G receipt", "CSR partnership", "Volunteering", "Media"];

export default function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", subject: TOPICS[0], message: "" });
  const { state, error, submit } = useSubmit("/api/public/contact");
  if (state === "done")
    return (
      <div className="rounded-xl3 bg-card p-10 text-center ring-1 ring-ink/5">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-accent text-white"><Check className="size-7" /></span>
        <p className="display mt-6 text-4xl">Message received.</p>
        <p className="mt-3 text-muted">We reply to every message within two working days.</p>
      </div>
    );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(f);
      }}
      className="space-y-6 rounded-xl3 bg-card p-6 ring-1 ring-ink/5 md:p-10"
    >
      <div>
        <Label>What&apos;s it about?</Label>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <Chip key={t} active={f.subject === t} onClick={() => setF({ ...f, subject: t })}>{t}</Chip>
          ))}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Name" name="name" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <Input label="Email" name="email" type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      </div>
      <Textarea label="Message" name="message" required value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
      {error && <p className="text-sm text-accent">{error}</p>}
      <button type="submit" disabled={state === "loading"} className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 font-semibold text-paper transition-colors hover:bg-accent sm:w-auto sm:px-10">
        {state === "loading" && <Loader2 className="size-4 animate-spin" />} Send message
      </button>
    </form>
  );
}
