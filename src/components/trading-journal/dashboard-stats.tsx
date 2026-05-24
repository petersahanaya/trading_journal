"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trade } from "@/lib/types"
import { calculateWinRate, calculateTotalPnl, calculateTotalTrades, calculateOpenTrades } from "@/lib/data"
import { formatCurrency } from "@/lib/currency"
import { TrendingUp, TrendingDown, BarChart3, BookOpen } from "lucide-react"
import { useTradeStore } from "@/store/trade-store"
import { useMediaQuery } from "@/hooks/use-media-query"

interface DashboardStatsProps {
  trades: Trade[]
}

function HiddenValue({ children }: { children: React.ReactNode }) {
  const showValues = useTradeStore((s) => s.showValues)
  if (showValues) return children
  return <span className="select-none">****</span>
}

export function DashboardStats({ trades }: DashboardStatsProps) {
  const currency = useTradeStore((s) => s.currency)
  const isMobile = useMediaQuery("(max-width: 767px)")
  const winRate = calculateWinRate(trades)
  const totalPnl = calculateTotalPnl(trades)
  const totalTrades = calculateTotalTrades(trades)
  const openTrades = calculateOpenTrades(trades)

  const stats = [
    {
      title: "Total P&L",
      value: formatCurrency(totalPnl, currency),
      icon: totalPnl >= 0 ? TrendingUp : TrendingDown,
      variant: totalPnl >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
    },
    {
      title: "Win Rate",
      value: `${winRate}%`,
      icon: BarChart3,
    },
    {
      title: "Total Trades",
      value: totalTrades.toString(),
      icon: BookOpen,
    },
    {
      title: "Open Positions",
      value: openTrades.toString(),
      icon: BookOpen,
    },
  ]

  if (isMobile) {
    return (
      <div className="rounded-2xl bg-card shadow-sm overflow-hidden divide-y divide-border">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                  <Icon className={`h-4 w-4 ${stat.variant ?? "text-muted-foreground"}`} />
                </div>
                <span className="text-sm text-foreground">{stat.title}</span>
              </div>
              <HiddenValue>
                <span className={`text-sm font-semibold tabular-nums ${stat.variant ?? ""}`}>
                  {stat.value}
                </span>
              </HiddenValue>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} size="sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.variant ?? "text-muted-foreground"}`} />
            </div>
          </CardHeader>
          <CardContent>
            <HiddenValue>
              <div className={`text-2xl font-bold ${stat.variant ?? ""}`}>
                {stat.value}
              </div>
            </HiddenValue>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
