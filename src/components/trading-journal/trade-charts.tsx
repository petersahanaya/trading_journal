"use client"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Trade } from "@/lib/types"
import { formatCurrency } from "@/lib/currency"
import { useTradeStore } from "@/store/trade-store"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TradeChartsProps {
  trades: Trade[]
}

function ChartCard({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("rounded-2xl border border-outline-variant/40 bg-card p-5 shadow-sm", className)}>
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  )
}

export function TradeCharts({ trades }: TradeChartsProps) {
  const currency = useTradeStore((s) => s.currency)
  const showValues = useTradeStore((s) => s.showValues)
  const isMobile = useMediaQuery("(max-width: 767px)")
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const fmt = showValues ? (v: number) => formatCurrency(v, currency) : () => "****"
  const closedTrades = trades.filter((t) => t.status === "closed" && t.pnl !== null)

  const pnlOverTime = [...closedTrades]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce<{ date: string; cumulative: number }[]>((acc, t) => {
      const prev = acc.length > 0 ? acc[acc.length - 1].cumulative : 0
      acc.push({ date: t.date, cumulative: prev + (t.pnl ?? 0) })
      return acc
    }, [])

  const wins = closedTrades.filter((t) => (t.pnl ?? 0) > 0).length
  const losses = closedTrades.filter((t) => (t.pnl ?? 0) <= 0).length

  const winLossData = [
    { name: "Wins", value: wins, color: "#22c55e" },
    { name: "Losses", value: losses, color: "#ef4444" },
  ]

  const pnlDistribution = [
    { name: "Long", value: trades.filter((t) => t.direction === "long").reduce((s, t) => s + (t.pnl ?? 0), 0) },
    { name: "Short", value: trades.filter((t) => t.direction === "short").reduce((s, t) => s + (t.pnl ?? 0), 0) },
  ]

  return (
    <div className="bento-grid">
      <ChartCard title="Cumulative P&L" className="col-span-full lg:col-span-6">
        <ChartContainer className="h-48 sm:h-56">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pnlOverTime}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-outline-variant/50" />
                <XAxis dataKey="date" className="text-[10px] sm:text-xs text-on-surface-variant" />
                <YAxis className="text-[10px] sm:text-xs text-on-surface-variant" />
                <Tooltip content={<ChartTooltipContent formatter={(v) => fmt(v)} />} />
                <Line type="monotone" dataKey="cumulative" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
      </ChartCard>

      <ChartCard title="Win / Loss" className="col-span-full lg:col-span-3">
        <ChartContainer className="h-48 sm:h-56">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={winLossData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={isMobile ? 40 : 55} outerRadius={isMobile ? 65 : 80}>
                  {winLossData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent formatter={(v) => showValues ? `${v}` : "****"} />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
        <div className="mt-2 flex justify-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-green-500" /> Wins: {wins}
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-red-500" /> Losses: {losses}
          </span>
        </div>
      </ChartCard>

      <ChartCard title="P&L by Direction" className="col-span-full lg:col-span-3">
        <ChartContainer className="h-48 sm:h-56">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pnlDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-outline-variant/50" />
                <XAxis dataKey="name" className="text-[10px] sm:text-xs text-on-surface-variant" />
                <YAxis className="text-[10px] sm:text-xs text-on-surface-variant" />
                <Tooltip content={<ChartTooltipContent formatter={(v) => fmt(v)} />} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {pnlDistribution.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "var(--color-chart-1)" : "var(--color-chart-2)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
      </ChartCard>

      <ChartCard title="Trade Frequency" className="col-span-full lg:col-span-6">
        <ChartContainer className="h-48 sm:h-56">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getTradeFrequencyData(trades)}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-outline-variant/50" />
                <XAxis dataKey="date" className="text-[10px] sm:text-xs text-on-surface-variant" />
                <YAxis className="text-[10px] sm:text-xs text-on-surface-variant" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
      </ChartCard>
    </div>
  )
}

function getTradeFrequencyData(trades: Trade[]) {
  const counts: Record<string, number> = {}
  for (const t of trades) {
    counts[t.date] = (counts[t.date] ?? 0) + 1
  }
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, count]) => ({ date, count }))
}
