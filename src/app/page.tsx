"use client"

import { useTradeStore } from "@/store/trade-store"
import { TradeForm } from "@/components/trading-journal/trade-form"
import { DataTable } from "@/components/trading-journal/data-table"
import { columns } from "@/components/trading-journal/columns"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlusIcon, TrendingUpIcon, TrendingDownIcon, BarChart3Icon, WalletIcon, BookOpenIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  calculateWinRate,
  calculateTotalPnl,
  calculateTotalTrades,
  calculateOpenTrades,
  calculateTotalDeposits,
  calculateTotalWithdrawals,
  calculatePnlPercent,
} from "@/lib/data"
import { formatCurrency } from "@/lib/currency"
import { cn } from "@/lib/utils"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

function HiddenValue({ children }: { children: React.ReactNode }) {
  const showValues = useTradeStore((s) => s.showValues)
  if (showValues) return children
  return <span className="select-none">****</span>
}

function StatCard({
  title,
  value,
  icon: Icon,
  variant,
  trend,
}: {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  variant?: string
  trend?: "up" | "down" | "neutral"
}) {
  return (
    <div className="relative flex flex-col gap-2 rounded-2xl border border-outline-variant/40 bg-card p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-on-surface-variant tracking-wide uppercase">{title}</span>
        <div className={cn(
          "flex size-8 items-center justify-center rounded-xl",
          trend === "up" ? "bg-green-50 text-green-600" :
          trend === "down" ? "bg-red-50 text-red-600" :
          "bg-surface-container text-on-surface-variant"
        )}>
          <Icon className="size-4" />
        </div>
      </div>
      <HiddenValue>
        <span className={cn("text-2xl font-bold tracking-tight", variant)}>
          {value}
        </span>
      </HiddenValue>
    </div>
  )
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

export default function Home() {
  const trades = useTradeStore((s) => s.trades)
  const cashflow = useTradeStore((s) => s.cashflow)
  const addTrade = useTradeStore((s) => s.addTrade)
  const accounts = useTradeStore((s) => s.accounts)
  const currency = useTradeStore((s) => s.currency)
  const showValues = useTradeStore((s) => s.showValues)
  const toggleValues = useTradeStore((s) => s.toggleShowValues)
  const [accountFilter, setAccountFilter] = useState("all")
  const [fabOpen, setFabOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 767px)")
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const filteredTrades = accountFilter === "all"
    ? trades
    : trades.filter((t) => t.account === accountFilter)

  const totalPnl = calculateTotalPnl(filteredTrades)
  const winRate = calculateWinRate(filteredTrades)
  const totalTradesCount = calculateTotalTrades(filteredTrades)
  const openTradesCount = calculateOpenTrades(filteredTrades)
  const totalDeposits = calculateTotalDeposits(cashflow)
  const totalWithdrawals = calculateTotalWithdrawals(cashflow)
  const pnlPercent = calculatePnlPercent(totalPnl, totalDeposits)
  const netCashflow = totalDeposits - totalWithdrawals

  const closedTrades = filteredTrades.filter((t) => t.status === "closed" && t.pnl !== null)
  const pnlOverTime = [...closedTrades]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce<{ date: string; cumulative: number }[]>((acc, t) => {
      const prev = acc.length > 0 ? acc[acc.length - 1].cumulative : 0
      acc.push({ date: t.date, cumulative: prev + (t.pnl ?? 0) })
      return acc
    }, [])

  const wins = closedTrades.filter((t) => (t.pnl ?? 0) > 0).length
  const losses = closedTrades.filter((t) => (t.pnl ?? 0) <= 0).length

  const pnlDistribution = [
    { name: "Long", value: filteredTrades.filter((t) => t.direction === "long").reduce((s, t) => s + (t.pnl ?? 0), 0) },
    { name: "Short", value: filteredTrades.filter((t) => t.direction === "short").reduce((s, t) => s + (t.pnl ?? 0), 0) },
  ]

  const fmt = showValues ? (v: number) => formatCurrency(v, currency) : () => "****"

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight leading-[36px]">Dashboard</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Track your trades, analyze performance, and improve your strategy.
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
            {showValues ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </Button>
          <div className="hidden sm:block">
            <TradeForm onAddTrade={addTrade} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:bento-grid">
        <StatCard
          title="Total P&L"
          value={formatCurrency(totalPnl, currency)}
          icon={totalPnl >= 0 ? TrendingUpIcon : TrendingDownIcon}
          variant={totalPnl >= 0 ? "text-green-600" : "text-red-600"}
          trend={totalPnl >= 0 ? "up" : "down"}
        />
        <StatCard
          title="Win Rate"
          value={`${winRate}%`}
          icon={BarChart3Icon}
          trend={winRate >= 50 ? "up" : "down"}
        />
        <StatCard
          title="Total Trades"
          value={totalTradesCount.toString()}
          icon={BookOpenIcon}
          trend="neutral"
        />
        <StatCard
          title="Open Positions"
          value={openTradesCount.toString()}
          icon={WalletIcon}
          trend="neutral"
        />
      </div>

      <div className="bento-grid">
        <ChartCard title="Cumulative P&L" className="col-span-full h-64 lg:h-auto lg:col-span-8">
          <ChartContainer className="h-full">
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

        <div className="col-span-full lg:col-span-4 flex flex-col gap-3 sm:gap-4">
          <ChartCard title="P&L %">
            {pnlPercent !== null ? (
              <div className="flex flex-col items-center justify-center py-4 gap-1">
                <span className={cn(
                  "text-3xl sm:text-4xl font-bold tracking-tight",
                  totalPnl >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {pnlPercent > 0 ? "+" : ""}{pnlPercent}%
                </span>
                <span className="text-xs text-on-surface-variant text-center">
                  vs. total deposits ({formatCurrency(totalDeposits, currency)})
                </span>
                <div className="flex items-center gap-3 mt-2 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-green-500" /> Deposits: <HiddenValue>{formatCurrency(totalDeposits, currency)}</HiddenValue>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-red-500" /> Withdrawals: <HiddenValue>{formatCurrency(totalWithdrawals, currency)}</HiddenValue>
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-sm text-on-surface-variant">
                Add deposits in Settings to see P&L %
              </div>
            )}
          </ChartCard>
          <ChartCard title="P&L by Direction">
            <ChartContainer className="h-28">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pnlDistribution}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-outline-variant/50" />
                    <XAxis dataKey="name" className="text-[10px] text-on-surface-variant" />
                    <YAxis className="text-[10px] text-on-surface-variant" />
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
        </div>
      </div>

      <div className="rounded-2xl border border-outline-variant/40 bg-card p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold">Trade History</h2>
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
        <DataTable columns={columns} data={filteredTrades} />
      </div>

      {isMobile && (
        <TradeForm onAddTrade={addTrade} open={fabOpen} onOpenChange={setFabOpen} />
      )}

      {isMobile && (
        <button
          type="button"
          onClick={() => setFabOpen(true)}
          className="fixed bottom-20 right-5 z-40 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg transition-all active:scale-90 hover:shadow-xl"
          aria-label="Add trade"
        >
          <PlusIcon className="size-6" />
        </button>
      )}
    </div>
  )
}
