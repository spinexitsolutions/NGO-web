"use client";

import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { inr, inrCompact } from "@/lib/admin-format";

export const PALETTE = ["var(--accent)", "#2F6BFF", "#F2A007", "#0FA3B1", "#8B5CF6", "#9CA3AF"];

export function MonthlyArea({ data }: { data: { month: string; amount: number; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 6, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="fillAmt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgb(14 14 12 / 0.06)" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6f6c64" }} dy={6} interval="preserveStartEnd" />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6f6c64" }} tickFormatter={(v) => inrCompact(v)} width={56} />
        <Tooltip
          cursor={{ stroke: "rgb(14 14 12 / 0.15)", strokeDasharray: "3 3" }}
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <div className="rounded-xl bg-ink px-3 py-2 text-xs text-white shadow-xl">
                <div className="text-white/60">{label}</div>
                <div className="text-sm font-semibold tabular-nums">{inr(Number(payload[0].value))}</div>
                <div className="text-white/60">{(payload[0].payload as { count: number }).count} donations</div>
              </div>
            ) : null
          }
        />
        <Area type="monotone" dataKey="amount" stroke="var(--accent)" strokeWidth={2.25} fill="url(#fillAmt)" activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CampaignDonut({ data }: { data: { name: string; value: number }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row lg:flex-col">
      <div className="relative size-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="68%" outerRadius="100%" paddingAngle={2} stroke="none" cornerRadius={4}>
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <div className="rounded-xl bg-ink px-3 py-2 text-xs text-white shadow-xl">
                    {payload[0].name}: <b>{inrCompact(Number(payload[0].value))}</b>
                  </div>
                ) : null
              }
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="text-[11px] text-muted">Total</div>
            <div className="text-lg font-semibold tracking-tight tabular-nums">{inrCompact(total)}</div>
          </div>
        </div>
      </div>
      <ul className="w-full space-y-2 text-[13px]">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
            <span className="min-w-0 truncate text-ink-2">{d.name}</span>
            <span className="ml-auto tabular-nums text-muted">{Math.round((d.value / (total || 1)) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
