"use client"

import { useState } from "react"
import { useTradeStore } from "@/store/trade-store"
import { TradeCharts } from "@/components/trading-journal/trade-charts"
import { TradeCalendar } from "@/components/trading-journal/trade-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
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

function HiddenValue({ children }: { children: React.ReactNode }) {
  const showValues = useTradeStore((s) => s.showValues)
  if (showValues) return children
  return <span className="select-none">****</span>
}

export default function AnalyticsPage() {
  const trades = useTradeStore((s) => s.trades)
  const accounts = useTradeStore((s) => s.accounts)
  const [accountFilter, setAccountFilter] = useState("all")

  const filteredTrades = accountFilter === "all"
    ? trades
    : trades.filter((t) => t.account === accountFilter)

  const currency = useTradeStore((s) => s.currency)
  const showValues = useTradeStore((s) => s.showValues)
  const toggleValues = useTradeStore((s) => s.toggleShowValues)
  const isMobile = useMediaQuery("(max-width: 767px)")
  const fmt = showValues ? (v: number) => formatCurrency(v, currency) : () => "****"

  const stats = [
    { title: "Total P&L", value: formatCurrency(calculateTotalPnl(filteredTrades), currency) },
    { title: "Win Rate", value: `${calculateWinRate(filteredTrades)}%` },
    { title: "Total Trades", value: String(calculateTotalTrades(filteredTrades)) },
    { title: "Open Positions", value: String(calculateOpenTrades(filteredTrades)) },
  ]

  const dailyPnl = calculateDailyPnl(filteredTrades)

  const eyeButton = (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleValues}
      aria-label={showValues ? "Hide values" : "Show values"}
    >
      {showValues ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </Button>
  )

  const dailyPnlChart = dailyPnl.length > 0 && (
    <Card>
      <CardHeader>
        <CardTitle>Daily P&L</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyPnl}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" className="text-xs text-muted-foreground" />
              <YAxis className="text-xs text-muted-foreground" />
              <Tooltip content={<ChartTooltipContent formatter={(v) => fmt(v)} />} />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {dailyPnl.map((entry, i) => (
                  <Cell key={i} fill={entry.pnl >= 0 ? "#22c55e" : "#ef4444"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )

  const accountFilterSection = (
    <div className="flex items-center gap-2">
      <Label htmlFor="analytics-account" className="text-sm text-muted-foreground whitespace-nowrap">
        Account
      </Label>
      <Select value={accountFilter} onValueChange={(v) => v && setAccountFilter(v)}>
        <SelectTrigger id="analytics-account" className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {accounts.map((a) => (
            <SelectItem key={a} value={a}>{a}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  if (isMobile) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Visualize your trading performance and progress.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          {accountFilterSection}
          {eyeButton}
        </div>

        <div className="rounded-2xl bg-card shadow-sm overflow-hidden divide-y divide-border">
          {stats.map((stat) => (
            <div key={stat.title} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-foreground">{stat.title}</span>
              <HiddenValue>
                <span className="text-sm font-semibold tabular-nums">{stat.value}</span>
              </HiddenValue>
            </div>
          ))}
        </div>

        <Separator />

        <TradeCharts trades={filteredTrades} />

        {dailyPnlChart}

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Trading Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <TradeCalendar trades={filteredTrades} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Visualize your trading performance and progress.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          {accountFilterSection}
          {eyeButton}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} size="sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HiddenValue>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </HiddenValue>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      <TradeCharts trades={filteredTrades} />

      {dailyPnlChart}

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Trading Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <TradeCalendar trades={filteredTrades} />
        </CardContent>
      </Card>
    </div>
  )
}
