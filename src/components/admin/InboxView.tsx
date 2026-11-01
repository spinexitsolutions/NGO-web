"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Archive, ArrowLeft, CheckCheck, Inbox as InboxIcon, Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import type { Message } from "@/lib/types";
import { api } from "@/lib/admin-api";
import { fmtDateTime, timeAgo } from "@/lib/admin-format";
import { Avatar, Badge, Button, Card, Empty, PageHeader, SearchInput, Segmented, useConfirm, useToast } from "./ui";

type Folder = "inbox" | "unread" | "replied" | "archived";

export default function InboxView({ initial }: { initial: Message[] }) {
  const toast = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const { confirm, dialog } = useConfirm();
  const [rows, setRows] = useState(initial);
  const [folder, setFolder] = useState<Folder>("inbox");
  const [q, setQ] = useState("");
  const [selId, setSelId] = useState<string | null>(params.get("id"));

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return rows
      .filter((m) => (folder === "inbox" ? m.status !== "archived" : folder === "unread" ? m.status === "unread" : m.status === folder))
      .filter((m) => !n || [m.name, m.email, m.subject, m.message].some((x) => x.toLowerCase().includes(n)));
  }, [rows, folder, q]);

  const sel = rows.find((m) => m.id === selId) ?? null;

  async function setStatus(m: Message, status: Message["status"], silent = false) {
    setRows((r) => r.map((x) => (x.id === m.id ? { ...x, status } : x)));
    try {
      await api.update("messages", m.id, { status });
      if (!silent) toast(status === "archived" ? "Archived" : `Marked ${status}`);
      router.refresh();
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  useEffect(() => {
    if (sel && sel.status === "unread") setStatus(sel, "read", true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selId]);

  async function del(m: Message) {
    if (!(await confirm("This message will be deleted permanently."))) return;
    await api.remove("messages", m.id);
    setRows((r) => r.filter((x) => x.id !== m.id));
    setSelId(null);
    toast("Message deleted");
    router.refresh();
  }

  const unread = rows.filter((m) => m.status === "unread").length;

  return (
    <>
      <PageHeader eyebrow="CRM" title="Inbox" description="Messages from the contact form. Replies open in your email app and are tracked here." />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Segmented
          value={folder}
          onChange={setFolder}
          options={[
            { value: "inbox", label: "All" },
            { value: "unread", label: <>Unread {unread > 0 && <span className="tabular-nums opacity-70">{unread}</span>}</> },
            { value: "replied", label: "Replied" },
            { value: "archived", label: "Archived" },
          ]}
        />
        <div className="sm:ml-auto"><SearchInput value={q} onChange={setQ} placeholder="Search messages…" /></div>
      </div>

      <Card className="grid min-h-[560px] grid-cols-[minmax(0,1fr)] overflow-hidden lg:grid-cols-[380px_minmax(0,1fr)]">
        <ul className={clsx("border-line lg:border-r", sel && "hidden lg:block")}>
          {list.length === 0 && <Empty title="Nothing here" text="No messages in this folder." />}
          {list.map((m) => (
            <li key={m.id}>
              <button onClick={() => setSelId(m.id)} className={clsx("relative flex w-full gap-3 border-b border-line px-4 py-3.5 text-left transition", selId === m.id ? "bg-paper" : "hover:bg-paper/50")}>
                {selId === m.id && <motion.span layoutId="inbox-sel" className="absolute inset-y-0 left-0 w-[3px] bg-accent" />}
                <Avatar name={m.name} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className={clsx("truncate text-sm", m.status === "unread" ? "font-semibold" : "font-medium")}>{m.name}</span>
                    <span className="ml-auto shrink-0 text-[11.5px] text-muted">{timeAgo(m.createdAt)}</span>
                  </div>
                  <div className={clsx("truncate text-[13px]", m.status === "unread" ? "text-ink" : "text-ink-2")}>{m.subject}</div>
                  <div className="truncate text-[12.5px] text-muted">{m.message}</div>
                </div>
                {m.status === "unread" && <span className="mt-2 size-2 shrink-0 rounded-full bg-accent" />}
              </button>
            </li>
          ))}
        </ul>

        <div className={clsx("min-w-0", !sel && "hidden lg:block")}>
          <AnimatePresence mode="wait">
            {sel ? (
              <motion.div key={sel.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex h-full flex-col">
                <div className="flex items-center gap-1 border-b border-line px-3 py-2.5 md:px-5">
                  <button onClick={() => setSelId(null)} className="grid size-9 place-items-center rounded-full hover:bg-paper lg:hidden" aria-label="Back"><ArrowLeft className="size-4" /></button>
                  <Button size="sm" variant="ghost" onClick={() => setStatus(sel, sel.status === "unread" ? "read" : "unread")}>
                    {sel.status === "unread" ? <MailOpen className="size-3.5" /> : <Mail className="size-3.5" />} <span className="hidden sm:inline">{sel.status === "unread" ? "Mark read" : "Mark unread"}</span>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setStatus(sel, sel.status === "archived" ? "read" : "archived")}>
                    {sel.status === "archived" ? <InboxIcon className="size-3.5" /> : <Archive className="size-3.5" />} <span className="hidden sm:inline">{sel.status === "archived" ? "Unarchive" : "Archive"}</span>
                  </Button>
                  <Button size="sm" variant="ghost" className="hover:text-red-600" onClick={() => del(sel)}><Trash2 className="size-3.5" /></Button>
                  <div className="ml-auto"><Badge>{sel.status}</Badge></div>
                </div>
                <div className="flex-1 px-5 py-6 md:px-8">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{sel.subject}</h2>
                  <div className="mt-4 flex items-center gap-3">
                    <Avatar name={sel.name} size={40} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{sel.name}</div>
                      <div className="truncate text-[12.5px] text-muted">{sel.email} · {fmtDateTime(sel.createdAt)}</div>
                    </div>
                  </div>
                  <p className="mt-6 max-w-2xl whitespace-pre-wrap text-[15px] leading-relaxed text-ink-2">{sel.message}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-4 md:px-8">
                  <a
                    href={`mailto:${sel.email}?subject=${encodeURIComponent("Re: " + sel.subject)}&body=${encodeURIComponent(`Hi ${sel.name.split(" ")[0]},\n\nThank you for writing to us.\n\n\n— Team Ummeed\n\n> ${sel.message}`)}`}
                    onClick={() => setTimeout(() => setStatus(sel, "replied"), 300)}
                    className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-medium text-white hover:bg-ink-2"
                  >
                    <Reply className="size-4" /> Reply by email
                  </a>
                  {sel.status !== "replied" && (
                    <Button onClick={() => setStatus(sel, "replied")}><CheckCheck className="size-4" /> Mark as replied</Button>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="grid h-full place-items-center p-10 text-center text-muted">
                <div>
                  <InboxIcon className="mx-auto mb-3 size-8 opacity-40" />
                  <div className="text-sm">Select a message to read</div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </Card>
      {dialog}
    </>
  );
}
