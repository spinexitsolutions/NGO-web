"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, ExternalLink, LayoutGrid, List, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { SCHEMAS, type Column } from "@/lib/admin-schemas";
import { api } from "@/lib/admin-api";
import { fmtDate, inrCompact } from "@/lib/admin-format";
import { Badge, Button, Card, Empty, PageHeader, SearchInput, Segmented, Select, SlideOver, Toggle, useConfirm, useToast } from "./ui";
import { FieldGrid, type Lookups } from "./fields";

type Row = Record<string, unknown> & { id: string };

function Cell({ col, row, onToggle }: { col: Column; row: Row; onToggle: (key: string, v: boolean) => void }) {
  const v = row[col.key];
  switch (col.kind) {
    case "image":
      return v ? <img src={String(v)} alt="" className="size-11 rounded-xl object-cover ring-1 ring-line" /> : <div className="size-11 rounded-xl bg-paper" />;
    case "badge":
      return <Badge>{String(v ?? "")}</Badge>;
    case "date":
      return <span className="whitespace-nowrap text-muted">{fmtDate(String(v ?? ""))}</span>;
    case "money":
      return <span className="tabular-nums">{inrCompact(Number(v))}</span>;
    case "number":
      return <span className="tabular-nums">{Number(v ?? 0).toLocaleString("en-IN")}</span>;
    case "muted":
      return <span className="line-clamp-1 text-muted">{String(v ?? "")}</span>;
    case "toggle":
      return (
        <span onClick={(e) => e.stopPropagation()}>
          <Toggle checked={Boolean(v)} onChange={(b) => onToggle(col.key, b)} label={col.label} />
        </span>
      );
    case "progress": {
      const goal = Number(row.goal) || 1;
      const raised = Number(row.raised) || 0;
      const pct = Math.min(100, Math.round((raised / goal) * 100));
      return (
        <div className="w-36">
          <div className="mb-1 flex justify-between text-xs tabular-nums">
            <span className="font-medium">{inrCompact(raised)}</span>
            <span className="text-muted">{pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-paper">
            <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
        </div>
      );
    }
    default:
      return <span className="line-clamp-1 font-medium">{String(v ?? "")}</span>;
  }
}

export default function ResourceManager({ name, initial, lookups = {} }: { name: string; initial: Row[]; lookups?: Lookups }) {
  const schema = SCHEMAS[name]!;
  const toast = useToast();
  const { confirm, dialog } = useConfirm();
  const [rows, setRows] = useState<Row[]>(initial);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState<"table" | "grid">(schema.view);
  const [editing, setEditing] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && schema.filter && r[schema.filter.key] !== filter) return false;
      if (!needle) return true;
      return schema.searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(needle));
    });
  }, [rows, q, filter, schema]);

  const canReorder = schema.reorderable && !q && filter === "all";

  function openNew() {
    setIsNew(true);
    setEditing({ id: "", ...structuredClone(schema.defaults) } as Row);
  }
  function openEdit(r: Row) {
    setIsNew(false);
    setEditing(structuredClone(r));
  }

  async function save() {
    if (!editing) return;
    const missing = schema.fields.find((f) => f.required && !String(editing[f.key] ?? "").trim());
    if (missing) return toast(`${missing.label} is required`, "error");
    setSaving(true);
    try {
      if (isNew) {
        const { id: _omit, ...body } = editing;
        void _omit;
        const created = await api.create<Row>(name, body);
        setRows((r) => (schema.reorderable ? [...r, created] : [created, ...r]));
        if (schema.reorderable) {
          // server unshifts — persist our order with the new item at the end
          await api.replace(name, [...rows, created]);
        }
        toast(`${schema.singular} created`);
      } else {
        const updated = await api.update<Row>(name, editing.id, editing);
        setRows((r) => r.map((x) => (x.id === updated.id ? updated : x)));
        toast("Changes saved");
      }
      setEditing(null);
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function del(r: Row) {
    if (!(await confirm(`“${String(r[schema.titleKey] || "This item")}” will be permanently deleted.`))) return;
    const prev = rows;
    setRows((x) => x.filter((y) => y.id !== r.id));
    setEditing(null);
    try {
      await api.remove(name, r.id);
      toast(`${schema.singular} deleted`);
    } catch (e) {
      setRows(prev);
      toast((e as Error).message, "error");
    }
  }

  async function move(i: number, d: number) {
    const next = [...rows];
    const [x] = next.splice(i, 1);
    next.splice(i + d, 0, x);
    setRows(next);
    try {
      await api.replace(name, next);
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  async function quickToggle(r: Row, key: string, v: boolean) {
    setRows((x) => x.map((y) => (y.id === r.id ? { ...y, [key]: v } : y)));
    try {
      await api.update(name, r.id, { [key]: v });
      toast(v ? "Now visible" : "Hidden");
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  const allocationTotal = name === "allocation" ? rows.reduce((s, r) => s + Number(r.value || 0), 0) : null;

  return (
    <>
      <PageHeader
        eyebrow={schema.group === "Site" ? "Site" : "Content"}
        title={schema.title}
        description={schema.description}
        actions={
          <Button variant="primary" onClick={openNew}>
            <Plus className="size-4" /> New {schema.singular.toLowerCase()}
          </Button>
        }
      />

      {allocationTotal !== null && (
        <div className={clsx("mb-5 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm", allocationTotal === 100 ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800")}>
          {allocationTotal === 100 ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />}
          Total allocation is <b className="tabular-nums">{allocationTotal}%</b>
          {allocationTotal !== 100 && " — it should add up to exactly 100%."}
          <div className="ml-auto hidden h-2 w-48 overflow-hidden rounded-full bg-white/70 sm:flex">
            {rows.map((r, i) => (
              <div key={r.id} style={{ width: `${Number(r.value)}%`, background: `hsl(${(i * 47 + 12) % 360} 70% 55%)` }} />
            ))}
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <SearchInput value={q} onChange={setQ} placeholder={`Search ${schema.title.toLowerCase()}…`} />
        {schema.filter && (
          <Select
            value={filter}
            onChange={setFilter}
            options={[{ value: "all", label: `All ${schema.filter.label.toLowerCase()}` }, ...schema.filter.options.map((o) => ({ value: o, label: o[0].toUpperCase() + o.slice(1) }))]}
          />
        )}
        <div className="flex items-center gap-2 sm:ml-auto">
          <span className="text-sm text-muted tabular-nums">{filtered.length} items</span>
          {schema.imageKey && (
            <Segmented
              value={view}
              onChange={setView}
              options={[
                { value: "table", label: <List className="size-4" /> },
                { value: "grid", label: <LayoutGrid className="size-4" /> },
              ]}
            />
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <Empty title={rows.length ? "No matches" : `No ${schema.title.toLowerCase()} yet`} text={rows.length ? "Try a different search or filter." : "Create the first one to get started."} action={!rows.length && <Button onClick={openNew}>Create {schema.singular.toLowerCase()}</Button>} />
        </Card>
      ) : view === "grid" && schema.imageKey ? (
        <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence initial={false}>
            {filtered.map((r, i) => (
              <motion.div key={r.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}>
                <Card className="group overflow-hidden transition hover:shadow-xl hover:shadow-black/5">
                  <button onClick={() => openEdit(r)} className="relative block aspect-[4/3] w-full overflow-hidden bg-paper text-left">
                    {r[schema.imageKey!] ? <img src={String(r[schema.imageKey!])} alt="" className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-[1.04]" /> : null}
                    <div className="absolute left-3 top-3 flex gap-1.5">
                      {"status" in r && <Badge>{String(r.status)}</Badge>}
                      {Boolean(r.urgent) && <Badge tone="red">urgent</Badge>}
                    </div>
                  </button>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-semibold tracking-tight">{String(r[schema.titleKey] || "Untitled")}</div>
                        {schema.subtitleKey && <p className="mt-0.5 line-clamp-2 text-[13px] text-muted">{String(r[schema.subtitleKey] ?? "")}</p>}
                      </div>
                    </div>
                    {name === "campaigns" && (
                      <div className="mt-3">
                        <Cell col={{ key: "raised", label: "", kind: "progress" }} row={r} onToggle={() => {}} />
                      </div>
                    )}
                    <div className="mt-4 flex items-center gap-1">
                      <Button size="sm" onClick={() => openEdit(r)}>
                        <Pencil className="size-3.5" /> Edit
                      </Button>
                      {schema.previewHref && (
                        <a href={schema.previewHref(r)} target="_blank" className="grid size-8 place-items-center rounded-full text-muted hover:bg-paper hover:text-ink" aria-label="Preview">
                          <ExternalLink className="size-3.5" />
                        </a>
                      )}
                      <div className="ml-auto flex">
                        {canReorder && (
                          <>
                            <button disabled={i === 0} onClick={() => move(i, -1)} className="grid size-8 place-items-center rounded-full text-muted hover:bg-paper disabled:opacity-30" aria-label="Move earlier">
                              <ArrowUp className="size-3.5" />
                            </button>
                            <button disabled={i === filtered.length - 1} onClick={() => move(i, 1)} className="grid size-8 place-items-center rounded-full text-muted hover:bg-paper disabled:opacity-30" aria-label="Move later">
                              <ArrowDown className="size-3.5" />
                            </button>
                          </>
                        )}
                        <button onClick={() => del(r)} className="grid size-8 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-600" aria-label="Delete">
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[12px] text-muted">
                  {canReorder && <th className="w-16 py-3 pl-4" />}
                  {schema.columns.map((c, ci) => (
                    <th key={c.key + ci} className={clsx("px-4 py-3 font-medium", c.hideOnMobile && "hidden md:table-cell", c.kind === "image" && "w-16")}>
                      {c.label}
                    </th>
                  ))}
                  <th className="w-24 px-4" />
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {filtered.map((r, i) => (
                    <motion.tr
                      layout="position"
                      key={r.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => openEdit(r)}
                      className="group cursor-pointer border-b border-line last:border-0 hover:bg-paper/50"
                    >
                      {canReorder && (
                        <td className="py-2 pl-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex flex-col">
                            <button disabled={i === 0} onClick={() => move(i, -1)} className="grid h-5 w-7 place-items-center rounded text-muted hover:text-ink disabled:opacity-20" aria-label="Move up">
                              <ArrowUp className="size-3.5" />
                            </button>
                            <button disabled={i === filtered.length - 1} onClick={() => move(i, 1)} className="grid h-5 w-7 place-items-center rounded text-muted hover:text-ink disabled:opacity-20" aria-label="Move down">
                              <ArrowDown className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                      {schema.columns.map((c, ci) => (
                        <td key={c.key + ci} className={clsx("max-w-[340px] px-4 py-3", c.hideOnMobile && "hidden md:table-cell")}>
                          <Cell col={c} row={r} onToggle={(k, v) => quickToggle(r, k, v)} />
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-0.5 opacity-100 md:opacity-0 md:transition md:group-hover:opacity-100">
                          {schema.previewHref && (
                            <a href={schema.previewHref(r)} target="_blank" className="grid size-8 place-items-center rounded-full text-muted hover:bg-white hover:text-ink" aria-label="Preview">
                              <ExternalLink className="size-3.5" />
                            </a>
                          )}
                          <button onClick={() => del(r)} className="grid size-8 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-600" aria-label="Delete">
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <SlideOver
        open={!!editing}
        onClose={() => setEditing(null)}
        title={isNew ? `New ${schema.singular.toLowerCase()}` : String(editing?.[schema.titleKey] || `Edit ${schema.singular.toLowerCase()}`)}
        subtitle={isNew ? "Fill in the details and hit create." : `Editing ${schema.singular.toLowerCase()}`}
        footer={
          <>
            {!isNew && editing ? (
              <Button variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => del(editing)}>
                <Trash2 className="size-4" /> Delete
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button onClick={() => setEditing(null)}>Cancel</Button>
              <Button variant="primary" loading={saving} onClick={save}>
                {isNew ? "Create" : "Save changes"}
              </Button>
            </div>
          </>
        }
      >
        {editing && <FieldGrid fields={schema.fields} value={editing} onChange={(v) => setEditing(v as Row)} lookups={lookups} />}
      </SlideOver>
      {dialog}
    </>
  );
}
