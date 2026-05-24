"use client"

import { useTradeStore } from "@/store/trade-store"
import { TradeCharts } from "@/components/trading-journal/trade-charts"
import { TradeCalendar } from "@/components/trading-journal/trade-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff } from "lucide-react"
import {
  calculateWinRate,
  calculateTotalPnl,
  calculateTotalTrades,
  calculateOpenTrades,
} from "@/lib/data"
import { formatCurrency } from "@/lib/currency"
import { useMediaQuery } from "@/hooks/use-media-query"

function HiddenValue({ children }: { children: React.ReactNode }) {
  const showValues = useTradeStore((s) => s.showValues)
  if (showValues) return children
  return <span className="select-none">****</span>
}

export default function AnalyticsPage() {
  const trades = useTradeStore((s) => s.trades)
  const currency = useTradeStore((s) => s.currency)
  const showValues = useTradeStore((s) => s.showValues)
  const toggleValues = useTradeStore((s) => s.toggleShowValues)
  const isMobile = useMediaQuery("(max-width: 767px)")

  const stats = [
    { title: "Total P&L", value: formatCurrency(calculateTotalPnl(trades), currency) },
    { title: "Win Rate", value: `${calculateWinRate(trades)}%` },
    { title: "Total Trades", value: String(calculateTotalTrades(trades)) },
    { title: "Open Positions", value: String(calculateOpenTrades(trades)) },
  ]

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

  if (isMobile) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Visualize your trading performance and progress.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-end">{eyeButton}</div>
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
        </div>

        <Separator />

        <TradeCharts trades={trades} />

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Trading Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <TradeCalendar trades={trades} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Visualize your trading performance and progress.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-end">{eyeButton}</div>
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

      <TradeCharts trades={trades} />

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Trading Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <TradeCalendar trades={trades} />
        </CardContent>
      </Card>
    </div>
  )
}
