"use client"

import { useState, useEffect } from "react"
import { useTradeStore } from "@/store/trade-store"
import { TradeCharts } from "@/components/trading-journal/trade-charts"
import { TradeCalendar } from "@/components/trading-journal/trade-calendar"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, EyeOff } from "lucide-react"
import {
  calculateWinRate,
  calculateTotalPnl,
  calculateTotalTrades,
  calculateOpenTrades,
  calculateDailyPnl,
} from "@/lib/data"
import { formatCurrency } from "@/lib/currency"
import { useMediaQuery } from "@/hooks/use-media-query"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

function HiddenValue({ children }: { children: React.ReactNode }) {
  const showValues = useTradeStore((s) => s.showValues)
  if (showValues) return children
  return <span className="select-none">****</span>
}

function StatCard({
  title,
  value,
  variant,
}: {
  title: string
  value: string
  variant?: string
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-outline-variant/40 bg-card p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <span className="text-xs font-medium text-on-surface-variant tracking-wide uppercase">{title}</span>
      <HiddenValue>
        <span className={cn("text-2xl font-bold tracking-tight", variant)}>{value}</span>
      </HiddenValue>
    </div>
  )
}

export default function AnalyticsPage() {
  const trades = useTradeStore((s) => s.trades)
  const accounts = useTradeStore((s) => s.accounts)
  const [accountFilter, setAccountFilter] = useState("all")
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const filteredTrades = accountFilter === "all"
    ? trades
    : trades.filter((t) => t.account === accountFilter)

  const currency = useTradeStore((s) => s.currency)
  const showValues = useTradeStore((s) => s.showValues)
  const toggleValues = useTradeStore((s) => s.toggleShowValues)
  const isMobile = useMediaQuery("(max-width: 767px)")
  const fmt = showValues ? (v: number) => formatCurrency(v, currency) : () => "****"

  const dailyPnl = calculateDailyPnl(filteredTrades)

  const stats = [
    { title: "Total P&L", value: formatCurrency(calculateTotalPnl(filteredTrades), currency), variant: calculateTotalPnl(filteredTrades) >= 0 ? "text-green-600" : "text-red-600" },
    { title: "Win Rate", value: `${calculateWinRate(filteredTrades)}%` },
    { title: "Total Trades", value: String(calculateTotalTrades(filteredTrades)) },
    { title: "Open Positions", value: String(calculateOpenTrades(filteredTrades)) },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight leading-[36px]">Analytics</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Visualize your trading performance and progress.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleValues}
            aria-label={showValues ? "Hide values" : "Show values"}
            className="rounded-full"
          >
            {showValues ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
          <div className="flex items-center gap-2">
            <Select value={accountFilter} onValueChange={(v) => v && setAccountFilter(v)}>
              <SelectTrigger className="h-8 w-32 text-xs rounded-lg border-outline-variant/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {accounts.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} variant={stat.variant} />
        ))}
      </div>

      <div className="bento-grid">
        <div className="col-span-full lg:col-span-8 rounded-2xl border border-outline-variant/40 bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold">Daily P&L</h3>
          <ChartContainer className="h-48 sm:h-64">
            {mounted && dailyPnl.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyPnl}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-outline-variant/50" />
                  <XAxis dataKey="date" className="text-[10px] sm:text-xs text-on-surface-variant" />
                  <YAxis className="text-[10px] sm:text-xs text-on-surface-variant" />
                  <Tooltip content={<ChartTooltipContent formatter={(v) => fmt(v)} />} />
                  <Bar dataKey="pnl" radius={[6, 6, 0, 0]}>
                    {dailyPnl.map((entry, i) => (
                      <Cell key={i} fill={entry.pnl >= 0 ? "#22c55e" : "#ef4444"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            {mounted && dailyPnl.length === 0 && (
              <div className="flex items-center justify-center h-full text-sm text-on-surface-variant">
                No trade data to display
              </div>
            )}
          </ChartContainer>
        </div>

        <div className="col-span-full lg:col-span-4 rounded-2xl border border-outline-variant/40 bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold">Trading Calendar</h3>
          <TradeCalendar trades={filteredTrades} />
        </div>
      </div>

      <TradeCharts trades={filteredTrades} />
    </div>
  )
}
