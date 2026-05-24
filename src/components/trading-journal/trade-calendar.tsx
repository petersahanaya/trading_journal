"use client"

import { useMemo, useState } from "react"
import { Trade } from "@/lib/types"
import { formatCurrency } from "@/lib/currency"
import { useTradeStore } from "@/store/trade-store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

interface TradeCalendarProps {
  trades: Trade[]
}

export function TradeCalendar({ trades }: TradeCalendarProps) {
  const currency = useTradeStore((s) => s.currency)
  const showValues = useTradeStore((s) => s.showValues)
  const [viewDate, setViewDate] = useState(new Date())

  const { weeks, monthLabel } = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const startPad = firstDay.getDay()
    const totalDays = lastDay.getDate()

    const days: { date: string; day: number; pnl: number; tradeCount: number }[] = []

    for (let i = 0; i < startPad; i++) {
      days.push({ date: "", day: 0, pnl: 0, tradeCount: 0 })
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
      const dayTrades = trades.filter((t) => t.date === dateStr)
      const pnl = dayTrades.reduce((s, t) => s + (t.pnl ?? 0), 0)
      days.push({ date: dateStr, day: d, pnl, tradeCount: dayTrades.length })
    }

    const weeks: typeof days[] = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }

    return {
      weeks,
      monthLabel: `${MONTH_NAMES[month]} ${year}`,
    }
  }, [trades, viewDate])

  function goBack() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }

  function goForward() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  function goToday() {
    setViewDate(new Date())
  }

  function getCellBg(pnl: number, hasTrades: boolean): string {
    if (!hasTrades) return "bg-muted/30"
    if (pnl === 0) return "bg-muted/50"
    if (pnl > 0) {
      if (pnl > 500) return "bg-green-500 dark:bg-green-400"
      if (pnl > 100) return "bg-green-400 dark:bg-green-500"
      return "bg-green-200 dark:bg-green-700"
    }
    if (pnl < -500) return "bg-red-500 dark:bg-red-400"
    if (pnl < -100) return "bg-red-400 dark:bg-red-500"
    return "bg-red-200 dark:bg-red-700"
  }

  function getTextColor(pnl: number, hasTrades: boolean): string {
    if (!hasTrades) return "text-muted-foreground"
    if (pnl === 0) return "text-muted-foreground"
    if (pnl > 0) {
      if (pnl > 100) return "text-white"
      return "text-green-900 dark:text-green-100"
    }
    if (pnl < -100) return "text-white"
    return "text-red-900 dark:text-red-100"
  }

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{monthLabel}</h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-xs" onClick={goBack} aria-label="Previous month">
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="xs" onClick={goToday} className="text-xs">
            Today
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={goForward} aria-label="Next month">
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DAY_NAMES.map((name) => (
          <div key={name} className="text-center text-xs font-medium text-muted-foreground py-1">
            {name}
          </div>
        ))}
        {weeks.map((week, wi) =>
          week.map((day, di) => (
            <div
              key={`${wi}-${di}`}
              className={cn(
                "min-h-[3.5rem] rounded-md flex flex-col items-center justify-center text-xs relative group cursor-default px-0.5",
                day.day === 0 ? "invisible" : getCellBg(day.pnl, day.tradeCount > 0)
              )}
            >
              <span className={cn("font-medium leading-tight", getTextColor(day.pnl, day.tradeCount > 0))}>
                {day.day}
              </span>
              {day.tradeCount > 0 && (
                <span
                  className={cn(
                    "text-[10px] leading-tight mt-0.5 truncate max-w-full px-0.5",
                    getTextColor(day.pnl, day.tradeCount > 0)
                  )}
                >
                  {showValues ? formatCurrency(day.pnl, currency) : "****"}
                </span>
              )}
            </div>
          ))
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="size-3 rounded bg-green-200 dark:bg-green-700" /> Low +
        </span>
        <span className="flex items-center gap-1">
          <span className="size-3 rounded bg-green-400 dark:bg-green-500" /> Med +
        </span>
        <span className="flex items-center gap-1">
          <span className="size-3 rounded bg-green-500 dark:bg-green-400" /> High +
        </span>
        <span className="flex items-center gap-1">
          <span className="size-3 rounded bg-red-200 dark:bg-red-700" /> Low -
        </span>
        <span className="flex items-center gap-1">
          <span className="size-3 rounded bg-red-400 dark:bg-red-500" /> Med -
        </span>
        <span className="flex items-center gap-1">
          <span className="size-3 rounded bg-red-500 dark:bg-red-400" /> High -
        </span>
      </div>
    </div>
  )
}
