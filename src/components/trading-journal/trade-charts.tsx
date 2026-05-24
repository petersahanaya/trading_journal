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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Trade } from "@/lib/types"
import { formatCurrency } from "@/lib/currency"
import { useTradeStore } from "@/store/trade-store"

interface TradeChartsProps {
  trades: Trade[]
}

export function TradeCharts({ trades }: TradeChartsProps) {
  const currency = useTradeStore((s) => s.currency)
  const showValues = useTradeStore((s) => s.showValues)
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
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Cumulative P&L</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pnlOverTime}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs text-muted-foreground" />
                <YAxis className="text-xs text-muted-foreground" />
                <Tooltip content={<ChartTooltipContent formatter={(v) => fmt(v)} />} />
                <Line type="monotone" dataKey="cumulative" stroke="hsl(var(--foreground))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Win / Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={winLossData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90}>
                  {winLossData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent formatter={(v) => showValues ? `${v}` : "****"} />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-2 flex justify-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-green-500" /> Wins: {wins}
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-red-500" /> Losses: {losses}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>P&L by Direction</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pnlDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs text-muted-foreground" />
                <YAxis className="text-xs text-muted-foreground" />
                <Tooltip content={<ChartTooltipContent formatter={(v) => fmt(v)} />} />
                <Bar dataKey="value" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trade Frequency</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getTradeFrequencyData(trades)}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs text-muted-foreground" />
                <YAxis className="text-xs text-muted-foreground" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
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
