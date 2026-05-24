"use client"

import { useTradeStore } from "@/store/trade-store"
import { DashboardStats } from "@/components/trading-journal/dashboard-stats"
import { TradeForm } from "@/components/trading-journal/trade-form"
import { DataTable } from "@/components/trading-journal/data-table"
import { columns } from "@/components/trading-journal/columns"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function Home() {
  const trades = useTradeStore((s) => s.trades)
  const addTrade = useTradeStore((s) => s.addTrade)
  const accounts = useTradeStore((s) => s.accounts)
  const [accountFilter, setAccountFilter] = useState("all")

  const filteredTrades = accountFilter === "all"
    ? trades
    : trades.filter((t) => t.account === accountFilter)

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

      <DashboardStats trades={filteredTrades} />

      <Separator />

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Trade History</h2>
          <div className="flex items-center gap-2">
            <Label htmlFor="account-filter" className="text-sm text-muted-foreground">
              Account
            </Label>
            <Select value={accountFilter} onValueChange={(v) => v && setAccountFilter(v)}>
              <SelectTrigger id="account-filter" className="w-36">
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
        </div>
        <DataTable columns={columns} data={filteredTrades} />
      </div>
    </div>
  )
}
