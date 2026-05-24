"use client"

import { useTradeStore } from "@/store/trade-store"
import { DashboardStats } from "@/components/trading-journal/dashboard-stats"
import { TradeForm } from "@/components/trading-journal/trade-form"
import { DataTable } from "@/components/trading-journal/data-table"
import { columns } from "@/components/trading-journal/columns"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  const trades = useTradeStore((s) => s.trades)
  const addTrade = useTradeStore((s) => s.addTrade)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Track your trades, analyze performance, and improve your strategy.
          </p>
        </div>
        <TradeForm onAddTrade={addTrade} />
      </div>

      <DashboardStats trades={trades} />

      <Separator />

      <div>
        <h2 className="mb-4 text-lg font-semibold">Trade History</h2>
        <DataTable columns={columns} data={trades} />
      </div>
    </div>
  )
}
